import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { Avatar, ClubTag, Medals } from "@/components/bits";
import {
  CATEGORIES,
  FECHA_NUMS,
  PLAYERS,
  categoryById,
  getPlayer,
  getPlayerByName,
  modalityById,
  resultLabel,
} from "@/lib/data";
import { playerRankIn } from "@/lib/ranking";
import ui from "@/components/ui.module.css";
import styles from "./perfil.module.css";

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) return { title: "Deportista no encontrado" };
  return {
    title: player.name,
    description: `${player.name} (${player.club}) — resultados y posición en el Ranking Nacional de Bádminton de Chile 2026.`,
  };
}

export default async function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const player = getPlayer(id);
  if (!player) notFound();

  const fechasJugadas = [...new Set(player.results.map((r) => r.fecha))].sort((a, b) => a - b);

  const porCategoria = player.categories.map((cat) => ({
    cat,
    label: categoryById[cat]?.label ?? cat,
    color: categoryById[cat]?.color ?? "var(--text-primary)",
    points: player.results
      .filter((r) => r.category === cat)
      .reduce((s, r) => s + r.points, 0),
  }));

  const resultados = [...player.results].sort(
    (a, b) =>
      a.fecha - b.fecha ||
      a.category.localeCompare(b.category, "es") ||
      a.modality.localeCompare(b.modality, "es"),
  );

  // Una fila por combinación (categoría, modalidad) en la que compitió.
  const combos: { category: string; modality: string }[] = [];
  const vistos = new Set<string>();
  player.results.forEach((r) => {
    const k = `${r.category}|${r.modality}`;
    if (vistos.has(k)) return;
    vistos.add(k);
    combos.push({ category: r.category, modality: r.modality });
  });

  const posiciones = combos
    .map((c) => ({
      ...c,
      rk: playerRankIn(PLAYERS, player, c.category, c.modality, modalityById, FECHA_NUMS),
    }))
    .filter((c) => c.rk);

  return (
    <>
      <div className={styles.hero}>
        <div className="container">
          <Link href="/jugadores" className={styles.back}>
            ← Deportistas
          </Link>
          <div className={styles.heroRow}>
            <Avatar name={player.name} color={player.color} large />
            <div>
              <h1 className={styles.name}>{player.name}</h1>
              <p className={styles.sub}>
                <ClubTag club={player.club} />
                <span className={ui.dim}>
                  · {player.results.length} resultados en{" "}
                  {fechasJugadas.length > 1
                    ? `${fechasJugadas.length} fechas`
                    : `la ${fechasJugadas[0]}ª Fecha`}
                </span>
              </p>
              <div className={styles.badges}>
                {player.categories.map((c) => {
                  const cat = CATEGORIES.find((x) => x.id === c);
                  return (
                    <span
                      key={c}
                      className={ui.badge}
                      style={{
                        background: `color-mix(in srgb, ${cat?.color ?? "#888"} 14%, transparent)`,
                        color: cat?.color,
                      }}
                    >
                      {cat?.label ?? c}
                    </span>
                  );
                })}
                {player.modalities.map((m) => (
                  <span key={m} className={ui.badge}>
                    {modalityById[m]?.label ?? m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className={`container ${ui.section}`}>
        <Reveal>
          <div className={styles.stats}>
            <div className={`${ui.card} ${ui.cardPad}`}>
              <p className="eyebrow">Puntos por categoría</p>
              <ul className={styles.catList}>
                {porCategoria.map((pc) => (
                  <li key={pc.cat}>
                    <span style={{ color: pc.color, fontWeight: 700 }}>{pc.label}</span>
                    <span className={`${styles.catPts} num`}>{pc.points}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${ui.card} ${ui.cardPad}`}>
              <p className="eyebrow">Medallas</p>
              <div className={styles.bigMedals}>
                <Medals gold={player.gold} silver={player.silver} bronze={player.bronze} />
              </div>
            </div>
            <div className={`${ui.card} ${ui.cardPad}`}>
              <p className="eyebrow">Cuadros disputados</p>
              <p className={styles.bigNum}>{player.results.length}</p>
              <p className={ui.dim} style={{ fontSize: 12.5 }}>
                {player.modalities.length} modalidades distintas
              </p>
            </div>
            <div className={`${ui.card} ${ui.cardPad}`}>
              <p className="eyebrow">Puntaje total</p>
              <p className={styles.bigNum}>{player.total_points}</p>
              <p className={ui.dim} style={{ fontSize: 12.5 }}>
                suma de todas sus categorías
              </p>
            </div>
          </div>
        </Reveal>

        <div className={styles.layout}>
          <Reveal className={styles.resultsCol}>
            <h2 className={ui.sectionTitle} style={{ fontSize: 20, marginBottom: 12 }}>
              Resultados — Temporada 2026
            </h2>
            <div className={`${ui.card}`} style={{ overflow: "hidden" }}>
              <div className={ui.tableWrap}>
                <table className={ui.table}>
                  <thead>
                    <tr>
                      <th style={{ width: 54 }}>Fecha</th>
                      <th>Categoría</th>
                      <th>Modalidad</th>
                      <th>Pareja</th>
                      <th>Resultado</th>
                      <th className={ui.numCell}>Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((r, i) => {
                      const partner = r.partner ? getPlayerByName(r.partner) : null;
                      return (
                        <tr key={`${r.fecha}-${r.event}-${i}`}>
                          <td>
                            <span className={ui.badge}>F{r.fecha}</span>
                          </td>
                          <td>
                            <span style={{ color: categoryById[r.category]?.color, fontWeight: 700 }}>
                              {categoryById[r.category]?.label ?? r.category}
                            </span>
                          </td>
                          <td>{modalityById[r.modality]?.label ?? r.modality}</td>
                          <td>
                            {r.partner ? (
                              partner ? (
                                <Link href={`/jugadores/${partner.id}`} className={styles.link}>
                                  {r.partner}
                                </Link>
                              ) : (
                                r.partner
                              )
                            ) : (
                              <span className={ui.dim}>—</span>
                            )}
                          </td>
                          <td>{resultLabel(r.position)}</td>
                          <td className={`${ui.numCell} ${ui.strong}`}>{r.points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06} className={styles.sideCol}>
            <div className={`${ui.card} ${ui.cardPad}`}>
              <h2 className={ui.cardTitle}>Posición en ranking</h2>
              <ul className={styles.ranks}>
                {posiciones.map((p) => (
                  <li key={`${p.category}-${p.modality}`}>
                    <span className={styles.rankLabel}>
                      {categoryById[p.category]?.label ?? p.category}
                      <span className={ui.dim}>
                        {" "}
                        · {modalityById[p.modality]?.label ?? p.modality}
                      </span>
                    </span>
                    <span className={styles.rankValue}>
                      #{p.rk!.rank}
                      <span className={ui.dim}> / {p.rk!.total}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className={styles.rankNote}>
                Cada fila es un ranking distinto. Las categorías nunca se suman entre sí.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
