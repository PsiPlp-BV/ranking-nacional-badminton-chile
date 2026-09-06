"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { Club, Fecha } from "@/lib/types";
import { Medals, RankBadge } from "./bits";
import ui from "./ui.module.css";
import styles from "./ClubsView.module.css";

/**
 * Tabla y gráfico de clubes con resaltado cruzado: pasar el mouse por una
 * barra ilumina su fila y viceversa. Son dos vistas del mismo dato, y en una
 * tabla de ocho clubes con nombres parecidos ("Club Bádminton …") saltar de
 * una a otra a ojo cuesta más de lo que parece.
 */
export default function ClubsView({
  clubs,
  fechas,
}: {
  clubs: Club[];
  fechas: Fecha[];
}) {
  const [activo, setActivo] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartRef, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const max = Math.max(...clubs.map((c) => c.total_points), 1);

  const atenuado = (name: string) => activo !== null && activo !== name;

  return (
    <div className={styles.layout}>
      <div className={`${ui.card} ${styles.tableCard}`}>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th style={{ width: 56 }}>Pos</th>
                <th>Club</th>
                <th className={ui.numCell}>Deportistas</th>
                <th>Medallas</th>
                {fechas.map((f) => (
                  <th key={f.numero} className={ui.numCell}>
                    F{f.numero}
                  </th>
                ))}
                <th className={ui.numCell}>Total</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((c) => (
                <tr
                  key={c.name}
                  className={`${styles.row} ${activo === c.name ? styles.rowActiva : ""} ${
                    atenuado(c.name) ? styles.rowAtenuada : ""
                  }`}
                  onMouseEnter={() => setActivo(c.name)}
                  onMouseLeave={() => setActivo(null)}
                >
                  <td>
                    <RankBadge rank={c.rank} />
                  </td>
                  <td>
                    <span className={styles.clubName}>
                      <span className={ui.dot} style={{ background: c.color }} />
                      {c.name}
                    </span>
                  </td>
                  <td className={ui.numCell}>{c.athletes}</td>
                  <td>
                    <Medals gold={c.gold} silver={c.silver} bronze={c.bronze} />
                  </td>
                  {fechas.map((f) => {
                    const pts = c.by_fecha?.[String(f.numero)] ?? 0;
                    return (
                      <td key={f.numero} className={ui.numCell}>
                        {pts ? (
                          pts
                        ) : (
                          <span className={ui.dim} title={`No participó en la ${f.numero}ª Fecha`}>
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className={`${ui.numCell} ${ui.strong}`}>{c.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${ui.card} ${ui.cardPad}`}>
        <div className={ui.cardHead}>
          <h2 className={ui.cardTitle}>Puntaje acumulado</h2>
          <span className="eyebrow">{fechas.length} fechas</span>
        </div>

        <div ref={chartRef} className={styles.chart}>
          {clubs.map((c, i) => {
            const pct = (c.total_points / max) * 100;
            return (
              <div
                key={c.name}
                className={`${styles.barRow} ${atenuado(c.name) ? styles.barAtenuada : ""}`}
                onMouseEnter={() => setActivo(c.name)}
                onMouseLeave={() => setActivo(null)}
              >
                <span className={styles.label} title={c.name}>
                  {c.short}
                </span>
                <span className={styles.track}>
                  <motion.span
                    className={styles.bar}
                    style={{ background: c.color }}
                    initial={{ width: reduce ? `${pct}%` : 0 }}
                    animate={inView ? { width: `${pct}%` } : undefined}
                    transition={{
                      duration: 0.75,
                      delay: reduce ? 0 : 0.06 * i,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </span>
                <span className={`${styles.value} num`}>{c.total_points}</span>

                {/* El desglose por fecha aparece solo en la barra activa: en
                    reposo la comparación es entre totales. */}
                <span className={styles.sub}>
                  {activo === c.name
                    ? fechas
                        .map((f) => `F${f.numero} ${c.by_fecha?.[String(f.numero)] ?? 0}`)
                        .join(" · ")
                    : `${c.athletes} ${c.athletes === 1 ? "deportista" : "deportistas"}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
