import Image from "next/image";
import styles from "./Volante.module.css";

/**
 * Volante oficial del sitio original (assets/deco-plumilla). Es una
 * ilustración en negro sobre transparente, así que en modo oscuro se invierte
 * por CSS en vez de mantener dos archivos.
 */
export default function Volante({
  className,
  size = 220,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/volante.png"
      alt=""
      width={size}
      height={size}
      className={`${styles.volante} ${className ?? ""}`}
      priority={priority}
      aria-hidden="true"
    />
  );
}
