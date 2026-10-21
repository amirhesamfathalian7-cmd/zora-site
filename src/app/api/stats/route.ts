import { NextResponse } from "next/server";
import { readStats } from "@/lib/zora-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await readStats();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ total: 0, files: {} }, { status: 200 });
  }
}
