/**
 * Fetch EngageFoyer open-event schedule for CTA copy.
 * Server-only — uses ENGAGEFOYER_APP_URL + ENGAGEFOYER_API_KEY.
 */

const FALLBACK = {
  mode: "waitlist",
  eyebrow: "Next Live Workshop",
  labelLong: "Save your free seat",
  labelShort: "Live workshop",
  event: null,
};

export async function fetchOpenEventSchedule() {
  const base = process.env.ENGAGEFOYER_APP_URL?.replace(/\/$/, "");
  const apiKey = process.env.ENGAGEFOYER_API_KEY;
  if (!base || !apiKey) {
    console.warn("[open-event] ENGAGEFOYER_APP_URL or ENGAGEFOYER_API_KEY missing");
    return FALLBACK;
  }

  try {
    const res = await fetch(`${base}/api/open-event`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[open-event] upstream failed", res.status, data.error || data);
      return FALLBACK;
    }

    if (data.mode === "register" && data.event) {
      return {
        mode: "register",
        eyebrow: `Next Live Workshop · ${data.event.labelShort}`,
        labelLong: data.event.labelLong,
        labelShort: data.event.labelShort,
        event: data.event,
      };
    }

    if (data.mode === "ambiguous") {
      return {
        mode: "ambiguous",
        eyebrow: "Next Live Workshop",
        labelLong: "Registration opening soon",
        labelShort: "Opening soon",
        event: null,
      };
    }

    return {
      mode: "waitlist",
      eyebrow: "Next Live Workshop · Join the waitlist",
      labelLong: "Get on the waitlist",
      labelShort: "Join waitlist",
      event: null,
    };
  } catch (err) {
    console.error("[open-event] network error", err?.message || err);
    return FALLBACK;
  }
}
