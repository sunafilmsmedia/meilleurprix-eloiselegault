"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import TopLogos from "@/components/TopLogos";
import QualificationForm from "@/components/QualificationForm";
import LoadingScreen from "@/components/LoadingScreen";
import NoSellScreen from "@/components/NoSellScreen";
import ResultsScreen from "@/components/results/ResultsScreen";
import { trackLeadWithMatching } from "@/components/MetaPixel";
import { trackStep } from "@/lib/track";
import { attributionForSubmit, captureAttribution } from "@/lib/attribution";
import { splitName, stripContact } from "@/lib/types";
import type { AnalyzeResponse, Answers } from "@/lib/types";

const HeroBackground = dynamic(() => import("@/components/HeroBackground"), { ssr: false });

type Stage = "hero" | "form" | "loading" | "results" | "noSell";

interface LeadResult {
  stored: boolean;
  firstName: string;
}

const MIN_LOADING_MS = 2000;

export default function Home() {
  const [stage, setStage] = useState<Stage>("hero");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [analyze, setAnalyze] = useState<AnalyzeResponse | null>(null);
  const [leadResult, setLeadResult] = useState<LeadResult | null>(null);

  // fbclid / UTM / cookies Meta : capturés à l'arrivée, avant que la personne
  // navigue et que les paramètres d'URL disparaissent.
  useEffect(() => {
    captureAttribution();
  }, []);

  const handleFormComplete = async (finalAnswers: Answers) => {
    trackStep("analyse");
    setAnswers(finalAnswers);
    setStage("loading");
    if (typeof window !== "undefined") window.scrollTo(0, 0);

    const startedAt = performance.now();
    const propertyAnswers = stripContact(finalAnswers);
    const fullName = finalAnswers.name?.trim() ?? "";
    const { firstName, lastName } = splitName(fullName);

    // Coordonnées déjà recueillies (dernières étapes du formulaire) : on
    // transmet le lead tout de suite, en parallèle du rapport IA — pas
    // besoin d'attendre /api/analyze, /api/lead calcule son propre verdict.
    const leadPromise = fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email: finalAnswers.email?.trim() ?? "",
        phone: finalAnswers.phone?.trim() || undefined,
        consent: finalAnswers.consent ?? false,
        answers: propertyAnswers,
        leadType: "evaluation",
        attribution: attributionForSubmit(),
      }),
    })
      .then((res) => res.json())
      .catch(() => null);

    let result: AnalyzeResponse | null = null;
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: propertyAnswers }),
      });
      if (res.ok) {
        result = (await res.json()) as AnalyzeResponse;
      }
    } catch {
      // result reste null
    }

    const leadData = await leadPromise;

    // Meta Pixel — Lead standard avec Advanced Matching
    trackLeadWithMatching(
      {
        email: finalAnswers.email?.trim(),
        phone: finalAnswers.phone?.trim(),
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
      {
        content_category: "real_estate_best_price",
        verdict: leadData?.verdict,
        currency: "CAD",
      }
    );
    trackStep("soumis");
    setLeadResult({ stored: !!leadData?.stored, firstName });

    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
    setTimeout(() => {
      if (result) {
        setAnalyze(result);
        trackStep("resultats");
        setStage("results");
        if (typeof window !== "undefined") window.scrollTo(0, 0);
      } else {
        setStage("form");
      }
    }, remaining);
  };

  const handleNoSell = (partialAnswers: Answers) => {
    trackStep("pas_vendre");
    setAnswers(partialAnswers);
    setStage("noSell");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const restart = () => {
    setAnswers(null);
    setAnalyze(null);
    setLeadResult(null);
    setStage("hero");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  };

  const showChrome = stage === "hero" || stage === "results" || stage === "noSell";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence>
        {stage === "hero" && (
          <motion.div
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            <HeroBackground />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === "hero" && (
          <motion.div key="hero" className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <Hero onStart={() => { trackStep("debut"); setStage("form"); }} />
          </motion.div>
        )}
        {stage === "form" && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <QualificationForm
              onComplete={handleFormComplete}
              onNoSell={handleNoSell}
              onExit={() => setStage("hero")}
            />
          </motion.div>
        )}
        {stage === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <LoadingScreen />
          </motion.div>
        )}
        {stage === "results" && analyze && answers && leadResult && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <ResultsScreen
              analyze={analyze}
              leadStored={leadResult.stored}
              firstName={leadResult.firstName}
              onRestart={restart}
            />
          </motion.div>
        )}
        {stage === "noSell" && answers && (
          <motion.div key="noSell" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <NoSellScreen answers={answers} onRestart={restart} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logos — visibles sur le hero, les résultats et la page no-sell */}
      <AnimatePresence>
        {showChrome && (
          <motion.div
            key="brand-chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TopLogos />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
