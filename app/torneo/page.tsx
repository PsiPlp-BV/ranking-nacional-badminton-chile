import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { FECHAS, META, POINTS_TABLE } from "@/lib/data";
import ui from "@/components/ui.module.css";
import styles from "./torneo.module.css";

export const metadata: Metadata = {
  title: "Torneo y reglamento",
  description:
    "Calendario de las 3 fechas del Torneo Nacional 2026, tabla de puntos y reglas de desempate.",
};

/* Calendario y reglamento van juntos a propósito: responden la misma pregunta
   —cómo y cuándo se compite— y por separado quedaban dos páginas flacas. */
export default function TorneoPage() {
  const { ATHLETE_RULES, TIEBREAK_RULES } = META;

  return (
    <>
      <PageHeader
        eyebrow="Circuito 2026"
        title="Torneo y reglamento"
        lede="El Ranking Nacional se juega en tres fechas. Acá está el calendario, cuánto vale cada posición y cómo se resuelven los empates."
      />

      {/* ---- calendario ---- */}
      <section className={`container ${ui.section}`}>
        <Reveal>
          <h2 className={ui.sectionTitle}>Calendario</h2>
          <p className={ui.sectionLede}>
            Torneo Nacional Juvenil-Adulto: Sub 15, Sub 17, Sub 19 y Adulto.
          </p>
        </Reveal>

        <ol className={styles.timeline}>
          {FECHAS.map((f, i) => (
            <Reveal key={f.numero} delay={i * 0.07}>
              <li className={`${styles.fecha} ${f.estado === "proxima" ? styles.pendiente : ""}`}>
                <div className={styles.marker} aria-hidden="true">
                  <span className={styles.markerDot} />
                  <span className={styles.markerNum}>F{f.numero}</span>
                </div>
                <div className={`${ui.card} ${styles.fechaCard}`}>
                  <div className={styles.fechaHead}>
                    <h3 className={styles.fechaTitle}>{f.nombre}</h3>
                    <span
                      className={`${ui.badge} ${
                        f.estado === "completado" ? styles.badgeDone : styles.badgeNext
                      }`}
                    >
                      {f.estado === "completado" ? "Disputada" : "Próxima"}
                    </span>
                  </div>
                  <dl className={styles.fechaMeta}>
                    <div>
                      <dt>Fechas</dt>
                      <dd>{f.fechaTexto}</dd>
                    </div>
                    <div>
                      <dt>Sede</dt>
                      <dd>{f.sede}</dd>
                    </div>
                    {f.eventos != null && (
                      <div>
                        <dt>Cuadros</dt>
                        <dd>{f.eventos} disputados</dd>
                      </div>
                    )}
                    {f.inscritos != null && (
                      <div>
                        <dt>Inscritos</dt>
                        <dd>{f.inscritos} deportistas</dd>
                      </div>
                    )}
                  </dl>
                  {f.fuenteUrl ? (
                    <a
                      href={f.fuenteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.fechaLink}
                    >
                      Ver resultados oficiales →
                    </a>
                  ) : (
                    <p className={styles.fechaNota}>
                      {/confirmar/i.test(f.sede)
                        ? "Sede por confirmar por la Federación."
                        : "Resultados disponibles una vez disputada la fecha."}
                    </p>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---- reglamento ---- */}
      <section className={`container ${ui.section}`}>
        <Reveal>
          <h2 className={ui.sectionTitle}>Sistema de puntos</h2>
          <p className={ui.sectionLede}>
            El puntaje se asigna por la instancia alcanzada en cada cuadro. El 4° lugar
            solo existe en cuadros Round Robin, donde sí hay una cuarta posición definida.
          </p>
        </Reveal>

        <div className={styles.reglamento}>
          <Reveal>
            <div className={`${ui.card} ${styles.pointsCard}`}>
              <ul className={styles.points}>
                {POINTS_TABLE.map((row) => (
                  <li key={row.pos}>
                    <span className={styles.pointsPos}>{row.pos}</span>
                    <span className={styles.pointsLabel}>{row.label}</span>
                    <span className={`${styles.pointsPts} num`}>{row.points}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className={styles.rulesCol}>
            <Reveal delay={0.06}>
              <div className={`${ui.card} ${ui.cardPad}`}>
                <h3 className={ui.cardTitle}>Desempate entre deportistas</h3>
                <ol className={styles.ordered}>
                  {TIEBREAK_RULES.map((t, i) => (
                    <li key={t}>
                      <span className={styles.step}>{i + 1}</span>
                      {t}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className={`${ui.card} ${ui.cardPad}`}>
                <h3 className={ui.cardTitle}>Reglas de participación</h3>
                <ul className={styles.bullets}>
                  <li>
                    Es obligatorio competir en las 3 fechas; se acepta una ausencia
                    justificada, es decir, un mínimo de{" "}
                    <strong>{ATHLETE_RULES.fechaMinimasObligatorias} fechas</strong>.
                  </li>
                  <li>
                    La inasistencia sin justificar descuenta{" "}
                    <strong className={styles.neg}>
                      {ATHLETE_RULES.penalizacionInasistencia} puntos
                    </strong>
                    .
                  </li>
                  <li>
                    En dobles, <strong>ambos integrantes</strong> suman el puntaje completo
                    a su ranking individual.
                  </li>
                  <li>
                    El ranking <strong>nunca mezcla categorías de edad</strong>: quien
                    compite en dos no debe rankear más alto solo por tener más cuadros que
                    sumar.
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
