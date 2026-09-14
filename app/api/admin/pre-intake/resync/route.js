import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  buildLeadSummary,
  enrichEngageFoyerContact,
  scorePreIntakeLead,
} from "@/lib/engagefoyer";

export const dynamic = "force-dynamic";

/**
 * Manual retry: push an existing Elite pre-intake lead tier to EngageFoyer Contacts.
 * Body: { id: string } — Registrant id from Elite admin.
 */
export async function POST(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ error: "Registrant id is required" }, { status: 400 });
  }

  const registrant = await prisma.registrant.findUnique({ where: { id } });
  if (!registrant) {
    return NextResponse.json({ error: "Pre-intake record not found" }, { status: 404 });
  }

  const intake = {
    creditScore: registrant.creditScore,
    hasCapital: registrant.hasCapital,
    timeline: registrant.timeline,
    strExperience: registrant.strExperience,
    learningGoal: registrant.learningGoal,
  };

  const hasAnswers = Boolean(
    intake.creditScore ||
      intake.hasCapital ||
      intake.timeline ||
      intake.strExperience ||
      intake.learningGoal,
  );
  if (!hasAnswers) {
    return NextResponse.json(
      { error: "This registrant has no pre-intake answers to sync" },
      { status: 400 },
    );
  }

  const leadTier = scorePreIntakeLead(intake);
  const summary = buildLeadSummary(intake);
  const sync = await enrichEngageFoyerContact({
    email: registrant.email,
    leadTier,
    summary,
    preIntakeComplete: true,
  });

  if (sync.skipped) {
    return NextResponse.json(
      { error: "EngageFoyer is not configured (ENGAGEFOYER_APP_URL / ENGAGEFOYER_API_KEY)" },
      { status: 503 },
    );
  }

  if (!sync.ok) {
    return NextResponse.json(
      { error: sync.error || "EngageFoyer sync failed", status: sync.status || 502 },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    leadTier,
    email: registrant.email,
    created: Boolean(sync.created),
    contact: sync.contact || null,
  });
}
