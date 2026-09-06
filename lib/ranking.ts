/**
 * Motor de ranking — funciones puras, sin DOM.
 *
 * Port fiel de `js/ranking.js` del sitio original. Es la pieza que decide
 * dónde queda un deportista real en un ranking oficial, así que mantiene las
 * mismas garantías, con los mismos nombres, para que siga siendo comparable
 * con `tests/ranking.test.js` de allá:
 *
 *  - Las categorías NUNCA se mezclan. "general" combina modalidades dentro de
 *    UNA categoría; quien juega dos categorías no debe rankear más alto solo
 *    por tener más resultados que sumar.
 *  - En dobles, ambos integrantes suman el puntaje completo a su ranking
 *    individual, pero la tabla de dobles colapsa la pareja en una fila.
 *  - Los empates comparten número de posición.
 */
import type { Metric, Modality, Player, RankingRow, FechaScope } from "./types";

export function emptyMetric(): Metric {
  return { points: 0, gold: 0, silver: 0, bronze: 0 };
}

export function addMetric(m: Metric, r: { points: number; position: number | null }): void {
  m.points += r.points;
  if (r.position === 1) m.gold++;
  else if (r.position === 2) m.silver++;
  else if (r.position === 3) m.bronze++;
}

/**
 * Arma las filas de ranking para un par (categoría, modalidad).
 *
 * Cada fila trae el desglose por fecha (`byFecha[n]`, null si no compitió esa
 * fecha) más el `total` de todas las fechas: quien llama decide por cuál
 * ordenar.
 */
export function buildRankingRows(
  players: Player[],
  category: string,
  modalityId: string,
  modalityById: Record<string, Modality>,
  fechaNums: number[],
): RankingRow[] {
  const playersByName: Record<string, Player> = {};
  players.forEach((p) => {
    playersByName[p.name] = p;
  });

  const rows: RankingRow[] = [];

  function makeRow(
    key: string,
    names: string[],
    ids: (string | null)[],
    clubs: string[],
    rel: Player["results"],
  ): RankingRow {
    const byFecha: Record<number, Metric | null> = {};
    fechaNums.forEach((n) => {
      const relF = rel.filter((r) => r.fecha === n);
      byFecha[n] = relF.length
        ? relF.reduce((m, r) => (addMetric(m, r), m), emptyMetric())
        : null;
    });
    const total = rel.reduce((m, r) => (addMetric(m, r), m), emptyMetric());
    return { key, names, ids, clubs, byFecha, total };
  }

  if (modalityId === "general") {
    players.forEach((p) => {
      const rel = p.results.filter((r) => r.category === category);
      if (!rel.length) return;
      rows.push(makeRow(p.id, [p.name], [p.id], [p.club], rel));
    });
    return rows;
  }

  const mod = modalityById[modalityId];
  if (mod && mod.doubles) {
    const seen = new Set<string>();
    players.forEach((p) => {
      p.results
        .filter((r) => r.category === category && r.modality === modalityId)
        .forEach((r) => {
          const pairKey = [p.name, r.partner ?? ""].sort().join("||");
          if (seen.has(pairKey)) return;
          seen.add(pairKey);
          const partner = r.partner ? playersByName[r.partner] : null;

          const rel: Player["results"] = [];
          players.forEach((pp) => {
            pp.results
              .filter((rr) => rr.category === category && rr.modality === modalityId)
              .forEach((rr) => {
                if ([pp.name, rr.partner ?? ""].sort().join("||") === pairKey) rel.push(rr);
              });
          });
          // de-dupe: ambos integrantes aportan la misma fila por fecha/cuadro
          const uniqRel: Player["results"] = [];
          const seenR = new Set<string>();
          rel.forEach((r2) => {
            const rk = r2.fecha + "|" + r2.event;
            if (seenR.has(rk)) return;
            seenR.add(rk);
            uniqRel.push(r2);
          });

          rows.push(
            makeRow(
              pairKey,
              [p.name, r.partner ?? ""],
              [p.id, partner ? partner.id : null],
              partner ? [p.club, partner.club] : [p.club],
              uniqRel,
            ),
          );
        });
    });
  } else {
    players.forEach((p) => {
      const rel = p.results.filter(
        (r) => r.category === category && r.modality === modalityId,
      );
      if (!rel.length) return;
      rows.push(makeRow(p.id, [p.name], [p.id], [p.club], rel));
    });
  }
  return rows;
}

/** Devuelve la métrica del alcance pedido: "total" o el número de fecha. */
export function rowMetric(row: RankingRow, fechaSel: FechaScope): Metric | null {
  return fechaSel === "total" ? row.total : row.byFecha[fechaSel];
}

/**
 * Ordena y numera, descartando las filas sin datos en ese alcance (por
 * ejemplo, una fecha que nadie ha jugado). Los empates exactos comparten
 * número de posición.
 */
export function sortRankingRows(rows: RankingRow[], fechaSel: FechaScope): RankingRow[] {
  const filtered = rows.filter((r) => rowMetric(r, fechaSel));
  filtered.sort((a, b) => {
    const ma = rowMetric(a, fechaSel)!;
    const mb = rowMetric(b, fechaSel)!;
    return (
      mb.points - ma.points ||
      mb.gold - ma.gold ||
      mb.silver - ma.silver ||
      a.names[0].localeCompare(b.names[0], "es")
    );
  });
  let rank = 0;
  let prevKey: string | null = null;
  filtered.forEach((row, i) => {
    const m = rowMetric(row, fechaSel)!;
    const tieKey = `${m.points}-${m.gold}-${m.silver}-${m.bronze}`;
    if (tieKey !== prevKey) rank = i + 1;
    row.rank = rank;
    prevKey = tieKey;
  });
  return filtered;
}

/** ¿En qué posición queda `player` en (categoría, modalidad, alcance)? */
export function playerRankIn(
  players: Player[],
  player: Player,
  category: string,
  modalityId: string,
  modalityById: Record<string, Modality>,
  fechaNums: number[],
  fechaSel?: FechaScope,
): { rank: number; total: number; points: number } | null {
  const scope: FechaScope = fechaSel ?? "total";
  const rows = sortRankingRows(
    buildRankingRows(players, category, modalityId, modalityById, fechaNums),
    scope,
  );
  const row = rows.find((r) => r.ids.includes(player.id));
  return row
    ? { rank: row.rank!, total: rows.length, points: rowMetric(row, scope)!.points }
    : null;
}
