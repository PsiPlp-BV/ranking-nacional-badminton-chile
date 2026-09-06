import Link from "next/link";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { Avatar, ClubTag } from "@/components/bits";
import {
  CATEGORIES,
  CLUBS,
  FECHAS,
  FECHAS_JUGADAS,
  PLAYERS,
  TOTAL_CUADROS,
  TOTAL_PUNTOS,
  topInCategory,
} from "@/lib/data";
import ui from "@/components/ui.module.css";
import styles from "./page.module.css";

export default function Home() {
  const ultima = FECHAS_JUGADAS[FECHAS_JUGADAS.length - 1];
  const proxima = FECHAS.find((f) => f.estado === "proxima");

  // El marcador de la portada muestra el top 5 de cada categoría y rota entre
  // ellas. Se calcula en el servidor: es dato estático de la fecha.
  const boards = CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    color: c.color,
    rows: topInCategory(c.id, 5).map((r) => ({
      id: r.player.id,
      name: r.player.name,
      club: r.player.club_short,
      clubColor: r.player.color,
      points: r.points,
    })),
  }));

  const tiles = [
    { label: "Deportistas registrados", value: PLAYERS.length, sub: "de todo Chile" },
    { label: "Clubes federados", value: CLUBS.length, sub: "con puntaje oficial" },
    { label: "Cuadros disputados", value: TOTAL_CUADROS, sub: `en ${FECHAS_JUGADAS.length} fechas` },
    { label: "Puntos distribuidos", value: TOTAL_PUNTOS, sub: "temporada 2026" },
  ];

  return (
    <>
      <Hero
        badge={`${FECHAS_JUGADAS.length} de ${FECHAS.length} fechas completadas · Temporada 2026`}
        atletas={PLAYERS.length}
        clubes={CLUBS.length}
        cuadros={TOTAL_CUADROS}
        sede={ultima?.sedeCorta ?? ultima?.sede ?? "—"}
        boards={boards}
      />

      {/* ---- cifras ---- */}
      <section className={`container ${styles.tiles}`}>
        {tiles.map((t, i) => (
          <Reveal key={t.label} delay={i * 0.05}>
            <div className={styles.tile}>
              <p className={styles.tileLabel}>{t.label}</p>
              <p className={`${styles.tileValue} num`}>
                <CountUp to={t.value} />
              </p>
              <p className={styles.tileSub}>{t.sub}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ---- líderes por categoría ---- */}
      <section className={`container ${ui.section}`}>
        <Reveal>
          <h2 className={ui.sectionTitle}>Líderes por categoría</h2>
          <p className={ui.sectionLede}>
            Cada categoría se calcula por separado, a propósito: sumar entre categorías
            de edad premiaría a quien compite en dos, no a quien compite mejor.
          </p>
        </Reveal>

        <div className={styles.podiums}>
          {CATEGORIES.map((cat, i) => {
            const top = topInCategory(cat.id, 3);
            return (
              <Reveal key={cat.id} delay={i * 0.06}>
                <article className={`${ui.card} ${styles.podium}`}>
                  <header className={styles.podiumHead}>
                    <span className={styles.podiumDot} style={{ background: cat.color }} />
                    <h3 className={styles.podiumTitle}>{cat.label}</h3>
                  </header>
                  {top.length ? (
                    <ol className={styles.podiumList}>
                      {top.map((row, idx) => (
                        <li key={row.player.id} className={styles.podiumRow}>
                          <span className={`${styles.podiumRank} num`}>{idx + 1}</span>
                          <Avatar name={row.player.name} color={row.player.color} />
                          <span className={styles.podiumName}>
                            <Link href={`/jugadores/${row.player.id}`}>{row.player.name}</Link>
                            <ClubTag club={row.player.club} />
                          </span>
                          <span className={`${styles.podiumPts} num`}>{row.points}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className={ui.empty}>Aún sin resultados.</p>
                  )}
                  <Link href={`/ranking?categoria=${cat.id}`} className={styles.podiumLink}>
                    Ver ranking {cat.label} →
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ---- estado del circuito ---- */}
      <section className={`container ${ui.section}`}>
        <Reveal>
          <div className={styles.strip}>
            <div>
              <p className="eyebrow">Última fecha disputada</p>
              <h3 className={styles.stripTitle}>{ultima?.nombre}</h3>
              <p className={styles.stripMeta}>
                {ultima?.fechaTexto} · {ultima?.sede}
              </p>
              <p className={styles.stripMeta}>
                {ultima?.eventos} cuadros · {ultima?.inscritos} inscritos
              </p>
            </div>
            <div className={styles.stripDivider} aria-hidden="true" />
            <div>
              <p className="eyebrow">Próxima</p>
              <h3 className={styles.stripTitle}>{proxima?.nombre ?? "Temporada cerrada"}</h3>
              <p className={styles.stripMeta}>{proxima?.fechaTexto}</p>
              <p className={styles.stripMeta}>{proxima?.sede}</p>
            </div>
            <Link href="/torneo" className={styles.stripLink}>
              Calendario y reglamento →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
