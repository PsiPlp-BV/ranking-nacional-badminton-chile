"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { CATEGORIES, CLUBS, PLAYERS, clubColor } from "@/lib/data";
import { Avatar, Medals } from "./bits";
import ui from "./ui.module.css";
import styles from "./PlayersGrid.module.css";

/** Búsqueda insensible a tildes: "alvarez" tiene que encontrar a "Álvarez". */
const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Realce que sigue al cursor dentro de la tarjeta. Va un solo listener en la
 * grilla completa, delegando a la tarjeta bajo el puntero: con casi cien
 * tarjetas, un listener por cada una sería caro para un efecto decorativo.
 */
function spotlight(e: React.MouseEvent<HTMLElement>) {
  const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function PlayersGrid() {
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");
  const [club, setClub] = useState("todos");
  const [category, setCategory] = useState("todas");

  const clubsOrdenados = useMemo(
    () => [...CLUBS].sort((a, b) => a.name.localeCompare(b.name, "es")),
    [],
  );

  const results = useMemo(() => {
    const needle = norm(q.trim());
    return PLAYERS.filter((p) => {
      if (club !== "todos" && p.club !== club) return false;
      if (category !== "todas" && !p.categories.includes(category)) return false;
      if (needle && !norm(p.name).includes(needle) && !norm(p.club).includes(needle)) return false;
      return true;
    });
  }, [q, club, category]);

  return (
    <>
      <div className={styles.toolbar}>
        <div className={ui.controls}>
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

          <label className={ui.field}>
            <span className={ui.fieldLabel}>Club</span>
            <select className={ui.select} value={club} onChange={(e) => setClub(e.target.value)}>
              <option value="todos">Todos los clubes</option>
              {clubsOrdenados.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className={ui.field}>
            <span className={ui.fieldLabel}>Categoría</span>
            <select
              className={ui.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="todas">Todas</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className={styles.count}>
          <strong className="num">{results.length}</strong> de {PLAYERS.length} deportistas
        </p>
      </div>

      {/* Sin animación de salida: al filtrar, las tarjetas descartadas se
          quedaban visibles mientras se iban, mezcladas con las que quedan.
          Desaparecen de una; las que entran o se reordenan sí se animan. */}
      {results.length ? (
        <motion.ul layout={!reduce} className={styles.grid} onMouseMove={spotlight}>
          {results.map((p, i) => (
            <motion.li
                key={p.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.24,
                  delay: reduce ? 0 : Math.min(i, 16) * 0.015,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/jugadores/${p.id}`}
                  className={`${ui.card} ${styles.card}`}
                  data-spotlight
                >
                  <span className={styles.stripe} style={{ background: clubColor(p.club) }} />
                  <span className={styles.cardTop}>
                    <Avatar name={p.name} color={p.color} />
                    <span className={styles.identity}>
                      <span className={styles.name}>{p.name}</span>
                      <span className={styles.club}>{p.club_short}</span>
                    </span>
                  </span>

                  <span className={styles.cats}>
                    {p.categories.map((c) => {
                      const cat = CATEGORIES.find((x) => x.id === c);
                      return (
                        <span
                          key={c}
                          className={ui.badge}
                          style={{
                            background: `color-mix(in srgb, ${cat?.color ?? "#888"} 14%, transparent)`,
                            color: cat?.color,
                          }}
                        >
                          {cat?.label ?? c}
                        </span>
                      );
                    })}
                  </span>

                  <span className={styles.cardFoot}>
                    <Medals gold={p.gold} silver={p.silver} bronze={p.bronze} />
                    <span className={styles.pts}>
                      <span className="num">{p.total_points}</span>
                      <span className={styles.ptsLabel}>pts</span>
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
        </motion.ul>
      ) : (
        <p className={ui.empty}>
          Nadie coincide con esa búsqueda. Prueba con otro nombre o quita algún filtro.
        </p>
      )}
    </>
  );
}
