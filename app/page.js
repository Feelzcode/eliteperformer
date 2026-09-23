import { prisma } from "@/lib/prisma";
import HomePage from "@/components/site/HomePage";
import { fetchOpenEventSchedule } from "@/lib/open-event";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  sharedOpenGraph,
  sharedTwitter,
} from "@/lib/site-seo";

// Avoid build-time DB access on Vercel (same pattern as EngageFoyer admin routes).
export const dynamic = "force-dynamic";

export const metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: sharedOpenGraph(DEFAULT_TITLE, DEFAULT_DESCRIPTION),
  twitter: sharedTwitter(DEFAULT_TITLE, DEFAULT_DESCRIPTION),
};

const FALLBACK_CONTENT = {
  id: "main",
  profilePhoto: null,
  video1Caption: "A STRATEGY THAT WORKS",
  video1Type: "youtube",
  video1Url: null,
  video2Caption: "AND STAY CONSISTENTLY BOOKED",
  video2Type: "youtube",
  video2Url: null,
};

async function getContent() {
  try {
    const [content, testimonials] = await Promise.all([
      prisma.siteContent.upsert({ where: { id: "main" }, update: {}, create: { id: "main" } }),
      prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    return { content, testimonials };
  } catch (err) {
    // Neon free-tier can pause; network blips should not take down the public homepage.
    console.error("[homepage] database unavailable, using fallback content:", err?.message || err);
    return { content: FALLBACK_CONTENT, testimonials: [] };
  }
}

export default async function Page() {
  const [{ content, testimonials }, schedule] = await Promise.all([
    getContent(),
    fetchOpenEventSchedule(),
  ]);
  return <HomePage content={content} testimonials={testimonials} schedule={schedule} />;
}
