"use client";

import { motion } from "framer-motion";
import type { AnalyzeResponse, Verdict } from "@/lib/types";
import { BRAND } from "@/lib/brand";

interface Props {
  analyze: AnalyzeResponse;
  // Coordonnées déjà recueillies et transmises pendant le formulaire
  // (lib/questions.ts) — stored = le lead a bien été transmis au CRM.
  leadStored: boolean;
  firstName: string;
  onRestart: () => void;
}

const VERDICT_BADGE: Record<Verdict, { label: string; color: string; bg: string; ring: string }> = {
  favorable: {
    label: "Prête pour le meilleur prix",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
  },
  moyen: {
    label: "Prix à risque",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
  },
  defavorable: {
    label: "Risque de vendre sous le marché",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/30",
  },
};

const VERDICT_HEADLINE: Record<Verdict, string> = {
  favorable: "Votre propriété est prête à aller chercher le meilleur prix.",
  moyen: "Vous êtes proche, mais une partie de votre prix est à risque.",
  defavorable: "Telle quelle, votre propriété risque de se vendre sous le marché.",
};

export default function ResultsScreen({ analyze, leadStored, firstName, onRestart }: Props) {
  const { scoring, report } = analyze;
  const badge = VERDICT_BADGE[scoring.verdict];
  const verdictHeadline = VERDICT_HEADLINE[scoring.verdict];

  return (
    <div className="min-h-screen px-5 sm:px-8 py-10 sm:py-14 max-w-3xl mx-auto w-full">
      {/* Verdict badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex justify-center mb-8"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${badge.bg} ring-1 ${badge.ring}`}>
          <span className={`w-2 h-2 rounded-full ${badge.color.replace("text-", "bg-")}`} />
          <span className={`text-xs font-medium tracking-wide ${badge.color}`}>{badge.label}</span>
        </div>
      </motion.div>

      {/* Headline — verdict en gros, puis résumé IA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <h1 className="display-title text-[2rem] sm:text-5xl lg:text-6xl text-[var(--color-brand-100)] text-balance">
          {verdictHeadline}
        </h1>
        <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed text-balance max-w-2xl mx-auto">
          {report.summary}
        </p>
      </motion.div>

      {/* Score card */}
      <ScoreCard score={scoring.score} verdict={scoring.verdict} />

      {/* Mention discrète sous la note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="text-center text-[11px] sm:text-xs text-slate-500 italic mt-3"
      >
        Un courtier vous appellera pour confirmer les résultats.
      </motion.p>

      {/* Confirmation — les coordonnées ont déjà été transmises pendant le formulaire */}
      <ConfirmationBlock stored={leadStored} firstName={firstName} />

      {/* Stats secondaires — sous le tableau de coordonnées */}
      <div className="grid sm:grid-cols-3 gap-3 mt-12">
        {report.stats.slice(1, 4).map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.07 }}
            className="glass-card rounded-2xl p-5"
          >
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className="font-serif text-2xl text-[var(--color-brand-100)] mt-1">{s.value}</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Market insight */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="
          mt-12
          rounded-2xl
          bg-gradient-to-br from-[var(--color-brand-500)]/10 to-[var(--color-brand-700)]/10
          border border-[var(--color-brand-400)]/20
          p-5 sm:p-6
        "
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-brand-500)]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--color-brand-300)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 2 L18 18 L2 18 Z" strokeLinejoin="round" />
              <path d="M10 8 V13 M10 15.5 V15.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[var(--color-brand-300)] mb-1.5">
              Donnée du marché
            </p>
            <p className="text-sm sm:text-base text-[var(--color-brand-100)] leading-relaxed">
              {report.marketInsight}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Facteurs détectés */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="mt-10"
      >
        <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-4">
          Facteurs détectés
        </h3>
        <ul className="space-y-2">
          {scoring.factors.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span
                className={`shrink-0 w-2 h-2 rounded-full ${
                  f.tone === "positive"
                    ? "bg-emerald-400"
                    : f.tone === "negative"
                    ? "bg-rose-400"
                    : "bg-slate-500"
                }`}
              />
              <span className="text-slate-300">{f.label}</span>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* Étapes */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="mt-12"
      >
        <h3 className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-5">
          Prochaines étapes
        </h3>
        <ol className="space-y-3">
          {report.steps.map((s, i) => (
            <li key={i} className="glass-card rounded-2xl p-4 sm:p-5 flex gap-4">
              <span className="
                shrink-0 w-8 h-8 rounded-full
                bg-gradient-to-br from-[var(--color-gold-soft)] to-[var(--color-gold)]
                flex items-center justify-center
                font-serif text-[#0b1f3f] text-sm font-semibold
                shadow-[0_6px_18px_-4px_rgba(0,184,240,0.45)]
              ">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-[var(--color-brand-100)]">{s.title}</p>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* Footer */}
      <div className="mt-12 mb-24 sm:mb-12 text-center">
        <button
          onClick={onRestart}
          className="text-sm text-slate-400 hover:text-[var(--color-brand-200)] transition-colors underline underline-offset-4 decoration-white/15 hover:decoration-[var(--color-brand-400)]"
        >
          Refaire une évaluation
        </button>
        <p className="mt-6 text-[10px] text-slate-600 uppercase tracking-[0.2em]">
          Analyse {analyze.generatedBy === "claude" ? "IA" : "déterministe"} · {BRAND.teamName} · {BRAND.region}
        </p>
      </div>
    </div>
  );
}

function ConfirmationBlock({
  stored,
  firstName,
}: {
  stored: boolean;
  firstName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        mt-12 rounded-3xl p-6 sm:p-8
        ${stored
          ? "bg-gradient-to-br from-emerald-400/20 to-emerald-200/10 border border-emerald-500/30"
          : "bg-gradient-to-br from-[var(--color-gold)]/10 to-transparent border border-[var(--color-gold)]/30"}
      `}
    >
      {stored ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7L10 3L17 7M3 7V15A2 2 0 0 0 5 17H15A2 2 0 0 0 17 15V7M3 7L10 11L17 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-serif text-xl sm:text-2xl text-[var(--color-brand-100)]">
              {`Merci ${firstName}, votre analyse arrive.`}
            </p>
          </div>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Vous allez recevoir votre analyse complète, avec les ventes comparables de
            votre secteur, par courriel dans les prochaines minutes.
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[var(--color-gold)]" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M10 2 L17 6 L17 11 C17 14.5 14 17.5 10 18 C6 17.5 3 14.5 3 11 L3 6 Z" strokeLinejoin="round" />
              <path d="M7 10 L9.5 12.5 L14 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-serif text-xl sm:text-2xl text-[var(--color-gold-soft)]">
              Vos coordonnées n&apos;ont pas été conservées.
            </p>
          </div>
          <p className="text-sm sm:text-base text-[var(--color-gold-soft)]/85 leading-relaxed">
            Si vous voulez malgré tout recevoir nos mises à jour du marché, revenez nous voir.
            L&apos;analyse reste à votre disposition ici.
          </p>
        </>
      )}
    </motion.div>
  );
}

function ScoreCard({ score, verdict }: { score: number; verdict: Verdict }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="
        relative overflow-hidden
        rounded-3xl p-7 sm:p-9
        bg-gradient-to-br from-[#16366b] via-[#0e2548] to-[#07152b]
        border border-[var(--color-gold)]/25
        shadow-[0_30px_80px_-30px_rgba(3,10,24,0.9),0_0_0_1px_rgba(0,184,240,0.12)_inset]
      "
    >
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[var(--color-gold)]/15 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />

      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/65">
          Score meilleur prix
        </p>
        <div className="flex items-baseline gap-2 mt-3">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-serif text-7xl sm:text-8xl text-white leading-none"
          >
            {score}
          </motion.span>
          <span className="font-serif text-2xl text-white/55">/100</span>
        </div>

        <div className="mt-6 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`
              h-full rounded-full
              ${
                verdict === "favorable"
                  ? "bg-gradient-to-r from-emerald-300 to-emerald-400"
                  : verdict === "moyen"
                  ? "bg-gradient-to-r from-amber-300 to-amber-400"
                  : "bg-gradient-to-r from-rose-300 to-rose-400"
              }
            `}
          />
        </div>

        <p className="mt-4 text-sm text-white/70">
          {verdict === "favorable"
            ? "Votre propriété part avec une longueur d'avance."
            : verdict === "moyen"
            ? "Quelques points à régler avant la mise en marché."
            : "Plusieurs points à corriger avant de mettre en vente."}
        </p>
      </div>
    </motion.div>
  );
}
