import type { Region } from "./types";

// ─────────────────────────────────────────────────────────────────────────
//  SECTEURS COUVERTS — Sainte-Agathe-des-Monts et les Laurentides.
//
//  Utilisé par le champ de recherche de secteur (dernière question) :
//  - recherche insensible aux accents et à la casse
//  - si le secteur tapé n'y figure pas, l'utilisateur peut toujours saisir
//    du texte libre (« Utiliser "…" ») — la liste n'a donc pas besoin d'être
//    exhaustive, mais couvrir le territoire améliore l'expérience.
//  Aucune coordonnée (lat/lng) n'est requise : seul `name` est affiché.
//
//  Couverture : MRC des Laurentides, des Pays-d'en-Haut, de La Rivière-du-Nord,
//  d'Antoine-Labelle, d'Argenteuil, plus les municipalités limitrophes de
//  Lanaudière et les anciens noms encore utilisés à l'oral.
// ─────────────────────────────────────────────────────────────────────────
export const REGIONS: Region[] = [
  // ── Cœur du territoire — Sainte-Agathe et ses environs immédiats
  { id: "sainte-agathe-des-monts", name: "Sainte-Agathe-des-Monts" },
  { id: "sainte-agathe-nord", name: "Sainte-Agathe-Nord" },
  { id: "sainte-agathe-sud", name: "Sainte-Agathe-Sud" },
  { id: "ivry-sur-le-lac", name: "Ivry-sur-le-Lac" },
  { id: "val-david", name: "Val-David" },
  { id: "val-morin", name: "Val-Morin" },
  { id: "val-des-lacs", name: "Val-des-Lacs" },
  { id: "lantier", name: "Lantier" },
  { id: "sainte-lucie-des-laurentides", name: "Sainte-Lucie-des-Laurentides" },
  { id: "saint-adolphe-d-howard", name: "Saint-Adolphe-d'Howard" },

  // ── MRC des Laurentides
  { id: "mont-tremblant", name: "Mont-Tremblant" },
  { id: "saint-jovite", name: "Saint-Jovite (Mont-Tremblant)" },
  { id: "mont-blanc", name: "Mont-Blanc" },
  { id: "saint-faustin-lac-carre", name: "Saint-Faustin–Lac-Carré (Mont-Blanc)" },
  { id: "lac-superieur", name: "Lac-Supérieur" },
  { id: "lac-tremblant-nord", name: "Lac-Tremblant-Nord" },
  { id: "brebeuf", name: "Brébeuf" },
  { id: "la-conception", name: "La Conception" },
  { id: "la-minerve", name: "La Minerve" },
  { id: "labelle", name: "Labelle" },
  { id: "montcalm", name: "Montcalm" },
  { id: "amherst", name: "Amherst" },
  { id: "arundel", name: "Arundel" },
  { id: "barkmere", name: "Barkmere" },
  { id: "huberdeau", name: "Huberdeau" },

  // ── MRC des Pays-d'en-Haut
  { id: "sainte-adele", name: "Sainte-Adèle" },
  { id: "saint-sauveur", name: "Saint-Sauveur" },
  { id: "piedmont", name: "Piedmont" },
  { id: "morin-heights", name: "Morin-Heights" },
  { id: "sainte-anne-des-lacs", name: "Sainte-Anne-des-Lacs" },
  { id: "sainte-marguerite-du-lac-masson", name: "Sainte-Marguerite-du-Lac-Masson" },
  { id: "esterel", name: "Estérel" },
  { id: "lac-des-seize-iles", name: "Lac-des-Seize-Îles" },
  { id: "wentworth-nord", name: "Wentworth-Nord" },

  // ── MRC de La Rivière-du-Nord
  { id: "saint-jerome", name: "Saint-Jérôme" },
  { id: "prevost", name: "Prévost" },
  { id: "saint-hippolyte", name: "Saint-Hippolyte" },
  { id: "saint-colomban", name: "Saint-Colomban" },
  { id: "sainte-sophie", name: "Sainte-Sophie" },

  // ── MRC d'Antoine-Labelle
  { id: "riviere-rouge", name: "Rivière-Rouge" },
  { id: "l-annonciation", name: "L'Annonciation (Rivière-Rouge)" },
  { id: "sainte-veronique", name: "Sainte-Véronique (Rivière-Rouge)" },
  { id: "nominingue", name: "Nominingue" },
  { id: "la-macaza", name: "La Macaza" },
  { id: "lac-saguay", name: "Lac-Saguay" },
  { id: "l-ascension", name: "L'Ascension" },
  { id: "mont-laurier", name: "Mont-Laurier" },
  { id: "ferme-neuve", name: "Ferme-Neuve" },
  { id: "chute-saint-philippe", name: "Chute-Saint-Philippe" },
  { id: "kiamika", name: "Kiamika" },
  { id: "lac-des-ecorces", name: "Lac-des-Écorces" },
  { id: "lac-du-cerf", name: "Lac-du-Cerf" },
  { id: "lac-saint-paul", name: "Lac-Saint-Paul" },
  { id: "mont-saint-michel", name: "Mont-Saint-Michel" },
  { id: "notre-dame-de-pontmain", name: "Notre-Dame-de-Pontmain" },
  { id: "notre-dame-du-laus", name: "Notre-Dame-du-Laus" },
  { id: "saint-aime-du-lac-des-iles", name: "Saint-Aimé-du-Lac-des-Îles" },
  { id: "sainte-anne-du-lac", name: "Sainte-Anne-du-Lac" },

  // ── MRC d'Argenteuil
  { id: "lachute", name: "Lachute" },
  { id: "brownsburg-chatham", name: "Brownsburg-Chatham" },
  { id: "grenville", name: "Grenville" },
  { id: "grenville-sur-la-rouge", name: "Grenville-sur-la-Rouge" },
  { id: "harrington", name: "Harrington" },
  { id: "gore", name: "Gore" },
  { id: "mille-isles", name: "Mille-Isles" },
  { id: "saint-andre-d-argenteuil", name: "Saint-André-d'Argenteuil" },
  { id: "wentworth", name: "Wentworth" },

  // ── Limitrophes (Lanaudière et Basses-Laurentides)
  { id: "saint-donat", name: "Saint-Donat" },
  { id: "notre-dame-de-la-merci", name: "Notre-Dame-de-la-Merci" },
  { id: "entrelacs", name: "Entrelacs" },
  { id: "chertsey", name: "Chertsey" },
  { id: "mirabel", name: "Mirabel" },
];
