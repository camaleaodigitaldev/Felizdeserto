import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hora

export async function GET() {
  const supabase = createAdminClient();

  // Check cache age
  const { data: cached } = await supabase
    .from("instagram_cache")
    .select("cached_at")
    .order("cached_at", { ascending: false })
    .limit(1)
    .single();

  const cacheAge = cached
    ? Date.now() - new Date(cached.cached_at).getTime()
    : Infinity;

  if (cacheAge < CACHE_DURATION_MS) {
    // Return from cache
    const { data: posts } = await supabase
      .from("instagram_cache")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(9);

    return NextResponse.json(posts ?? [], {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" },
    });
  }

  // Fetch from Instagram API
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink,media_type,timestamp&limit=9&access_token=${token}`
    );

    if (!res.ok) {
      throw new Error(`Instagram API error: ${res.status}`);
    }

    const json = await res.json();
    const posts = json.data ?? [];

    if (posts.length > 0) {
      const now = new Date().toISOString();
      const rows = posts.map((p: {
        id: string;
        caption?: string;
        media_url: string;
        permalink: string;
        media_type: string;
        timestamp: string;
      }) => ({
        post_id: p.id,
        caption: p.caption ?? null,
        media_url: p.media_url,
        permalink: p.permalink,
        media_type: p.media_type,
        timestamp: p.timestamp,
        cached_at: now,
      }));

      await supabase
        .from("instagram_cache")
        .upsert(rows, { onConflict: "post_id" });
    }

    return NextResponse.json(posts, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate" },
    });
  } catch (err) {
    console.error("[instagram] fetch error:", err);
    // Return stale cache if available
    const { data: stalePosts } = await supabase
      .from("instagram_cache")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(9);

    return NextResponse.json(stalePosts ?? []);
  }
}
