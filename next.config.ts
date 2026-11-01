import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP sin nonces (guía de Next: "Without Nonces"): mantiene las páginas
// estáticas. 'unsafe-inline' en script-src es necesario para los scripts de
// hidratación de Next y el que fija el tema antes del primer paint; igual
// bloquea scripts de cualquier otro dominio, plugins, <base> ajenos, envío de
// formularios afuera y que otro sitio incruste éste (clickjacking). El sitio no
// carga nada externo: las fuentes de next/font se sirven desde el propio
// dominio.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Solo imágenes propias: nada de optimizar URLs de otros dominios ni SVG.
    remotePatterns: [],
    dangerouslyAllowSVG: false,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
