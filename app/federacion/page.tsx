import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { FEDERATION } from "@/lib/data";
import ui from "@/components/ui.module.css";
import styles from "./federacion.module.css";

export const metadata: Metadata = {
  title: "Federación",
  description:
    "Federación Chilena de Badminton (FEDEBADCHILE): directiva, equipo, sede y colaboradores.",
};

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V14h2.7v8h3.3Z" />
    </svg>
  );
}

export default function FederacionPage() {
  const f = FEDERATION;

  return (
    <>
      <PageHeader
        eyebrow="Institución"
        title={f.nombre}
        lede="Organismo rector del bádminton en Chile y responsable del Ranking Nacional y del Torneo Nacional 2026."
      />

      <section className={`container ${ui.section}`}>
        <div className={styles.top}>
          <Reveal>
            <div className={`${ui.card} ${styles.identity}`}>
              <Image
                src="/logo-fedebad.png"
                alt={`Escudo de la ${f.nombre}`}
                width={104}
                height={104}
                className={styles.logo}
              />
              <div>
                <p className={styles.siglas}>{f.siglas}</p>
                <p className={styles.nombre}>{f.nombre}</p>
                <dl className={styles.contact}>
                  <div>
                    <dt>Sede</dt>
                    <dd>{f.sede}</dd>
                  </div>
                  <div>
                    <dt>Dirección</dt>
                    <dd>{f.direccion}</dd>
                  </div>
                  <div>
                    <dt>Contacto</dt>
                    <dd>
                      <a href={`mailto:${f.email}`} className={styles.link}>
                        {f.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Sitio</dt>
                    <dd>
                      <a
                        href={`https://${f.web.replace(/^www\./, "www.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {f.web}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className={styles.socials}>
                  {f.redesSociales.map((s) => (
                    <a
                      key={s.nombre}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.social}
                      aria-label={s.nombre}
                    >
                      <SocialIcon icon={s.icon} />
                      {s.nombre}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className={styles.peopleCol}>
            <Reveal delay={0.06}>
              <div className={`${ui.card} ${ui.cardPad}`}>
                <h2 className={ui.cardTitle}>Directiva</h2>
                <ul className={styles.people}>
                  {f.directiva.map((p) => (
                    <li key={p.nombre}>
                      <span className={styles.personName}>{p.nombre}</span>
                      <span className={styles.personRole}>{p.cargo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className={`${ui.card} ${ui.cardPad}`}>
                <h2 className={ui.cardTitle}>Equipo FEDEBAD</h2>
                <ul className={styles.people}>
                  {f.gerencia.map((p) => (
                    <li key={p.nombre}>
                      <span className={styles.personName}>{p.nombre}</span>
                      <span className={styles.personRole}>{p.cargo}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.06}>
          <div className={styles.sponsors}>
            <h2 className="eyebrow">Colaboradores institucionales</h2>
            <ul className={styles.sponsorList}>
              {f.auspiciadores.map((a) =>
                a.url ? (
                  <li key={a.nombre}>
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sponsor}
                    >
                      {a.nombre}
                    </a>
                  </li>
                ) : (
                  <li key={a.nombre}>
                    <span className={styles.sponsor}>{a.nombre}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={f.tournamentSoftwareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.source}
          >
            <span>
              <span className="eyebrow">Fuente oficial de resultados</span>
              <span className={styles.sourceTitle}>Perfil FEDEBADCHILE en Tournamentsoftware</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </section>
    </>
  );
}
