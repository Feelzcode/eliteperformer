import { NextResponse } from "next/server";
import { getUploadSignature } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

// Only signs the request — the actual file bytes go straight from the
// browser to Cloudinary, never through our server. Keeps uploads fast and
// keeps large files off our own bandwidth/memory.
export async function POST(request) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const { folder } = await request.json().catch(() => ({}));
  const signature = getUploadSignature({ folder });
  return NextResponse.json(signature);
}
