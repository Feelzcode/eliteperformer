import { prisma } from "@/lib/prisma";
import HomePage from "@/components/site/HomePage";

// Avoid build-time DB access on Vercel (same pattern as EngageFoyer admin routes).
export const dynamic = "force-dynamic";

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
  const { content, testimonials } = await getContent();
  return <HomePage content={content} testimonials={testimonials} />;
}
