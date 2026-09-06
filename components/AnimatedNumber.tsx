"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Número que transiciona desde su valor anterior cada vez que cambia. A
 * diferencia de CountUp (que sube desde 0 al aparecer), este sirve para
 * valores que se reemplazan en vivo: al cambiar de categoría el puntaje rueda
 * desde el que había, no desde cero.
 */
export default function AnimatedNumber({
  value,
  className,
  duration = 0.55,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    // Con movimiento reducido no hay animación ni estado que actualizar: se
    // renderiza el valor tal cual (ver `mostrado`).
    if (reduce || prev.current === value) {
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce, duration]);

  const mostrado = reduce ? value : display;

  return <span className={className}>{mostrado.toLocaleString("es-CL")}</span>;
}
