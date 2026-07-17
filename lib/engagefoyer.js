/**
 * Server-side proxy to EngageFoyer's registration API (API key → active webinar).
 * Elite owns the landing UX; EngageFoyer owns webinar CRM, email, and Zoom sync.
 */
export async function registerWithEngageFoyer({
  fullName,
  email,
  phone,
  whatsappConsent,
  source = "elite_performers",
}) {
  const base = process.env.ENGAGEFOYER_APP_URL?.replace(/\/$/, "");
  const apiKey = process.env.ENGAGEFOYER_API_KEY;

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
