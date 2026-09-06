/**
 * Mapa de secciones del sitio.
 *
 * El sitio original era una sola página con scroll; acá cada sección es una
 * ruta. El criterio para agrupar: "Torneo" reúne calendario y reglamento
 * porque responden la misma pregunta (cómo y cuándo se compite) y por
 * separado quedaban dos páginas flacas. Ranking individual y ranking de
 * clubes, en cambio, son dos competencias distintas con datos y filtros
 * propios, así que van aparte.
 */
export const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/ranking", label: "Ranking" },
  { href: "/clubes", label: "Clubes" },
  { href: "/jugadores", label: "Deportistas" },
  { href: "/torneo", label: "Torneo" },
  { href: "/federacion", label: "Federación" },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
