import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

/**
 * Thank-you page pre-intake — Elite only. Does not re-register on EngageFoyer.
 */
export async function POST(request) {
  const body = await request.json();
  const { email, creditScore, hasCapital, timeline, strExperience, learningGoal } = body;

  if (!email?.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);
  const intake = {
    creditScore: creditScore || null,
    hasCapital: hasCapital || null,
    timeline: timeline || null,
    strExperience: strExperience || null,
    learningGoal: learningGoal || null,
  };

  const existing = await prisma.registrant.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: "desc" },
  });

  const registrant = existing
    ? await prisma.registrant.update({
        where: { id: existing.id },
        data: intake,
      })
    : await prisma.registrant.create({
        data: { email: normalizedEmail, ...intake },
      });

  return NextResponse.json({ ok: true, id: registrant.id });
}
