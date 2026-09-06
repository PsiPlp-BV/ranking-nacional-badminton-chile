"use client";

import { motion } from "motion/react";

/**
 * `template.tsx` se vuelve a montar en cada navegación (a diferencia de
 * `layout.tsx`), que es justo lo que necesita una transición de entrada:
 * cada página aparece con un desplazamiento corto en lugar de un salto seco.
 * El movimiento es deliberadamente breve — 260 ms — porque acá la gente viene
 * a consultar una tabla, no a mirar una animación.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
