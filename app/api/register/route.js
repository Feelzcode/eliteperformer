import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerWithEngageFoyer } from "@/lib/engagefoyer";

export const dynamic = "force-dynamic";

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

/**
 * Homepage workshop signup → EngageFoyer (confirmation, Zoom, reminders).
 * Elite only stores a minimal row so the thank-you pre-intake can match by email.
 */
export async function POST(request) {
  const body = await request.json();
  const { fullName, email, phone, whatsappConsent } = body;

  if (!fullName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Full name and email are required" }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);

  const ef = await registerWithEngageFoyer({
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone?.trim() || undefined,
    whatsappConsent: Boolean(whatsappConsent),
  });

  if (!ef.ok) {
    return NextResponse.json({ error: ef.error }, { status: ef.status || 502 });
  }

  // Link pre-intake on thank-you page to this signup (Elite-only data).
  const existing = await prisma.registrant.findFirst({
    where: { email: normalizedEmail },
    orderBy: { createdAt: "desc" },
  });

  if (!existing) {
    await prisma.registrant.create({ data: { email: normalizedEmail } });
  }

  return NextResponse.json({ ok: true, message: ef.message });
}
