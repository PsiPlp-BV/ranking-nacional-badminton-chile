"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";
import styles from "./HeroBoard.module.css";

export interface BoardRow {
  id: string;
  name: string;
  club: string;
  clubColor: string;
  points: number;
}

export interface Board {
  id: string;
  label: string;
  color: string;
  rows: BoardRow[];
}

const EASE = [0.22, 1, 0.36, 1] as const;
const CICLO_MS = 4600;

/**
 * Marcador del ranking en la portada.
 *
 * Reemplaza la animación decorativa anterior por algo que muestra el dato
 * real: rota entre categorías cada pocos segundos, y las filas son ranuras
 * fijas (1° a 5°) para que al cambiar de categoría los nombres se releven y
 * los puntajes rueden desde el valor anterior, en vez de que la lista entera
 * parpadee. La rotación se detiene apenas alguien elige una categoría: si el
 * usuario tomó el control, moverle la vista sería una molestia.
 */
export default function HeroBoard({ boards }: { boards: Board[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!auto || paused || reduce || boards.length < 2) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % boards.length);
    }, CICLO_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [auto, paused, reduce, boards.length]);

  const pick = useCallback((i: number) => {
    setIndex(i);
    setAuto(false);
  }, []);

  const board = boards[index];
  const slots = Math.max(...boards.map((b) => b.rows.length));

  return (
    <div
      className={styles.board}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.head}>
        <p className={styles.live}>
          <span className={styles.livePulse} aria-hidden="true" />
          Ranking general
        </p>
        <Link href={`/ranking?categoria=${board.id}`} className={styles.headLink}>
          Ver completo →
        </Link>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Categoría del ranking">
        {boards.map((b, i) => (
          <button
            key={b.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`${styles.tab} ${i === index ? styles.tabActive : ""}`}
            onClick={() => pick(i)}
          >
            {i === index && (
              <motion.span
                layoutId="hero-tab"
                className={styles.tabPill}
                style={{ background: b.color }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className={styles.tabLabel}>{b.label}</span>
          </button>
        ))}
      </div>

      <ol className={styles.rows}>
        {Array.from({ length: slots }, (_, slot) => {
          const row = board.rows[slot];
          return (
            <li key={slot} className={styles.row}>
              <span className={styles.pos}>{slot + 1}</span>

              <span className={styles.identity}>
                {/* Sin AnimatePresence a propósito: la fase de salida puede
                    quedarse a medias si la rotación llega antes de que termine
                    —y entonces la fila se ve vacía—. Con la `key` basta: el
                    nombre nuevo entra al montarse y el viejo desaparece. */}
                <motion.span
                  key={`${board.id}-${row?.id ?? "vacio"}`}
                  className={styles.identityInner}
                  initial={reduce ? false : { opacity: 0, y: 9 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, delay: slot * 0.04, ease: EASE }}
                >
                  {row ? (
                    <>
                      <Link href={`/jugadores/${row.id}`} className={styles.name}>
                        {row.name}
                      </Link>
                      <span className={styles.club}>
                        <span
                          className={styles.clubDot}
                          style={{ background: row.clubColor }}
                          aria-hidden="true"
                        />
                        {row.club}
                      </span>
                    </>
                  ) : (
                    <span className={styles.vacio}>—</span>
                  )}
                </motion.span>
              </span>

              <span className={styles.pts}>
                {row ? <AnimatedNumber value={row.points} /> : "—"}
              </span>

              <span className={styles.barTrack} aria-hidden="true">
                <motion.span
                  className={styles.bar}
                  style={{ background: board.color }}
                  animate={{
                    width: row ? `${(row.points / board.rows[0].points) * 100}%` : "0%",
                  }}
                  transition={{ duration: 0.6, delay: slot * 0.04, ease: EASE }}
                />
              </span>
            </li>
          );
        })}
      </ol>

      {auto && !reduce && (
        <span className={styles.progress} aria-hidden="true">
          <motion.span
            key={`${index}-${paused}`}
            className={styles.progressBar}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? 0 : 1 }}
            transition={{ duration: paused ? 0 : CICLO_MS / 1000, ease: "linear" }}
          />
        </span>
      )}
    </div>
  );
}
