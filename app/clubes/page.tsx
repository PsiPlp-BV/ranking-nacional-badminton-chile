import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ClubsView from "@/components/ClubsView";
import { CLUBS, FECHAS_JUGADAS, META } from "@/lib/data";
import ui from "@/components/ui.module.css";
import styles from "./clubes.module.css";

export const metadata: Metadata = {
  title: "Ranking de clubes",
  description:
    "Clasificación de clubes federados: base, inscritos, medallas y bono, evaluados fecha a fecha.",
};

export default function ClubesPage() {
  const r = META.CLUB_RULES;

  return (
    <>
      <PageHeader
        eyebrow="Clasificación por institución"
        title="Ranking de clubes"
        lede="El puntaje se evalúa fecha a fecha y luego se suma: la base, los inscritos y el bono se pagan una vez por fecha. Un club que no viaja suma cero esa fecha, sin arrastrar su base."
      />

      <section className={`container ${ui.section}`}>
        <Reveal>
          <ClubsView clubs={CLUBS} fechas={FECHAS_JUGADAS} />
        </Reveal>

        <Reveal delay={0.08}>
          <div className={`${ui.card} ${ui.cardPad} ${styles.rulesCard}`}>
            <h2 className={ui.cardTitle}>Cómo se calcula</h2>
            <ul className={styles.rules}>
              <li>
                <span className={styles.rulePts}>{r.base}</span> base por fecha disputada
              </li>
              <li>
                <span className={styles.rulePts}>+{r.porAtleta}</span> por deportista inscrito
                en la fecha
              </li>
              <li>
                <span className={styles.rulePts}>
                  +{r.oro}/{r.plata}/{r.bronce}
                </span>{" "}
                por medalla de oro, plata y bronce
              </li>
              <li>
                <span className={styles.rulePts}>+{r.bonusMasDe10}</span> si el club inscribe
                más de 10 deportistas
              </li>
              <li className={styles.ruleNeg}>
                <span className={styles.rulePts}>{r.penalizacionNoPresentacion}</span> por no
                presentación
              </li>
              <li className={styles.ruleNeg}>
                <span className={styles.rulePts}>{r.penalizacionBajaFueraDePlazo}</span> por
                baja fuera de plazo
              </li>
            </ul>
            <p className={styles.tiebreak}>
              <strong>Desempate:</strong>{" "}
              {META.CLUB_TIEBREAK_RULES.map((t) => t.replace(/\.$/, "").toLowerCase()).join(
                ", luego ",
              )}
              .
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
