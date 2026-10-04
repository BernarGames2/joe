import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Caveat_Brush, Courier_Prime, Figtree } from "next/font/google";
import { TEM_LOGO, LOGO_SRC } from "@/lib/brand";
import { HORARIO, NOME, SITE_URL } from "@/lib/config";
import { resumoDias } from "@/lib/horario";
import { baseUrl } from "@/lib/site";
import "./globals.css";

// Big Shoulders com eixo opsz: nos tamanhos grandes é o corte "Display".
// O Next não tem métricas de fallback para ela; o fallback ajustado está em globals.css.
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Big Shoulders Fallback", "Arial Narrow", "sans-serif"],
});
const corpo = Figtree({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
const mao = Caveat_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

const TITULO = "Joe Burger Artesanal | Hamburgueria em Santa Mônica, Uberlândia — peça pelo WhatsApp";
const DESCRICAO = `Hambúrguer artesanal na Santa Mônica, Uberlândia. Monte sua comanda no site e envie pelo WhatsApp. Aberto ${resumoDias(HORARIO)}.`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: TITULO,
  description: DESCRICAO,
  applicationName: NOME,
  ...(SITE_URL ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: NOME,
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRICAO },
  icons: TEM_LOGO ? { icon: LOGO_SRC, apple: LOGO_SRC } : { icon: { url: "/icon.svg", type: "image/svg+xml" } },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0E0F10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} ${mono.variable} ${mao.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marca que há JavaScript (antes da pintura): esconde/mostra os recursos que dependem dele. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
