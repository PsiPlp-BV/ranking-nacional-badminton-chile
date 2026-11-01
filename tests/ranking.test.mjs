// Tests for lib/ranking.ts — the pure aggregation/sorting engine behind the
// Ranking table and every player's "Posición en ranking" card. Traídos tal
// cual del sitio HTML original (js/ranking.js), del que lib/ranking.ts es un
// port fiel: mismas funciones, mismas firmas, mismos resultados esperados.
//
// Run with:  npm test   (Node >= 23 ejecuta el .ts sin compilar: solo
// importa tipos, que se borran al cargar)
//
// These use a small synthetic fixture on purpose (not the real 65-athlete
// dataset) — a handful of hand-picked results makes every expected number
// traceable by eye, which is the point of a regression test for something
// that decides real people's standings.

import test from "node:test";
import assert from "node:assert/strict";
import * as RankingEngine from "../lib/ranking.ts";

const modalityById = {
  IM: { id: "IM", label: "Individuales Masculino", doubles: false },
  DM: { id: "DM", label: "Dobles Masculino", doubles: true },
};
const FECHA_NUMS = [1, 2, 3];

function result(over) {
  return Object.assign({ fecha: 1, event: "X", category: "TestCat", modality: "IM", position: null, points: 10, partner: null }, over);
}

// --- Fixture -----------------------------------------------------------
// Fecha 1, Individuales Masculino: A champion, B runner-up, C & D tied
// bronze (both semifinal losers — no 3rd-place playoff, matches real
// tournament rules), E gets participation points only.
// Fecha 2, Individuales Masculino: B wins it, A is runner-up (so across
// both fechas A and B end up tied on total points AND tied on medal
// counts too — this is what exercises the full tie-break chain).
// Fecha 1, Dobles Masculino: pair (A,B) champions, pair (C,D) runners-up.
// A also has a big result in a different category, to prove categories
// never leak into each other's totals.
function makeFixture() {
  const A = { id: "a", name: "Ana", club: "Club Uno", results: [] };
  const B = { id: "b", name: "Beto", club: "Club Uno", results: [] };
  const C = { id: "c", name: "Caro", club: "Club Dos", results: [] };
  const D = { id: "d", name: "Dani", club: "Club Dos", results: [] };
  const E = { id: "e", name: "Edu", club: "Club Dos", results: [] };

  A.results.push(result({ fecha: 1, event: "IM1", position: 1, points: 100 }));
  B.results.push(result({ fecha: 1, event: "IM1", position: 2, points: 80 }));
  C.results.push(result({ fecha: 1, event: "IM1", position: 3, points: 60 }));
  D.results.push(result({ fecha: 1, event: "IM1", position: 3, points: 60 }));
  E.results.push(result({ fecha: 1, event: "IM1", position: null, points: 10 }));

  B.results.push(result({ fecha: 2, event: "IM2", position: 1, points: 100 }));
  A.results.push(result({ fecha: 2, event: "IM2", position: 2, points: 80 }));

  A.results.push(result({ fecha: 1, event: "DM1", modality: "DM", position: 1, points: 100, partner: "Beto" }));
  B.results.push(result({ fecha: 1, event: "DM1", modality: "DM", position: 1, points: 100, partner: "Ana" }));
  C.results.push(result({ fecha: 1, event: "DM1", modality: "DM", position: 2, points: 80, partner: "Dani" }));
  D.results.push(result({ fecha: 1, event: "DM1", modality: "DM", position: 2, points: 80, partner: "Caro" }));

  A.results.push(result({ fecha: 1, event: "OTHER1", category: "OtherCat", position: 1, points: 100 }));

  return [A, B, C, D, E];
}

test("singles: position -> points flow through untouched, bronze can tie", () => {
  const players = makeFixture();
  const rows = RankingEngine.buildRankingRows(players, "TestCat", "IM", modalityById, FECHA_NUMS);
  const sorted = RankingEngine.sortRankingRows(rows, 1); // Fecha 1 only

  const byName = Object.fromEntries(sorted.map(r => [r.names[0], r]));
  assert.equal(byName.Ana.rank, 1);
  assert.equal(byName.Beto.rank, 2);
  assert.equal(byName.Caro.rank, 3);
  assert.equal(byName.Dani.rank, 3, "both semifinal losers share bronze rank");
  assert.equal(byName.Edu.rank, 5, "the tied 3rd place pushes the next rank to 5, not 4");
});

test("category isolation: a result in another category never leaks in", () => {
  const players = makeFixture();
  const rows = RankingEngine.buildRankingRows(players, "TestCat", "general", modalityById, FECHA_NUMS);
  const ana = rows.find(r => r.names[0] === "Ana");
  // Ana's TestCat total = 100 (IM f1) + 80 (IM f2) + 100 (DM f1) = 280,
  // NOT +100 for the OtherCat result.
  assert.equal(ana.total.points, 280);
});

test("fecha filtering drops rows with no result that fecha, keeps others", () => {
  const players = makeFixture();
  const rows = RankingEngine.buildRankingRows(players, "TestCat", "IM", modalityById, FECHA_NUMS);
  const fecha2 = RankingEngine.sortRankingRows(rows, 2);
  assert.equal(fecha2.length, 2, "only Ana and Beto played Fecha 2 IM");
  assert.equal(fecha2[0].names[0], "Beto");
  assert.equal(fecha2[0].rank, 1);
  assert.equal(fecha2[1].names[0], "Ana");
});

test("full tie-break chain: points, then gold, then silver, then name", () => {
  const players = makeFixture();
  const rows = RankingEngine.buildRankingRows(players, "TestCat", "IM", modalityById, FECHA_NUMS);
  const total = RankingEngine.sortRankingRows(rows, "total");
  // Ana: 100+80=180 pts, 1 gold, 1 silver. Beto: 80+100=180 pts, 1 gold, 1 silver.
  // Everything ties, so it falls all the way to alphabetical order.
  assert.equal(total[0].names[0], "Ana");
  assert.equal(total[1].names[0], "Beto");
  assert.equal(total[0].rank, 1);
  assert.equal(total[1].rank, 1, "a genuine full tie shares rank 1, not 1/2");
});

test("doubles: both partners collapse into a single pair row, points shared", () => {
  const players = makeFixture();
  const rows = RankingEngine.buildRankingRows(players, "TestCat", "DM", modalityById, FECHA_NUMS);
  assert.equal(rows.length, 2, "two pairs entered, not four individual rows");
  const champs = rows.find(r => r.names.includes("Ana"));
  assert.deepEqual(new Set(champs.names), new Set(["Ana", "Beto"]));
  assert.equal(champs.total.points, 100);
  const runnersUp = rows.find(r => r.names.includes("Caro"));
  assert.equal(runnersUp.total.points, 80);
});

test("playerRankIn matches the row the player actually appears in", () => {
  const players = makeFixture();
  const ana = players.find(p => p.name === "Ana");
  const rk = RankingEngine.playerRankIn(players, ana, "TestCat", "IM", modalityById, FECHA_NUMS, "total");
  assert.equal(rk.rank, 1);
  assert.equal(rk.total, 5, "all 5 players have some IM result across the season");
  assert.equal(rk.points, 180);
});

test("a category nobody has played returns no rows, not a crash", () => {
  const players = makeFixture();
  const rows = RankingEngine.buildRankingRows(players, "NoOneHere", "IM", modalityById, FECHA_NUMS);
  assert.deepEqual(rows, []);
});
