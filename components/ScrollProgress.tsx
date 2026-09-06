"use client";

import { motion, useScroll, useSpring } from "motion/react";
import styles from "./ScrollProgress.module.css";

/**
 * Barra de avance de lectura bajo la cabecera. En páginas largas como el
 * ranking o la grilla de deportistas da una noción de cuánto queda sin ocupar
 * espacio ni pedir atención.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />;
}
