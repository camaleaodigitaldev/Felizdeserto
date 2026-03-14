import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { path, tag } = body as { path?: string; tag?: string };

    if (tag) {
      revalidateTag(tag);
    }
    if (path) {
      revalidatePath(path);
    }
    if (!tag && !path) {
      revalidatePath("/");
      revalidatePath("/noticias");
      revalidatePath("/editais");
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
