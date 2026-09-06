import playersJson from "@/data/players.json";
import clubsJson from "@/data/clubs.json";
import metaJson from "@/data/meta.json";
import type { Club, Fecha, Meta, Modality, Player } from "./types";

export const PLAYERS = playersJson as Player[];
export const CLUBS = clubsJson as Club[];
export const META = metaJson as unknown as Meta;

export const { CATEGORIES, MODALITIES, POINTS_TABLE, FECHAS, FEDERATION } = META;

export const FECHA_NUMS: number[] = FECHAS.map((f) => f.numero);
export const FECHAS_JUGADAS: Fecha[] = FECHAS.filter((f) => f.estado === "completado");

export const modalityById: Record<string, Modality> = Object.fromEntries(
  MODALITIES.map((m) => [m.id, m]),
);

export const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

const playersById: Record<string, Player> = Object.fromEntries(
  PLAYERS.map((p) => [p.id, p]),
);
const playersByName: Record<string, Player> = Object.fromEntries(
  PLAYERS.map((p) => [p.name, p]),
);
const clubsByName: Record<string, Club> = Object.fromEntries(
  CLUBS.map((c) => [c.name, c]),
);

export const getPlayer = (id: string): Player | undefined => playersById[id];
export const getPlayerByName = (name: string): Player | undefined => playersByName[name];
export const clubColor = (name: string): string => clubsByName[name]?.color ?? "#898781";
export const clubShort = (name: string): string => clubsByName[name]?.short ?? name;

/** Cuadros únicos disputados: un cuadro es único por (fecha, código). */
export const TOTAL_CUADROS = new Set(
  PLAYERS.flatMap((p) => p.results.map((r) => `${r.fecha}|${r.event}`)),
).size;

export const TOTAL_PUNTOS = PLAYERS.reduce((s, p) => s + p.total_points, 0);

/** Puntos de un deportista dentro de UNA categoría (nunca se suman entre sí). */
export function pointsInCategory(player: Player, category: string): number {
  return player.results
    .filter((r) => r.category === category)
    .reduce((s, r) => s + r.points, 0);
}

/** Top N de una categoría. Cada categoría se calcula por separado, a propósito. */
export function topInCategory(category: string, n = 3) {
  return PLAYERS.map((p) => ({ player: p, points: pointsInCategory(p, category) }))
    .filter((x) => x.points > 0)
    .sort((a, b) => b.points - a.points || a.player.name.localeCompare(b.player.name, "es"))
    .slice(0, n);
}

/* -------------------------------------------------------------------------
   Rama (masculina / femenina)
   -------------------------------------------------------------------------
   Los datos oficiales no traen un campo de sexo, y no hace falta: las
   modalidades del torneo YA son ramas. Quien juega Individual o Dobles
   Masculino compite en la rama masculina, y viceversa. Lo que se deduce acá
   es entonces la RAMA EN QUE COMPITE cada deportista —un dato deportivo
   público, como su club o su categoría—, no una afirmación sobre su
   identidad, y por eso el sitio la nombra "rama" y no "sexo".

   El dobles mixto no define rama por sí solo (cada pareja tiene uno de cada),
   así que no se usa para deducir. Con los datos actuales alcanza igual: las
   97 personas del circuito quedan asignadas sin ambigüedad y sin conflictos,
   y las 53 parejas de mixto resultan tener siempre un integrante de cada
   rama, que es la comprobación cruzada de que la deducción está bien. */

export type Rama = "Masculino" | "Femenino";

const RAMA_DE_MODALIDAD: Record<string, Rama> = {
  "Individuales Masculino": "Masculino",
  "Dobles Masculino": "Masculino",
  "Individuales Femenino": "Femenino",
  "Dobles Femenino": "Femenino",
};

/** Rama que implica una modalidad; `undefined` en mixto y en "general". */
export const ramaDeModalidad = (modalityId: string): Rama | undefined =>
  RAMA_DE_MODALIDAD[modalityId];

const ramaPorNombre: Record<string, Rama> = {};
for (const p of PLAYERS) {
  for (const r of p.results) {
    const rama = RAMA_DE_MODALIDAD[r.modality];
    if (rama) {
      ramaPorNombre[p.name] = rama;
      break;
    }
  }
}

export const ramaDe = (name: string): Rama | undefined => ramaPorNombre[name];

export const RAMA_LABEL: Record<Rama, string> = {
  Masculino: "masculina",
  Femenino: "femenina",
};

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

export const resultLabel = (position: number | null): string => {
  if (position === 1) return "Campeón/a";
  if (position === 2) return "Subcampeón/a";
  if (position === 3) return "Tercer lugar";
  if (position === 4) return "Cuarto lugar";
  if (position && position >= 5) return "5°-8° lugar";
  return "Participación";
};
