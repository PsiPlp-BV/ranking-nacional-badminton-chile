import Volante from "./Volante";
import styles from "./ui.module.css";

export default function PageHeader({
  eyebrow,
  title,
  lede,
  aside,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className={styles.pageHead}>
      <Volante className={styles.headDeco} size={260} />
      <div className={`container ${styles.pageHeadInner}`}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={styles.pageTitle}>{title}</h1>
          {lede && <p className={styles.pageLede}>{lede}</p>}
        </div>
        {aside}
      </div>
    </div>
  );
}
