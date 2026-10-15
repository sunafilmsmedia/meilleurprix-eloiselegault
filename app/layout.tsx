import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Montserrat, Jost } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import Clarity from "@/components/Clarity";
import { BRAND } from "@/lib/brand";
import "./globals.css";

// Corps de texte
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Titres — branché sur --font-serif (et --font-display qui s'y chaîne dans
// globals.css), la variable qu'utilisent `.font-serif` et `.display-title`.
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// Micro-typo : étiquettes, majuscules espacées, boutons
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.teamName} — Vendez-vous au meilleur prix dans ${BRAND.region} ?`,
  description: `Une analyse personnalisée, propulsée par l'intelligence artificielle, pour savoir si votre propriété va se vendre au meilleur prix du marché dans ${BRAND.region}.`,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://exemple.vercel.app"),
  openGraph: {
    title: `Votre propriété va-t-elle se vendre au meilleur prix ?`,
    description: `Analyse personnalisée — ${BRAND.teamName}, courtier immobilier dans ${BRAND.region}.`,
    locale: "fr_CA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA" className={`${poppins.variable} ${jost.variable} ${montserrat.variable}`}>
      <body className="min-h-screen antialiased">
        <MetaPixel />
        <Clarity />
        {children}
        <Script
          src="https://clarity-scanner.vercel.app/tracker.js"
          data-project={process.env.NEXT_PUBLIC_CLARITY_SCANNER_PROJECT ?? BRAND.slug}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
