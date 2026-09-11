import { SITEMAP_PATHS, siteBaseUrl } from "@/lib/site-seo";

export default function sitemap() {
  const base = siteBaseUrl();
  const now = new Date();

  return SITEMAP_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${base}${path}` : base,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
