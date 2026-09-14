/**
 * Server-side proxy to EngageFoyer's registration + contact enrichment APIs.
 * Elite owns the landing UX; EngageFoyer owns webinar CRM, email, and Zoom sync.
 */

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
  source = "elite_performers",
}) {
  const { base, apiKey } = engageFoyerConfig();

  if (!base || !apiKey) {
    return {
      ok: false,
      status: 503,
      error: "Workshop registration is not configured yet. Please try again later.",
    };
  }

  const res = await fetch(`${base}/api/register`, {
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
      smsConsent: whatsappConsent,
      source,
    }),
  });

  const data = await res.json().catch(() => ({}));

  // 201 = new registration, 200 = already registered — both are success for Elite UX.
  if (res.status === 201 || res.status === 200) {
    return { ok: true, status: res.status, message: data.message };
  }

  return {
    ok: false,
    status: res.status,
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
