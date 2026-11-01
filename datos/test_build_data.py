# -*- coding: utf-8 -*-
"""
Tests for the scoring logic in build_data.py — the "raw bracket results ->
points" half of the pipeline (js/ranking.js in tests/ranking.test.js covers
the other half: aggregating already-computed points into a sorted ranking).

Run:
    python -m unittest discover scripts
"""
import unittest

from build_data import (points_for, compute_results, compute_club_scores, make_event,
                        players_for_fecha, build_club_table, add_inscriptions, CLUB_RULES)


class PointsForTests(unittest.TestCase):
    def test_official_table(self):
        self.assertEqual(points_for(1), 100)
        self.assertEqual(points_for(2), 80)
        self.assertEqual(points_for(3), 60)
        self.assertEqual(points_for(4), 50)
        self.assertEqual(points_for(5), 30)
        self.assertEqual(points_for("participation"), 10)

    def test_quarterfinalist_tier_is_a_catch_all(self):
        # Positions beyond 5 (e.g. a round-of-16 loser handed position 7)
        # must still land in the 5th-8th tier, not raise/return None.
        self.assertEqual(points_for(6), 30)
        self.assertEqual(points_for(8), 30)


def identity_club(_name):
    return "Club Test"


class ComputeResultsTests(unittest.TestCase):
    def test_elimination_final_and_tied_bronze(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 8, {
            1: [("Ana",)],
            2: [("Beto",)],
            3: [("Caro",), ("Dani",)],
        })]
        players = compute_results(events, identity_club)
        self.assertEqual(players["Ana"]["total_points"], 100)
        self.assertEqual(players["Ana"]["gold"], 1)
        self.assertEqual(players["Beto"]["total_points"], 80)
        self.assertEqual(players["Caro"]["total_points"], 60)
        self.assertEqual(players["Dani"]["total_points"], 60)
        self.assertEqual(players["Caro"]["bronze"], 1)
        self.assertEqual(players["Dani"]["bronze"], 1, "both semifinal losers get bronze, not just one")

    def test_round_robin_fourth_place(self):
        events = [make_event(1, "Cat", "Individuales Femenino", "GS", "rr", 4, {
            1: [("Ana",)], 2: [("Beto",)], 3: [("Caro",)], 4: [("Dani",)],
        })]
        players = compute_results(events, identity_club)
        self.assertEqual(players["Dani"]["total_points"], 50, "4th place only scores in round-robin draws")

    def test_participation_only_tier(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 16, {
            1: [("Ana",)],
        }, participation=[("Zoe",)])]
        players = compute_results(events, identity_club)
        self.assertEqual(players["Zoe"]["total_points"], 10)
        self.assertEqual(players["Zoe"]["gold"], 0)

    def test_doubles_both_partners_get_full_points(self):
        events = [make_event(1, "Cat", "Dobles Masculino", "MD", "elim", 8, {
            1: [("Ana", "Beto")],
        })]
        players = compute_results(events, identity_club)
        self.assertEqual(players["Ana"]["total_points"], 100)
        self.assertEqual(players["Beto"]["total_points"], 100, "both doubles partners score the full points, not half")
        self.assertEqual(players["Ana"]["results"][0]["partner"], "Beto")
        self.assertEqual(players["Beto"]["results"][0]["partner"], "Ana")

    def test_same_player_across_two_categories_sums_both(self):
        events = [
            make_event(1, "Sub19", "Individuales Masculino", "BS19", "elim", 4, {1: [("Ana",)]}),
            make_event(1, "Adulto", "Individuales Masculino", "MS", "elim", 4, {2: [("Ana",)]}),
        ]
        players = compute_results(events, identity_club)
        self.assertEqual(players["Ana"]["total_points"], 180)
        self.assertEqual(sorted(players["Ana"]["categories"]), ["Adulto", "Sub19"])

    def test_unknown_club_lookup_raises(self):
        def strict_club(name):
            raise KeyError(name)
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Nadie",)]})]
        with self.assertRaises(KeyError):
            compute_results(events, strict_club)


class ClubScoreTests(unittest.TestCase):
    def test_base_plus_athletes_plus_medals(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {
            1: [("Ana",)], 2: [("Beto",)],
        })]
        players = compute_results(events, lambda n: "Club Uno")
        scores = compute_club_scores(players, {"Club Uno": "C1"}, CLUB_RULES)
        club = scores[0]
        # base 50 + 2 athletes + 1 gold*7 + 1 silver*5 = 50+2+7+5 = 64
        self.assertEqual(club["points"], 64)
        self.assertEqual(club["athletes"], 2)

    def test_bonus_for_more_than_ten_athletes(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 16, {
            1: [(f"P{i}",) for i in range(1)],
        }, participation=[(f"P{i}",) for i in range(2, 13)])]  # 12 participants total incl. winner
        players = compute_results(events, lambda n: "Club Grande")
        scores = compute_club_scores(players, {}, CLUB_RULES)
        self.assertEqual(scores[0]["athletes"], 12)
        # base 50 + 12 athletes + 1 gold*7 + 20 bonus (>10 athletes) = 89
        self.assertEqual(scores[0]["points"], 89)

    def test_independiente_excluded_from_club_ranking(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]})]
        players = compute_results(events, lambda n: "Independiente")
        scores = compute_club_scores(players, {}, CLUB_RULES)
        self.assertEqual(scores, [], "unaffiliated athletes must not produce a phantom club standing")

    def test_ranking_sorted_and_numbered(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {
            1: [("Ana",)],
        })]
        players = compute_results(events, lambda n: "Club A" if n == "Ana" else "Club B")
        players["Solo B"] = dict(name="Solo B", club="Club B", results=[], total_points=0,
                                  gold=0, silver=0, bronze=0, categories=set(), modalities=set())
        scores = compute_club_scores(players, {}, CLUB_RULES)
        self.assertEqual(scores[0]["name"], "Club A")
        self.assertEqual(scores[0]["rank"], 1)
        self.assertEqual(scores[1]["rank"], 2)


class MultiFechaClubTests(unittest.TestCase):
    """
    El puntaje de clubes se evalúa POR FECHA y después se suma. Estos tests
    existen porque el error fácil es calcularlo una vez sobre todo el circuito:
    eso cobraría la base de 50 y el bono por plantel una sola vez, y le daría
    puntos de una fecha a un club que ni siquiera viajó.
    """

    def _table(self, events, club_by_fecha, fecha_nums=(1, 2)):
        current = {}
        for n in fecha_nums:
            current.update({k: v for k, v in club_by_fecha[n].items()})
        players = compute_results(events, lambda n: current[n])
        resolvers = {n: (lambda m: (lambda name: m[name]))(club_by_fecha[n]) for n in fecha_nums}
        table = build_club_table(players, list(fecha_nums), resolvers, {}, {})
        return {c["name"]: c for c in table}

    def test_base_is_charged_once_per_fecha(self):
        events = [
            make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)], 2: [("Beto",)]}),
            make_event(2, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]}),
        ]
        by = {1: {"Ana": "Club Uno", "Beto": "Club Uno"}, 2: {"Ana": "Club Uno", "Beto": "Club Uno"}}
        uno = self._table(events, by)["Club Uno"]
        self.assertEqual(uno["by_fecha"][1], 64, "50 base + 2 inscritos + oro 7 + plata 5")
        self.assertEqual(uno["by_fecha"][2], 58, "50 base + 1 inscrito + oro 7")
        self.assertEqual(uno["total_points"], 122, "el total es la suma de las fechas, no un cálculo global")

    def test_club_absent_from_a_fecha_scores_zero_there(self):
        events = [
            make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)], 2: [("Zoe",)]}),
            make_event(2, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]}),
        ]
        by = {1: {"Ana": "Club Uno", "Zoe": "Club Dos"}, 2: {"Ana": "Club Uno", "Zoe": "Club Dos"}}
        dos = self._table(events, by)["Club Dos"]
        self.assertEqual(dos["by_fecha"][2], 0, "no viajó a la fecha 2: no cobra la base de 50")
        self.assertEqual(dos["total_points"], dos["by_fecha"][1])

    def test_athletes_counts_distinct_people_not_entries_per_fecha(self):
        events = [
            make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]}),
            make_event(2, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]}),
        ]
        by = {1: {"Ana": "Club Uno"}, 2: {"Ana": "Club Uno"}}
        self.assertEqual(self._table(events, by)["Club Uno"]["athletes"], 1,
                          "quien compite en las dos fechas es un deportista, no dos")

    def test_club_change_credits_each_fecha_to_the_right_club(self):
        events = [
            make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]}),
            make_event(2, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]}),
        ]
        by = {1: {"Ana": "Club A"}, 2: {"Ana": "Club B"}}
        table = self._table(events, by)
        self.assertEqual(table["Club A"]["by_fecha"][1], 58)
        self.assertEqual(table["Club A"]["by_fecha"][2], 0)
        self.assertEqual(table["Club B"]["by_fecha"][1], 0)
        self.assertEqual(table["Club B"]["by_fecha"][2], 58)
        self.assertEqual(table["Club A"]["gold"], 1, "el oro de la fecha 1 queda con el club de la fecha 1")
        self.assertEqual(table["Club B"]["gold"], 1)

    def test_players_for_fecha_recounts_medals_within_the_fecha(self):
        events = [
            make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]}),
            make_event(2, "Cat", "Individuales Masculino", "MS", "elim", 4, {2: [("Ana",)]}),
        ]
        players = compute_results(events, identity_club)
        f2 = players_for_fecha(players, 2, identity_club)
        self.assertEqual(f2["Ana"]["gold"], 0, "el oro fue en la fecha 1, no debe contarse en la 2")
        self.assertEqual(f2["Ana"]["silver"], 1)
        self.assertEqual(f2["Ana"]["total_points"], 80)


class InscriptionTests(unittest.TestCase):
    def test_debutant_gets_empty_profile_and_veteran_keeps_points(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]})]
        players = compute_results(events, identity_club)
        add_inscriptions(players, 3, [("Ana", ["Adulto"]), ("Beto", ["Sub15", "Adulto"])], identity_club)

        self.assertEqual(players["Ana"]["total_points"], 100)
        self.assertEqual(players["Ana"]["inscripciones"], [dict(fecha=3, categorias=["Adulto"])])
        self.assertEqual(players["Beto"]["results"], [])
        self.assertEqual(players["Beto"]["total_points"], 0)
        self.assertEqual(players["Beto"]["club"], "Club Test")
        self.assertEqual(players["Beto"]["inscripciones"], [dict(fecha=3, categorias=["Sub15", "Adulto"])])

    def test_inscribed_without_results_adds_nothing_to_club_table(self):
        events = [make_event(1, "Cat", "Individuales Masculino", "MS", "elim", 4, {1: [("Ana",)]})]
        players = compute_results(events, identity_club)
        add_inscriptions(players, 2, [("Beto", ["Adulto"])], identity_club)
        table = build_club_table(players, [1], {1: identity_club}, {}, {})
        self.assertEqual(len(table), 1)
        self.assertEqual(table[0]["athletes"], 1, "Beto aún no juega: no cuenta en el plantel")
        self.assertEqual(table[0]["total_points"], CLUB_RULES["base"] + 1 + CLUB_RULES["oro"])


if __name__ == "__main__":
    unittest.main()
