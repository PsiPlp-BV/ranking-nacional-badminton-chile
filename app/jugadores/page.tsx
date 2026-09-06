import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import PlayersGrid from "@/components/PlayersGrid";
import Reveal from "@/components/Reveal";
import { PLAYERS } from "@/lib/data";
import ui from "@/components/ui.module.css";

export const metadata: Metadata = {
  title: "Deportistas",
  description:
    "Perfiles de los deportistas del Ranking Nacional de Bádminton de Chile 2026.",
};

export default function JugadoresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Perfiles"
        title="Deportistas"
        lede={`Los ${PLAYERS.length} deportistas con resultados en el circuito 2026. Cada perfil muestra sus cuadros, medallas y posición en cada ranking donde compite.`}
      />

      <section className={`container ${ui.section}`}>
        <PlayersGrid />
        <Reveal>
          <p className={ui.sectionLede} style={{ marginTop: 28 }}>
            Solo se publican datos deportivos públicos: nombre, club, categoría y
            resultados. No se publican RUT, contacto, fecha de nacimiento ni fotografías.
          </p>
        </Reveal>
      </section>
    </>
  );
}
