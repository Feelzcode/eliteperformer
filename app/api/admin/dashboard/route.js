import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function hasPreIntake(registrant) {
  return Boolean(
    registrant.creditScore ||
      registrant.hasCapital ||
      registrant.timeline ||
      registrant.strExperience ||
      registrant.learningGoal,
  );
}

function displayName(email) {
  const local = email.split("@")[0] || "guest";
  return local.replace(/[._]/g, " ").slice(0, 32);
}

export async function GET(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const [content, testimonials, registrants] = await Promise.all([
    prisma.siteContent.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.registrant.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const preIntake = registrants.filter(hasPreIntake);
  const engagefoyerUrl = process.env.ENGAGEFOYER_APP_URL?.replace(/\/$/, "") || null;
  const apiKeyConfigured = Boolean(process.env.ENGAGEFOYER_API_KEY);

  return NextResponse.json({
    stats: {
      preIntakeCount: preIntake.length,
      testimonialCount: testimonials.length,
      engagefoyerSignups: null,
    },
    contentHealth: {
      profilePhoto: Boolean(content.profilePhoto),
      video1: Boolean(content.video1Url),
      video2: Boolean(content.video2Url),
      testimonials: testimonials.length > 0,
    },
    recentPreIntake: preIntake.slice(0, 5).map((r) => ({
      id: r.id,
      email: r.email,
      name: displayName(r.email),
      createdAt: r.createdAt.toISOString(),
    })),
    engagefoyer: {
      connected: Boolean(engagefoyerUrl && apiKeyConfigured),
      dashboardUrl: engagefoyerUrl ? `${engagefoyerUrl}/dashboard/webinars` : null,
      signupCount: null,
    },
  });
}
