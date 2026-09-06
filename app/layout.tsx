import type { Metadata, Viewport } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ranking Nacional de Bádminton — Chile 2026",
    template: "%s · Ranking Nacional de Bádminton",
  },
  description:
    "Ranking oficial de la Federación Chilena de Badminton: clasificación individual por categoría y modalidad, ranking de clubes y perfiles de deportistas del Torneo Nacional 2026.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
  },
};

// El sitio abre en claro, así que la barra del navegador acompaña ese tono.
export const viewport: Viewport = {
  themeColor: "#f8fafc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `data-theme="light"` fija el tema inicial: quien entra por primera vez ve
    // el sitio claro, tenga el sistema operativo como lo tenga. El oscuro queda
    // como elección explícita del usuario, no como default heredado del SO.
    <html
      lang="es-CL"
      data-theme="light"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Reaplica el tema guardado antes del primer paint, para que quien ya
            eligió oscuro no vea un destello claro al cargar. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <a href="#contenido" className="sr-only">
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
