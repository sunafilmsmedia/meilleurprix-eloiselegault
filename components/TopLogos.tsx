"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

// Les deux logos sont optionnels dans la config de marque : un slot sans logo
// n'est simplement pas rendu (ici, pas de logo de bannière → coin droit vide
// tant que `BRAND.logos.banner` n'est pas renseigné — voir le TODO dans brand.ts).
export default function TopLogos() {
  const { team, banner } = BRAND.logos;
  // Le logo de bannière prime ; à défaut, on signe en toutes lettres.
  const wordmark = !banner ? BRAND.wordmark : undefined;
  return (
    <>
      {team && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-30 pointer-events-none"
          aria-hidden
        >
          <Image
            src={team.src}
            alt={team.alt}
            width={team.width}
            height={team.height}
            priority
            className={`${team.heightClass ?? "h-7 sm:h-9"} w-auto`}
          />
        </motion.div>
      )}

      {wordmark && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-none leading-tight text-right"
          aria-hidden
        >
          <p className="font-serif italic text-lg sm:text-xl text-[var(--color-brand-100)]">
            {wordmark.name}
          </p>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent-deep)]">
            {wordmark.tagline}
          </p>
        </motion.div>
      )}

      {banner && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-none"
          aria-hidden
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            width={banner.width}
            height={banner.height}
            priority
            className={`${banner.heightClass ?? "h-7 sm:h-9"} w-auto`}
          />
        </motion.div>
      )}
    </>
  );
}
