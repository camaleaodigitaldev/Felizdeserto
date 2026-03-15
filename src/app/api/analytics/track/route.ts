import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Padrões de bots para ignorar
const BOT_PATTERN =
  /bot|crawler|spider|slurp|facebookexternalhit|twitterbot|whatsapp|telegram|linkedinbot|googlebot|bingbot|yandex|baidu/i;

function parseDevice(ua: string): string {
  if (/mobile/i.test(ua) && !/tablet|ipad/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

function parseBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/chrome\/(?!.*chromium)/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari\/(?!.*chrome)/i.test(ua)) return "Safari";
  return "Outro";
}

function parseOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Outro";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer } = body as { path?: string; referrer?: string };

    if (!path || typeof path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ua = request.headers.get("user-agent") ?? "";

    // Ignorar bots
    if (BOT_PATTERN.test(ua)) {
      return NextResponse.json({ ok: true });
    }

    // Obter IP real
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    // Geolocalização via ip-api.com (grátis, sem chave)
    let country: string | null = null;
    let countryCode: string | null = null;
    let city: string | null = null;
    let lat: number | null = null;
    let lng: number | null = null;

    if (ip && ip !== "127.0.0.1" && ip !== "::1" && !ip.startsWith("192.168") && !ip.startsWith("10.")) {
      try {
        const geo = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,lat,lon`,
          { signal: AbortSignal.timeout(2500) }
        );
        if (geo.ok) {
          const d = await geo.json();
          if (d.status === "success") {
            country = d.country ?? null;
            countryCode = d.countryCode ?? null;
            city = d.city ?? null;
            lat = d.lat ?? null;
            lng = d.lon ?? null;
          }
        }
      } catch {
        // geolocalização falhou — continua sem ela
      }
    }

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("analytics_pageviews").insert({
      path,
      referrer: referrer || null,
      country,
      country_code: countryCode,
      city,
      lat,
      lng,
      device: parseDevice(ua),
      browser: parseBrowser(ua),
      os: parseOS(ua),
    });

    if (error) {
      console.error("[analytics/track] insert error:", error.message, error.code);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
