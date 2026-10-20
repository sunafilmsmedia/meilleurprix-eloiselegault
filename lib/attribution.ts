// ─────────────────────────────────────────────────────────────────────────
//  ATTRIBUTION PUBLICITAIRE — capturée côté navigateur, transmise au CRM.
//
//  Ce que Meta attend pour rattacher un lead à une pub :
//   - `fbc` : l'identifiant de clic, dérivé du `fbclid` de l'URL. Le pixel
//     le dépose dans le cookie `_fbc`, mais seulement APRÈS son chargement —
//     si la personne remplit vite, le cookie peut ne pas exister. On le
//     reconstruit alors au format officiel `fb.1.<timestamp>.<fbclid>`.
//   - `fbp` : l'identifiant navigateur, cookie `_fbp` posé par le pixel.
//
//  On capture au PREMIER chargement et on garde en sessionStorage : les
//  paramètres d'URL disparaissent dès que la personne recharge ou navigue,
//  alors que le formulaire n'est soumis qu'à la toute fin du parcours.
// ─────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "attribution";

export interface Attribution {
  fbclid: string;
  fbc: string;
  fbp: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  ttclid: string;
  referrer: string;
  landingUrl: string;
}

const EMPTY: Attribution = {
  fbclid: "",
  fbc: "",
  fbp: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  gclid: "",
  ttclid: "",
  referrer: "",
  landingUrl: "",
};

function readCookie(name: string): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * À appeler au montage de la page. Fusionne ce qui est déjà en session avec
 * ce que l'URL apporte : une valeur déjà capturée n'est jamais écrasée par
 * du vide, mais les cookies Meta sont rafraîchis (le pixel les pose tard).
 */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  const stored = readAttribution();
  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => params.get(k)?.trim() ?? "";

  const fbclid = get("fbclid") || stored.fbclid;
  // Le cookie fait foi ; sinon on reconstruit le fbc à partir du fbclid.
  const fbc =
    readCookie("_fbc") ||
    stored.fbc ||
    (fbclid ? `fb.1.${Date.now()}.${fbclid}` : "");

  const next: Attribution = {
    fbclid,
    fbc,
    fbp: readCookie("_fbp") || stored.fbp,
    utmSource: get("utm_source") || stored.utmSource,
    utmMedium: get("utm_medium") || stored.utmMedium,
    utmCampaign: get("utm_campaign") || stored.utmCampaign,
    utmContent: get("utm_content") || stored.utmContent,
    utmTerm: get("utm_term") || stored.utmTerm,
    gclid: get("gclid") || stored.gclid,
    ttclid: get("ttclid") || stored.ttclid,
    referrer: stored.referrer || document.referrer || "",
    landingUrl: stored.landingUrl || window.location.href,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // navigation privée / stockage bloqué — on continue sans persister
  }
  return next;
}

/** Relit ce qui a été capturé. Renvoie des chaînes vides si rien n'est stocké. */
export function readAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Attribution>) };
  } catch {
    // ignore
  }
  return EMPTY;
}

/**
 * Valeur à envoyer au moment de la soumission : on relit les cookies Meta,
 * qui ont eu le temps d'être posés depuis l'arrivée sur la page.
 */
export function attributionForSubmit(): Attribution {
  return captureAttribution();
}
