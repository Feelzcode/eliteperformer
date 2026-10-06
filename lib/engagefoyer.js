/**
 * Server-side proxy to EngageFoyer's registration + contact enrichment APIs.
 * Elite owns the landing UX; EngageFoyer owns webinar CRM, email, and Zoom sync.
 */

import { SMS_CONSENT_TEXT, SMS_MARKETING_CONSENT_TEXT } from "@/lib/sms-consent";

function engageFoyerConfig() {
  const base = process.env.ENGAGEFOYER_APP_URL?.replace(/\/$/, "");
  const apiKey = process.env.ENGAGEFOYER_API_KEY;
  return { base, apiKey };
}

/**
 * Score thank-you pre-intake answers for sales priority.
 * @returns {'hot'|'warm'|'nurture'}
 */
export function scorePreIntakeLead({ hasCapital, timeline, creditScore }) {
  const capital = (hasCapital || "").trim();
  const time = (timeline || "").trim();
  const credit = (creditScore || "").trim();

  const hasCash = capital === "Yes";
  const hasOpmPath =
    capital.includes("OPM") || capital.toLowerCase().includes("leverage");
  const weakCapital =
    capital.startsWith("No, below") || capital.toLowerCase().includes("below 700");
  const readyCapital = hasCash || hasOpmPath;

  const urgent = time === "Immediately" || time === "Within 30 days";
  const exploring = time.startsWith("3+") || time.toLowerCase().includes("exploring");
  const strongCredit = credit === "750+" || credit.startsWith("700");

  if (weakCapital && !urgent) return "nurture";
  if (exploring && !readyCapital) return "nurture";
  if (readyCapital && urgent) return "hot";
  if (hasOpmPath && strongCredit && urgent) return "hot";
  if (readyCapital || urgent) return "warm";
  if (hasOpmPath && strongCredit) return "warm";
  return "nurture";
}

export function buildLeadSummary(intake) {
  const parts = [
    intake.creditScore ? `Credit: ${intake.creditScore}` : null,
    intake.hasCapital ? `Capital: ${intake.hasCapital}` : null,
    intake.timeline ? `Timeline: ${intake.timeline}` : null,
    intake.strExperience ? `STR: ${intake.strExperience}` : null,
    intake.learningGoal ? `Goal: ${String(intake.learningGoal).slice(0, 180)}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export async function registerWithEngageFoyer({
  fullName,
  email,
  phone,
  whatsappConsent,
  smsConsent = false,
  smsMarketingConsent = false,
  source = "elite_performers",
}) {
  const { base, apiKey } = engageFoyerConfig();

  if (!base || !apiKey) {
    console.error("[engagefoyer] Missing ENGAGEFOYER_APP_URL or ENGAGEFOYER_API_KEY");
    return {
      ok: false,
      status: 503,
      error: "Workshop registration is not configured yet. Please try again later.",
    };
  }

  if (/localhost|127\.0\.0\.1/i.test(base) && process.env.VERCEL) {
    console.error("[engagefoyer] ENGAGEFOYER_APP_URL points at localhost in production:", base);
    return {
      ok: false,
      status: 503,
      error: "Workshop registration is misconfigured. Please try again later.",
    };
  }

  let res;
  try {
    res = await fetch(`${base}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        whatsappConsent,
        ...(smsConsent ? { smsConsent: true, smsConsentText: SMS_CONSENT_TEXT } : {}),
        ...(smsMarketingConsent
          ? { smsMarketingConsent: true, smsMarketingConsentText: SMS_MARKETING_CONSENT_TEXT }
          : {}),
        source,
      }),
      redirect: "manual",
    });
  } catch (err) {
    console.error("[engagefoyer] Network error calling", `${base}/api/register`, err);
    return {
      ok: false,
      status: 502,
      error: "Could not reach registration service. Please try again.",
    };
  }

  if (res.status >= 300 && res.status < 400) {
    console.error(
      "[engagefoyer] Unexpected redirect from",
      `${base}/api/register`,
      "→",
      res.headers.get("location"),
    );
    return {
      ok: false,
      status: 502,
      error: "Registration service redirected unexpectedly. Check ENGAGEFOYER_APP_URL.",
    };
  }

  const data = await res.json().catch(() => ({}));

  // 201 = new registration, 200 = already registered — both are success for Elite UX.
  if (res.status === 201 || res.status === 200) {
    return { ok: true, status: res.status, message: data.message };
  }

  console.error("[engagefoyer] Upstream register failed", {
    base,
    status: res.status,
    error: data.error || data.message,
  });

  return {
    ok: false,
    status: res.status >= 400 && res.status < 600 ? res.status : 502,
    error: data.error || data.message || "Registration failed. Please try again.",
  };
}

/**
 * Stamp leadTier onto the EngageFoyer contact (same email). Does not create a webinar seat.
 * Failures are soft — Elite still keeps the pre-intake locally.
 */
export async function enrichEngageFoyerContact({
  email,
  leadTier,
  summary,
  fullName,
  preIntakeComplete = true,
}) {
  const { base, apiKey } = engageFoyerConfig();
  if (!base || !apiKey) {
    return { ok: false, skipped: true, error: "EngageFoyer not configured" };
  }

  try {
    const res = await fetch(`${base}/api/contacts/enrich`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        leadTier,
        summary,
        fullName,
        preIntakeComplete,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: data.error || "Enrichment failed",
      };
    }
    return { ok: true, contact: data.contact, created: data.created };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Enrichment network error",
    };
  }
}
