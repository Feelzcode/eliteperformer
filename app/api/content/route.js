import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_FAQ_VIDEOS = 12;

function cleanFaqVideos(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((v) => ({
      id: String(v?.id ?? ""),
      caption: String(v?.caption ?? "").trim(),
      type: v?.type === "upload" ? "upload" : "youtube",
      url: String(v?.url ?? "").trim(),
    }))
    .filter((v) => v.url)
    .slice(0, MAX_FAQ_VIDEOS);
}

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

  const siteFields = {
    profilePhoto: content?.profilePhoto ?? null,
    video1Caption: content?.video1Caption,
    video1Type: content?.video1Type,
    video1Url: content?.video1Url ?? null,
    video2Caption: content?.video2Caption,
    video2Type: content?.video2Type,
    video2Url: content?.video2Url ?? null,
    thankYouVideoCaption: content?.thankYouVideoCaption,
    thankYouVideoType: content?.thankYouVideoType,
    thankYouVideoUrl: content?.thankYouVideoUrl ?? null,
    thankYouFaqVideos: cleanFaqVideos(content?.thankYouFaqVideos),
  };

  const updated = await prisma.siteContent.upsert({
    where: { id: "main" },
    update: siteFields,
    create: { id: "main", ...siteFields },
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
