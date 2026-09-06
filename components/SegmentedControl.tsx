"use client";

import { motion } from "motion/react";
import styles from "./SegmentedControl.module.css";

export interface Segment {
  value: string;
  label: string;
  /** Color del indicador; por defecto el azul federación. */
  color?: string;
  disabled?: boolean;
  title?: string;
}

/**
 * Selector de pocas opciones con indicador deslizante.
 *
 * Reemplaza a un `<select>` donde las opciones son pocas y se cambian seguido:
 * se ve todo el rango de una, cambia en un clic, y el indicador que viaja
 * entre opciones deja claro de dónde a dónde se movió.
 */
export default function SegmentedControl({
  label,
  segments,
  value,
  onChange,
  layoutId,
}: {
  label: string;
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  layoutId: string;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.label} id={`${layoutId}-label`}>
        {label}
      </span>
      <div className={styles.group} role="tablist" aria-labelledby={`${layoutId}-label`}>
        {segments.map((s) => {
          const active = s.value === value;
          return (
            <button
              key={s.value}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={s.disabled}
              title={s.title}
              className={`${styles.segment} ${active ? styles.active : ""}`}
              onClick={() => onChange(s.value)}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className={styles.pill}
                  style={{ background: s.color ?? "var(--brand-navy)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className={styles.segmentLabel}>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
