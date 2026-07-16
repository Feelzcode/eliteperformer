import { prisma } from "@/lib/prisma";
import HomePage from "@/components/site/HomePage";

// Avoid build-time DB access on Vercel (same pattern as EngageFoyer admin routes).
export const dynamic = "force-dynamic";

async function getContent() {
  const [content, testimonials] = await Promise.all([
    prisma.siteContent.upsert({ where: { id: "main" }, update: {}, create: { id: "main" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return { content, testimonials };
}

export default async function Page() {
  const { content, testimonials } = await getContent();
  return <HomePage content={content} testimonials={testimonials} />;
}
