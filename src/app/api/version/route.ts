import { NextResponse } from "next/server";
import { getReleaseInfo } from "@/lib/zora-server";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * The official update channel.
 * The ZORA desktop app polls this endpoint (CORS enabled) to detect
 * new releases; the site's download center uses the same data.
 */
export async function GET() {
  try {
    const info = await getReleaseInfo();
    return NextResponse.json(info, {
      headers: { ...CORS, "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "release info unavailable" },
      { status: 500, headers: CORS }
    );
  }
}
