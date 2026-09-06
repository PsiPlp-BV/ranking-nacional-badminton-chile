import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import RankingTable from "@/components/RankingTable";
import Reveal from "@/components/Reveal";
import { FECHAS_JUGADAS } from "@/lib/data";
import ui from "@/components/ui.module.css";

export const metadata: Metadata = {
  title: "Ranking Nacional",
  description:
    "Clasificación individual por categoría, modalidad y fecha del Torneo Nacional de Bádminton 2026.",
};

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Clasificación individual"
        title="Ranking Nacional"
        lede={`Puntaje por categoría y modalidad, con el desglose de cada fecha. Actualizado tras ${FECHAS_JUGADAS.length} de 3 fechas del circuito.`}
      />

      <section className={`container ${ui.section}`}>
        <Reveal>
          <RankingTable initialCategory={categoria} />
        </Reveal>

        <Reveal delay={0.05}>
          <div className={ui.sectionLede} style={{ marginTop: 20 }}>
            <p>
              El ranking nunca mezcla categorías de edad. Un deportista que compite en Sub 19
              y Adulto aparece en ambas tablas por separado, y sus puntos no se suman entre
              ellas: hacerlo premiaría tener más cuadros disponibles, no rendir mejor. En
              dobles, ambos integrantes suman el puntaje completo a su ranking individual,
              aunque la pareja ocupe una sola fila.
            </p>
            <p style={{ marginTop: 10 }}>
              La rama sale de las modalidades del propio torneo: quien juega Individual o
              Dobles Masculino compite en la rama masculina, y viceversa. Al elegir una,
              las posiciones se renumeran dentro de ella —el ranking femenino parte en 1— y
              el puntaje sigue siendo el total del deportista, incluido el dobles mixto. En
              mixto no aplica: cada pareja tiene un integrante de cada rama.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
