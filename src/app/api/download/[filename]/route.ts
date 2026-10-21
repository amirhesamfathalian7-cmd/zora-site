import { NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { Readable } from "stream";
import { bumpStats, findDownloadFile } from "@/lib/zora-server";

export const dynamic = "force-dynamic";

/**
 * Streams a ZORA installer to the user.
 * Files are whitelisted in RELEASE.files and looked up in
 * /home/z/my-project/download/. If the file has not been placed on
 * the server yet, a friendly 404 JSON is returned and the site UI
 * shows the file as "coming soon".
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ filename: string }> }
) {
  const { filename } = await ctx.params;
  const found = findDownloadFile(filename);

  if (!found) {
    return NextResponse.json(
      {
        available: false,
        error:
          "این فایل هنوز روی سرور قرار نگرفته است. لطفاً کمی صبر کنید یا با تیم zora در تماس باشید.",
      },
      { status: 404 }
    );
  }

  // fire-and-forget counter
  void bumpStats(filename);

  const stream = Readable.toWeb(createReadStream(found.abs)) as ReadableStream<Uint8Array>;
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(statSync(found.abs).size),
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
