import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const body = await request.json();
  const { email, creditScore, hasCapital, timeline, strExperience, learningGoal } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const registrant = await prisma.registrant.create({
    data: { email, creditScore, hasCapital, timeline, strExperience, learningGoal },
  });

  // Fire-and-forget the branded welcome email — don't block the response on
  // it, and don't fail the whole request if email delivery hiccups.
  // (The native Zoom confirmation/reminder emails are separate — see the
  // Zoom registration call this would sit next to in a real integration.)
  resend.emails
    .send({
      from: "Ekene <hello@yourdomain.com>",
      to: email,
      subject: "You're In! 🎉 Here's what's next",
      html: `<p>Congrats — you just made the best decision of your life 💪</p>
             <p>Your seat for the free live workshop is confirmed. Check your inbox for the Zoom link.</p>`,
    })
    .catch((err) => console.error("Resend send failed:", err));

  return NextResponse.json({ ok: true, id: registrant.id });
}
