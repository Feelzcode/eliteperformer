import { ROBOTS_DISALLOW, siteBaseUrl } from "@/lib/site-seo";

export default function robots() {
  const base = siteBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ROBOTS_DISALLOW,
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
