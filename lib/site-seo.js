/**
 * Shared SEO helpers for Elite Performers Circle.
 * Prefer NEXT_PUBLIC_SITE_URL (or APP_URL) in production.
 */

export const SITE_NAME = "Elite Performers Circle";

export const DEFAULT_TITLE =
  "Elite Performers Circle — Free Airbnb Rental Arbitrage Workshop";

export const DEFAULT_DESCRIPTION =
  "Learn how to build a $10K–$20K/month Airbnb business without owning property or using your own money. Free live workshop on rental arbitrage.";

export const DEFAULT_OG_IMAGE_ALT =
  "Elite Performers Circle — Free live Airbnb rental arbitrage workshop";

/** Public pages for sitemap.xml (admin / thank-you / API excluded). */
export const SITEMAP_PATHS = [
  { path: "", priority: 1, changeFrequency: "weekly" },
];

export const ROBOTS_DISALLOW = ["/admin/", "/api/", "/thank-you"];

export function siteBaseUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    process.env.APP_URL?.replace(/\/$/, "") ||
    "";
  return fromEnv || "https://eliteperformerscircle.com";
}

export function absoluteOgImageUrl() {
  // Prefer the generated Next.js OG route (1200×630).
  return `${siteBaseUrl()}/opengraph-image`;
}

export function sharedOpenGraph(title, description, path = "") {
  const base = siteBaseUrl();
  return {
    title,
    description,
    url: path ? `${base}${path}` : base,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: absoluteOgImageUrl(),
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  };
}

export function sharedTwitter(title, description) {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteOgImageUrl()],
  };
}
