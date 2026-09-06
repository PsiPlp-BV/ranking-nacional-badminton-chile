"use client";

import Link from "next/link";
import { motion } from "motion/react";
import HeroBoard, { type Board } from "./HeroBoard";
import styles from "./Hero.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  badge,
  atletas,
  clubes,
  cuadros,
  sede,
  boards,
}: {
  badge: string;
  atletas: number;
  clubes: number;
  cuadros: number;
  sede: string;
  boards: Board[];
}) {
  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: 0.06 * i, ease: EASE },
  });

  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <motion.p className={styles.badge} {...stagger(0)}>
            <span className={styles.badgeDot} />
            {badge}
          </motion.p>

          <motion.h1 className={styles.title} {...stagger(1)}>
            El ranking oficial del
            <br />
            <span className={styles.titleAccent}>bádminton chileno</span>
          </motion.h1>

          <motion.p className={styles.lede} {...stagger(2)}>
            Clasificación individual por categoría y modalidad, ranking de clubes y
            perfiles de deportistas del Torneo Nacional 2026 — Sub 15, Sub 17, Sub 19
            y Adulto.
          </motion.p>

          <motion.div className={styles.ctas} {...stagger(3)}>
            <Link href="/ranking" className={styles.btnPrimary}>
              Ver ranking nacional
            </Link>
            <Link href="/jugadores" className={styles.btnGhost}>
              Explorar deportistas
            </Link>
          </motion.div>

          <motion.dl className={styles.meta} {...stagger(4)}>
            <div>
              <dt>Deportistas</dt>
              <dd className="num">{atletas}</dd>
            </div>
            <div>
              <dt>Clubes</dt>
              <dd className="num">{clubes}</dd>
            </div>
            <div>
              <dt>Cuadros</dt>
              <dd className="num">{cuadros}</dd>
            </div>
            <div>
              <dt>Última fecha</dt>
              <dd className={styles.metaText}>{sede}</dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          className={styles.stage}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
        >
          <HeroBoard boards={boards} />
        </motion.div>
      </div>
    </section>
  );
}
