"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Aparición al entrar en viewport. `once` por defecto: una tabla que se
 * re-anima cada vez que pasas por encima es molesta, no elegante.
 * Con `prefers-reduced-motion` el contenido simplemente está ahí.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.44, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
