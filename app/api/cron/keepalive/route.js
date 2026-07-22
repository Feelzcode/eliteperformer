import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Lightweight DB ping so Neon compute does not suspend.
 * Hit by Vercel Cron (vercel.json) and/or an external scheduler
 * (e.g. cron-job.org every 5 minutes on the free plan).
 *
 * Auth: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[keepalive] database ping failed:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: "Database unreachable" },
      { status: 503 },
    );
  }
}
