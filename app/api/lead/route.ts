import { NextResponse } from "next/server";
import { computeScoring } from "@/lib/scoring";
import { REGIONS } from "@/lib/regions";
import { BRAND } from "@/lib/brand";
import { splitName } from "@/lib/types";
import type { Answers, LeadPayload, LeadType } from "@/lib/types";
import type { Attribution } from "@/lib/attribution";

export const runtime = "nodejs";

interface IncomingBody extends Partial<LeadPayload> {
  answers?: Answers;
  leadType?: LeadType;
  // Attribution publicitaire capturée côté navigateur (lib/attribution.ts).
  attribution?: Attribution;
}

export async function POST(req: Request) {
  let body: IncomingBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, phone, email, consent, answers } = body;
  const attr: Attribution = body.attribution ?? {
    fbclid: "", fbc: "", fbp: "", utmSource: "", utmMedium: "", utmCampaign: "",
    utmContent: "", utmTerm: "", gclid: "", ttclid: "", referrer: "", landingUrl: "",
  };
  const leadType: LeadType = body.leadType ?? "evaluation";

  if (!name || !email || !consent || !answers) {
    return NextResponse.json(
      { stored: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Tous les verdicts sont transmis : un score bas = un vendeur qui a le
  // plus besoin d'accompagnement (lead chaud, pas un lead à écarter).
  const scoring = computeScoring(answers);

  const { firstName, lastName } = splitName(name);
  // Secteur de la liste → son nom ; sinon on garde le texte libre saisi.
  const regionName = REGIONS.find((r) => r.id === answers.region)?.name ?? answers.region ?? "";

  // Segmentation jour/nuit — heure du Québec (IANA gère l'été/hiver).
  // 8h→20h = jour, 20h→8h = nuit.
  const heureQuebec = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Montreal",
      hour: "2-digit",
      hour12: false,
      hourCycle: "h23",
    }).format(new Date()),
    10
  );
  const jour = heureQuebec >= 8 && heureQuebec < 20;

  // Payload aplati pour mapping GHL direct + données brutes en complément.
  const payload = {
    source: BRAND.slug,
    receivedAt: new Date().toISOString(),

    // Type de lead — permet à GHL de router via le workflow
    leadType,

    // Contact
    firstName,
    lastName,
    fullName: name,
    phone: phone ?? "",
    email,

    // Segmentation jour/nuit (heure Québec)
    periode: jour ? "jour" : "nuit",
    lead_type: jour ? "lead_jour" : "lead_nuit",
    heureQuebec,

    // ─── Attribution publicitaire ─────────────────────────────────────
    // fbc/fbp/fbclid : ce que Meta demande pour rattacher le lead à la pub
    // (Conversions API). userAgent + ip viennent de la requête serveur, ils
    // sont exigés en plus des identifiants côté navigateur.
    fbclid: attr.fbclid ?? "",
    fbc: attr.fbc ?? "",
    fbp: attr.fbp ?? "",
    utmSource: attr.utmSource ?? "",
    utmMedium: attr.utmMedium ?? "",
    utmCampaign: attr.utmCampaign ?? "",
    utmContent: attr.utmContent ?? "",
    utmTerm: attr.utmTerm ?? "",
    gclid: attr.gclid ?? "",
    ttclid: attr.ttclid ?? "",
    referrer: attr.referrer ?? "",
    landingUrl: attr.landingUrl ?? "",
    eventSourceUrl: attr.landingUrl ?? "",
    userAgent: req.headers.get("user-agent") ?? "",
    clientIp: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim(),

    // Scoring
    score: scoring.score,
    verdict: scoring.verdict,

    // Détails propriété
    propertyType: answers.propertyType ?? "",
    sellTimeline: answers.sellTimeline ?? "",
    pricingMethod: answers.pricingMethod ?? "",
    bigThree: answers.bigThree ?? "",
    estimatedValue: answers.estimatedValue ?? 0,
    interiorCondition: answers.interiorCondition ?? "",
    curbAppeal: answers.curbAppeal ?? "",
    region: regionName,
    regionId: answers.region ?? "",
    // Signal critique : la personne est déjà sous contrat MAIS veut changer
    // (lead de "poaching" — info précieuse pour le courtier)
    hasContract: answers.hasContract ?? false,
    wantsToSwitch: answers.wantsToSwitch ?? false,

    // Données brutes
    lead: { name, phone, email },
    attribution: attr,
    scoring: { score: scoring.score, verdict: scoring.verdict },
    answers,
  };

  // Webhook CRM (GHL) — à définir via CRM_WEBHOOK_URL (env Vercel / .env.local).
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  const webhookSecret = process.env.CRM_WEBHOOK_SECRET;
  if (!webhookUrl) {
    console.warn("[lead] CRM_WEBHOOK_URL absent — lead NON transmis au CRM.");
  }

  if (webhookUrl) {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (webhookSecret) headers["X-Webhook-Secret"] = webhookSecret;
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[lead] Webhook returned", res.status);
      }
    } catch (err) {
      console.error("[lead] Webhook failed", err);
    }
  } else {
    console.log("[lead] Stored (no webhook configured):", JSON.stringify(payload));
  }

  return NextResponse.json({
    stored: true,
    verdict: scoring.verdict,
    leadType,
  });
}
