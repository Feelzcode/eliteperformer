import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET is public — the landing page fetches this at request time (or build
// time with revalidation) to render the profile photo, homepage videos, and
// testimonials.
export async function GET() {
  const [content, testimonials] = await Promise.all([
    prisma.siteContent.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return NextResponse.json({ content, testimonials });
}

// PUT is admin-only — the admin panel calls this to persist edits.
export async function PUT(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const { content, testimonials } = body;

  const updated = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: content,
    create: { id: "main", ...content },
  });

  // Replace the whole testimonial set in one transaction — simplest
  // approach for a small, admin-curated list like this (max a handful of
  // rows), avoids diffing add/edit/remove separately.
  await prisma.$transaction([
    prisma.testimonial.deleteMany({}),
    ...testimonials.map((t, i) =>
      prisma.testimonial.create({
        data: { name: t.name, type: t.type, mediaUrl: t.mediaUrl, sortOrder: i },
      })
    ),
  ]);

  return NextResponse.json({ ok: true, content: updated });
}
