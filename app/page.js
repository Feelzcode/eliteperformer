import { prisma } from "@/lib/prisma";
import HomePage from "@/components/site/HomePage";

export const revalidate = 60;

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
