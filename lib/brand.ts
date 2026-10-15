// ─────────────────────────────────────────────────────────────────────────
//  CONFIG DE MARQUE — Éloïse Legault, courtier immobilier résidentiel (eXp)
//  Territoire : Sainte-Agathe-des-Monts et les Laurentides.
//
//  Le SEUL fichier à éditer pour rebrander l'app à un nouveau client.
//  (+ lib/regions.ts pour la liste des secteurs, + les images dans /public,
//   + les variables d'environnement pour les intégrations : voir .env.local.example)
//
//  Palette : blanc / bleu #00B8F0 (reprise de eval-justinlegault). Les couleurs
//  se règlent dans app/globals.css (bloc @theme) — cherche les variables
//  --color-brand-* et --color-accent.
//  Polices : Jost (titres), Poppins (corps), Montserrat (micro-typo) — app/layout.tsx.
// ─────────────────────────────────────────────────────────────────────────

export interface BrokerConfig {
  name: string;
  title: string;
  /** Chemin de la photo dans /public (ex. "/broker-1.jpg") */
  photo: string;
  /** Cadrage de la photo dans le rond du badge (ex. "50% 18%") */
  objectPosition: string;
  /** Téléphone affiché (ex. "514 000-0000") — vide = badge non cliquable */
  phoneDisplay: string;
  /** Téléphone au format tel: (ex. "+15140000000") — vide = badge non cliquable */
  phoneTel: string;
}

export interface LogoConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Hauteur affichée (classes Tailwind). Défaut : "h-7 sm:h-9", adapté aux
   *  logos larges ; un logo compact/carré demande plus de hauteur. */
  heightClass?: string;
}

export interface BrandConfig {
  /** Identifiant court du déploiement — sert de "source" au CRM et de projet Clarity Scanner par défaut. */
  slug: string;

  /** Nom de l'équipe/courtier (affiché en filigrane dans le formulaire, le footer, le consentement). */
  teamName: string;

  /** Région / territoire couvert (textes marketing, rapport de repli, footer). */
  region: string;
  /** Ville centrale (utilisée dans les textes du rapport de repli). */
  city: string;

  /** Carte décorative du hero. */
  map: {
    center: [number, number]; // [lat, lng]
    zoom: number;
  };

  /** Textes du hero. */
  hero: {
    chip: string;
    title: string;
    /** Segment exact du titre en bleu shimmer + police douce (serif italique) (ex. "au meilleur prix"). Optionnel. */
    titleHighlight?: string;
    /** Segment exact du titre en police douce (serif italique), sans shimmer. Optionnel. */
    titleSoft?: string;
    subtitle: string;
    signature: string; // région affichée sous le titre
    cta: string;
    ctaHint: string;
    scrollHint: string;
  };

  /**
   * Logos fixes en haut : identité à gauche, bannière à droite.
   * Les deux sont optionnels — un logo absent n'est simplement pas rendu
   * (dans ce cas-là, `wordmark` sert de repli pour le slot de droite).
   */
  logos: {
    team?: LogoConfig;
    banner?: LogoConfig;
  };

  /** Signature texte fixe en haut à droite, utilisée seulement si `logos.banner` est absent. */
  wordmark: {
    name: string;
    tagline: string;
  };

  /** Courtier(s). Les noms servent aux textes du rapport. */
  brokers: BrokerConfig[];
}

export const BRAND: BrandConfig = {
  slug: "meilleurprix-eloiselegault",

  teamName: "Éloïse Legault",

  region: "les Laurentides",
  city: "Sainte-Agathe-des-Monts",

  map: {
    // Sainte-Agathe-des-Monts (même centre que eval-justinlegault).
    center: [46.0457, -74.2798],
    zoom: 14,
  },

  hero: {
    chip: "Analyse personnalisée",
    title: "Ta propriété se vendra-t-elle au meilleur prix ?",
    titleHighlight: "au meilleur prix",
    subtitle:
      "Répondez à 9 questions et recevez une analyse honnête et confidentielle des facteurs qui font monter ou baisser votre prix de vente.",
    signature: "Laurentides",
    cta: "Commencer mon analyse",
    ctaHint: "3 minutes — gratuit et confidentiel",
    scrollHint: "Confidentiel · Sans engagement",
  },

  logos: {
    // eXp Agence immobilière — même logo/traitement que eval-justinlegault.
    team: {
      src: "/logo-exp.png",
      alt: "eXp Agence immobilière",
      width: 693,
      height: 442,
      heightClass: "h-10 sm:h-12",
    },
    // TODO: logo personnel d'Éloïse Legault (script bleu + icône maison, reçu
    // en aperçu) — à enregistrer dans /public (ex. "/logo-eloiselegault.png"),
    // mesurer sa largeur/hauteur réelles, puis décommenter :
    // banner: {
    //   src: "/logo-eloiselegault.png",
    //   alt: "Éloïse Legault",
    //   width: 400,
    //   height: 150,
    //   heightClass: "h-9 sm:h-11",
    // },
  },

  // Repli tant que le logo personnel n'est pas encore intégré (voir TODO ci-dessus).
  wordmark: {
    name: "Éloïse Legault",
    tagline: "Courtier immobilier résidentiel",
  },

  brokers: [
    {
      name: "Éloïse Legault",
      title: "Courtier immobilier résidentiel",
      photo: "",
      objectPosition: "50% 18%",
      phoneDisplay: "819 324-9364",
      phoneTel: "+18193249364",
    },
  ],
};

/** "Prénom ou Prénom" — utilisé dans les textes qui nomment l'équipe. */
export function brokersInlineNames(): string {
  const firsts = BRAND.brokers.map((b) => b.name.split(/\s+/)[0]).filter(Boolean);
  if (firsts.length === 0) return "un courtier";
  if (firsts.length === 1) return firsts[0];
  return `${firsts.slice(0, -1).join(", ")} ou ${firsts[firsts.length - 1]}`;
}
