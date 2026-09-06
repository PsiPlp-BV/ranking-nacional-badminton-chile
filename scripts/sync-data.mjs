/**
 * Trae los datos oficiales desde el sitio estático original y los deja como
 * JSON tipable para la app Next.
 *
 *     node scripts/sync-data.mjs
 *
 * La fuente de verdad sigue siendo el pipeline Python del repo original
 * (scripts/build_data.py -> js/data.js). Acá no se recalcula nada: solo se
 * traduce de `const PLAYERS = [...]` a JSON. Si cambias los datos, corre el
 * pipeline allá y después este script.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = join(HERE, "..");
const SOURCE = process.env.RANKING_SOURCE || join(APP, "..", "Ranking_nacional_badminton");

function loadGlobals(file, names) {
  const code = readFileSync(join(SOURCE, file), "utf8");
  const context = vm.createContext({});
  // `const` en un contexto vm queda en el scope léxico del script, no como
  // propiedad del global: hay que devolverlo con una expresión final.
  return vm.runInContext(`${code}\n;({ ${names.join(", ")} })`, context);
}

const { PLAYERS, CLUBS } = loadGlobals("js/data.js", ["PLAYERS", "CLUBS"]);
const meta = loadGlobals("js/meta.js", [
  "CATEGORIES", "MODALITIES", "POINTS_TABLE", "FECHAS", "CLUB_RULES",
  "ATHLETE_RULES", "FEDERATION", "TIEBREAK_RULES", "CLUB_TIEBREAK_RULES",
]);

const outDir = join(APP, "data");
mkdirSync(outDir, { recursive: true });

const write = (name, value) => {
  writeFileSync(join(outDir, name), JSON.stringify(value, null, 2) + "\n", "utf8");
  return Array.isArray(value) ? value.length : Object.keys(value).length;
};

console.log("deportistas:", write("players.json", PLAYERS));
console.log("clubes:     ", write("clubs.json", CLUBS));
console.log("meta:       ", write("meta.json", meta), "colecciones");

// El logo oficial de la Federación y la ilustración del volante se copian tal
// cual desde el sitio original: son identidad de marca, no assets de diseño
// que convenga rehacer.
const assets = [
  ["assets/logo_fedebad_transparent.png", "public/logo-fedebad.png"],
  ["assets/logo_fedebad_256.png", "public/logo-fedebad-256.png"],
  ["assets/favicon_fedebad_64.png", "public/favicon-64.png"],
  ["assets/favicon_fedebad_32.png", "public/favicon-32.png"],
  ["assets/deco-plumilla_web.png", "public/volante.png"],
];
for (const [from, to] of assets) {
  mkdirSync(dirname(join(APP, to)), { recursive: true });
  copyFileSync(join(SOURCE, from), join(APP, to));
}
console.log("assets copiados:", assets.length);
