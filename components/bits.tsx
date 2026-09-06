import { clubColor, clubShort, initials } from "@/lib/data";
import styles from "./ui.module.css";

export function Avatar({
  name,
  color,
  large = false,
}: {
  name: string;
  color: string;
  large?: boolean;
}) {
  return (
    <span
      className={`${styles.avatar} ${large ? styles.avatarLg : ""}`}
      style={{ background: color }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function ClubTag({ club }: { club: string }) {
  return (
    <span className={styles.clubTag}>
      <span className={styles.dot} style={{ background: clubColor(club) }} />
      {clubShort(club)}
    </span>
  );
}

export function Medals({
  gold,
  silver,
  bronze,
}: {
  gold: number;
  silver: number;
  bronze: number;
}) {
  const items: [string, number, string][] = [
    ["Oro", gold, styles.medalGold],
    ["Plata", silver, styles.medalSilver],
    ["Bronce", bronze, styles.medalBronze],
  ];
  return (
    <span className={styles.medals}>
      {items.map(([label, n, cls]) => (
        <span
          key={label}
          className={`${styles.medal} ${n ? cls : styles.medalZero}`}
          title={`${n} ${label.toLowerCase()}`}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="14" r="7" />
            <path d="M8 1h3l-2 6-3-4zM16 1h-3l2 6 3-4z" />
          </svg>
          {n}
        </span>
      ))}
      <span className="sr-only">
        {gold} oro, {silver} plata, {bronze} bronce
      </span>
    </span>
  );
}

export function RankBadge({ rank }: { rank: number }) {
  const cls =
    rank === 1 ? styles.rank1 : rank === 2 ? styles.rank2 : rank === 3 ? styles.rank3 : "";
  return <span className={`${styles.rank} ${cls}`}>{rank}</span>;
}

export function CategoryBadge({ id, label, color }: { id: string; label: string; color: string }) {
  return (
    <span
      className={styles.badge}
      style={{
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
      key={id}
    >
      {label}
    </span>
  );
}
