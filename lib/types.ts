export type FechaNum = number;

export interface Result {
  fecha: FechaNum;
  event: string;
  category: string;
  modality: string;
  /** null = participación (jugó pero no alcanzó puesto). */
  position: number | null;
  points: number;
  partner: string | null;
}

export interface Player {
  id: string;
  name: string;
  club: string;
  club_short: string;
  total_points: number;
  gold: number;
  silver: number;
  bronze: number;
  categories: string[];
  modalities: string[];
  results: Result[];
  color: string;
}

export interface Club {
  name: string;
  short: string;
  color: string;
  athletes: number;
  gold: number;
  silver: number;
  bronze: number;
  /** Puntaje de cada fecha; las claves llegan como string desde el JSON. */
  by_fecha: Record<string, number>;
  total_points: number;
  rank: number;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Modality {
  id: string;
  label: string;
  short: string;
  doubles: boolean;
}

export interface Fecha {
  numero: number;
  nombre: string;
  fechaTexto: string;
  sede: string;
  sedeCorta?: string;
  estado: "completado" | "proxima";
  eventos: number | null;
  inscritos: number | null;
  fuente?: string;
  fuenteUrl?: string;
}

export interface PointsRow {
  pos: string;
  label: string;
  points: number;
}

export interface Federation {
  nombre: string;
  siglas: string;
  sede: string;
  direccion: string;
  email: string;
  web: string;
  tournamentSoftwareUrl: string;
  auspiciadores: { nombre: string; url?: string }[];
  redesSociales: { nombre: string; url: string; icon: string }[];
  gerencia: { nombre: string; cargo: string }[];
  directiva: { nombre: string; cargo: string }[];
}

export interface Meta {
  CATEGORIES: Category[];
  MODALITIES: Modality[];
  POINTS_TABLE: PointsRow[];
  FECHAS: Fecha[];
  CLUB_RULES: Record<string, number>;
  ATHLETE_RULES: Record<string, number>;
  FEDERATION: Federation;
  TIEBREAK_RULES: string[];
  CLUB_TIEBREAK_RULES: string[];
}

/** Métrica agregada de un deportista o pareja en un alcance dado. */
export interface Metric {
  points: number;
  gold: number;
  silver: number;
  bronze: number;
}

export interface RankingRow {
  key: string;
  names: string[];
  ids: (string | null)[];
  clubs: string[];
  byFecha: Record<number, Metric | null>;
  total: Metric;
  rank?: number;
}

export type FechaScope = number | "total";
