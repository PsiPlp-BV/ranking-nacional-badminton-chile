"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { NAV, isActive } from "./nav";
import ScrollProgress from "./ScrollProgress";
import styles from "./SiteHeader.module.css";

/**
 * El tema no vive en estado de React: lo escribe el script inline del layout
 * antes del primer paint y queda en `document.documentElement.dataset.theme`.
 * Los dos iconos del botón se muestran u ocultan por CSS según ese atributo,
 * así no hay estado que sincronizar ni desajuste de hidratación.
 */
function toggleTheme() {
  const root = document.documentElement;
  // El layout siempre deja `data-theme` puesto (claro por defecto), así que
  // basta leerlo: no hace falta consultar la preferencia del sistema.
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* modo privado: el tema simplemente no persiste */
  }
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <ScrollProgress />
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label="Ranking Nacional de Bádminton, inicio">
          <Image
            src="/logo-fedebad.png"
            alt=""
            width={40}
            height={40}
            className={styles.logo}
            priority
          />
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Ranking Nacional</span>
            <span className={styles.brandSub}>Bádminton Chile 2026</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Secciones">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${active ? styles.linkActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className={styles.pill}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className={styles.linkLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={toggleTheme}
            className={styles.iconBtn}
            aria-label="Cambiar entre tema claro y oscuro"
            title="Cambiar tema"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="18"
              height="18"
              className={styles.iconMoon}
              aria-hidden="true"
            >
              <path d="M20 13.4A8.4 8.4 0 1 1 10.6 4a6.6 6.6 0 0 0 9.4 9.4Z" strokeLinejoin="round" />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="18"
              height="18"
              className={styles.iconSun}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4.2" />
              <path
                d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.burger}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="18"
              height="18"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="menu-movil"
            className={styles.mobileNav}
            aria-label="Secciones"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  // Se cierra al navegar; si no, el menú tapa la página nueva.
                  onClick={() => setOpen(false)}
                  className={`${styles.mobileLink} ${
                    isActive(pathname, item.href) ? styles.mobileLinkActive : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
