"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { buildRankingRows, rowMetric, sortRankingRows } from "@/lib/ranking";
import {
  CATEGORIES,
  FECHAS,
  FECHA_NUMS,
  MODALITIES,
  PLAYERS,
  RAMA_LABEL,
  clubColor,
  clubShort,
  modalityById,
  ramaDe,
  ramaDeModalidad,
  type Rama,
} from "@/lib/data";
import type { FechaScope } from "@/lib/types";
import { Avatar, Medals, RankBadge } from "./bits";
import SegmentedControl from "./SegmentedControl";
import ui from "./ui.module.css";
import styles from "./RankingTable.module.css";

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function RankingTable({ initialCategory }: { initialCategory?: string }) {
  const reduce = useReducedMotion();
  const [category, setCategory] = useState(
    CATEGORIES.some((c) => c.id === initialCategory) ? initialCategory! : "Adulto",
  );
  const [modality, setModality] = useState("general");
  const [fecha, setFecha] = useState<FechaScope>("total");
  const [rama, setRama] = useState<"todas" | Rama>("todas");
  const [q, setQ] = useState("");

  const isDoubles = modality !== "general" && !!modalityById[modality]?.doubles;

  // Con una modalidad de rama (Individual Masculino, Dobles Femenino…) la rama
  // ya viene implícita, y en dobles mixto no aplica: cada pareja tiene un
  // integrante de cada una. El control solo se habilita en "general", y el
  // valor efectivo se deriva en vez de sincronizar estado, para que no queden
  // combinaciones imposibles como "rama femenina + Individual Masculino".
  const ramaImplicita = ramaDeModalidad(modality);
  const ramaAplica = modality === "general";
  const ramaEfectiva: "todas" | Rama = ramaAplica ? rama : (ramaImplicita ?? "todas");

  const allRows = useMemo(() => {
    const all = buildRankingRows(PLAYERS, category, modality, modalityById, FECHA_NUMS);
    // La rama se aplica ANTES de ordenar para que las posiciones se numeren
    // dentro de ella: el ranking femenino parte en 1 y no hereda los huecos
    // del ranking general.
    const enRama =
      ramaAplica && ramaEfectiva !== "todas"
        ? all.filter((r) => r.names.every((n) => !n || ramaDe(n) === ramaEfectiva))
        : all;
    return sortRankingRows(enRama, fecha);
  }, [category, modality, fecha, ramaEfectiva, ramaAplica]);

  // La búsqueda filtra pero NO renumera: la posición que se muestra sigue
  // siendo la del ranking completo, que es la que vale.
  const rows = useMemo(() => {
    const needle = norm(q.trim());
    if (!needle) return allRows;
    return allRows.filter(
      (r) =>
        r.names.some((n) => n && norm(n).includes(needle)) ||
        r.clubs.some((c) => norm(c).includes(needle)),
    );
  }, [allRows, q]);

  const scopeLabel = fecha === "total" ? `en las ${FECHAS.length} fechas` : `en la ${fecha}ª Fecha`;

  return (
    <>
      <div className={styles.toolbar}>
        <SegmentedControl
          label="Categoría"
          layoutId="rank-cat"
          value={category}
          onChange={setCategory}
          segments={CATEGORIES.map((c) => ({
            value: c.id,
            label: c.label,
            color: c.color,
          }))}
        />

        <SegmentedControl
          label="Rama"
          layoutId="rank-rama"
          value={ramaEfectiva}
          onChange={(v) => setRama(v as "todas" | Rama)}
          segments={[
            {
              value: "todas",
              label: "General",
              disabled: !ramaAplica,
              title: ramaAplica ? undefined : "Esta modalidad ya define la rama",
            },
            {
              value: "Masculino",
              label: "Masculina",
              disabled: !ramaAplica,
              title: ramaAplica
                ? undefined
                : ramaImplicita
                  ? "Rama definida por la modalidad elegida"
                  : "En dobles mixto cada pareja tiene un integrante de cada rama",
            },
            {
              value: "Femenino",
              label: "Femenina",
              disabled: !ramaAplica,
              title: ramaAplica
                ? undefined
                : ramaImplicita
                  ? "Rama definida por la modalidad elegida"
                  : "En dobles mixto cada pareja tiene un integrante de cada rama",
            },
          ]}
        />

        <SegmentedControl
          label="Fecha"
          layoutId="rank-fecha"
          value={String(fecha)}
          onChange={(v) => setFecha(v === "total" ? "total" : Number(v))}
          segments={[
            { value: "total", label: "General" },
            ...FECHAS.map((f) => ({
              value: String(f.numero),
              label: `F${f.numero}`,
              disabled: f.estado === "proxima",
              title:
                f.estado === "proxima"
                  ? `La ${f.numero}ª Fecha aún no se disputa`
                  : f.nombre,
            })),
          ]}
        />

        <label className={ui.field}>
          <span className={ui.fieldLabel}>Modalidad</span>
          <select
            className={ui.select}
            value={modality}
            onChange={(e) => setModality(e.target.value)}
          >
            <option value="general">General (todas)</option>
            {MODALITIES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className={`${ui.field} ${styles.searchField}`}>
          <span className={ui.fieldLabel}>Buscar</span>
          <input
            type="search"
            className={ui.input}
            placeholder="Nombre o club…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>

        <p className={styles.count}>
          <strong className="num">{rows.length}</strong>
          {q && <span className={ui.dim}> de {allRows.length}</span>}{" "}
          {isDoubles ? "parejas" : "deportistas"}
          {ramaEfectiva !== "todas" && ` de la rama ${RAMA_LABEL[ramaEfectiva]}`}{" "}
          {q ? "coinciden" : `con puntaje ${scopeLabel}`}
        </p>
      </div>

      <div className={`${ui.card} ${styles.tableCard}`}>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th style={{ width: 56 }}>Pos</th>
                <th>{isDoubles ? "Pareja" : "Deportista"}</th>
                <th>Club</th>
                {FECHA_NUMS.map((n) => (
                  <th key={n} className={ui.numCell} data-active={fecha === n || undefined}>
                    F{n}
                  </th>
                ))}
                <th className={ui.numCell} data-active={fecha === "total" || undefined}>
                  Total
                </th>
                <th>Medallas{fecha === "total" ? "" : ` · F${fecha}`}</th>
              </tr>
            </thead>
            {/* Sin animación de salida a propósito: al filtrar por rama la
                tabla puede pasar de 64 filas a 21, y las salientes se quedaban
                visibles con su posición vieja mientras se iban, mezcladas con
                las nuevas. Las filas que ya no aplican desaparecen de una; las
                que entran o se reordenan sí se animan. */}
            <tbody>
              {rows.map((row, i) => {
                  const active = rowMetric(row, fecha)!;
                  return (
                    <motion.tr
                      key={row.key}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.22,
                        delay: reduce ? 0 : Math.min(i, 14) * 0.012,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <td>
                        <RankBadge rank={row.rank!} />
                      </td>
                      <td>
                        <div className={styles.player}>
                          <Avatar name={row.names[0]} color={clubColor(row.clubs[0])} />
                          <span className={styles.names}>
                            {row.names.map((n, idx) =>
                              !n ? null : (
                                <span key={n}>
                                  {idx > 0 && <span className={ui.dim}> / </span>}
                                  {row.ids[idx] ? (
                                    <Link href={`/jugadores/${row.ids[idx]}`} className={styles.nameLink}>
                                      {n}
                                    </Link>
                                  ) : (
                                    n
                                  )}
                                </span>
                              ),
                            )}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.clubs}>
                          {[...new Set(row.clubs)].map((c) => (
                            <span key={c} className={ui.clubTag}>
                              <span className={ui.dot} style={{ background: clubColor(c) }} />
                              {clubShort(c)}
                            </span>
                          ))}
                        </div>
                      </td>
                      {FECHA_NUMS.map((n) => {
                        const m = row.byFecha[n];
                        return (
                          <td key={n} className={ui.numCell}>
                            {m ? (
                              <span className={fecha === n ? ui.strong : ui.dim}>{m.points}</span>
                            ) : (
                              <span className={ui.dim}>–</span>
                            )}
                          </td>
                        );
                      })}
                      <td className={ui.numCell}>
                        <span className={fecha === "total" ? ui.strong : ui.dim}>
                          {row.total.points}
                        </span>
                      </td>
                      <td>
                        <Medals
                          gold={active.gold}
                          silver={active.silver}
                          bronze={active.bronze}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!rows.length && (
          <p className={ui.empty}>
            {fecha === "total"
              ? "Sin resultados registrados para esta combinación todavía."
              : `Esta fecha aún no se ha disputado. Vuelve cuando la ${fecha}ª Fecha se juegue.`}
          </p>
        )}
      </div>
    </>
  );
}
