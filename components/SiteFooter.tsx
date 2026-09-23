import Image from "next/image";
import Link from "next/link";
import { FECHAS, FEDERATION } from "@/lib/data";
import { NAV } from "./nav";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  const proxima = FECHAS.find((f) => f.estado === "proxima");

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Image
            src="/logo-fedebad.png"
            alt={FEDERATION.nombre}
            width={52}
            height={52}
            className={styles.logo}
          />
          <p className={styles.brandName}>{FEDERATION.nombre}</p>
          <p className={styles.brandMeta}>
            {FEDERATION.direccion}
            <br />
            {FEDERATION.email}
          </p>
        </div>

        <nav className={styles.col} aria-label="Secciones">
          <h2 className="eyebrow">Secciones</h2>
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className="eyebrow">Temporada 2026</h2>
          <ul>
            {FECHAS.map((f) => (
              <li key={f.numero} className={styles.fecha}>
                <span className={styles.fechaNum}>F{f.numero}</span>
                <span>
                  {f.sedeCorta ?? f.sede}
                  <span className={styles.fechaEstado}>
                    {f.estado === "completado" ? "disputada" : "próxima"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {proxima && (
            <p className={styles.note}>
              Próxima: {proxima.fechaTexto.toLowerCase()}.
            </p>
          )}
        </div>

        <div className={styles.col}>
          <h2 className="eyebrow">Colaboradores</h2>
          <ul>
            {FEDERATION.auspiciadores.map((a) => (
              <li key={a.nombre}>
                {a.url ? (
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {a.nombre}
                  </a>
                ) : (
                  <span className={styles.linkPlain}>{a.nombre}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.legal}`}>
        <p>
          © {FEDERATION.siglas} · Datos oficiales de{" "}
          <a
            href={FEDERATION.tournamentSoftwareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Tournamentsoftware
          </a>
        </p>
        <p className={styles.privacy}>Desarrollado por Benjamin Varas O.</p>
      </div>
    </footer>
  );
}
