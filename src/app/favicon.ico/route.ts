import { SITE } from "@/lib/constants";

// Serve o favicon pelo próprio domínio do site (mesma origem),
// fazendo proxy da imagem do brasão hospedada no storage. Isso evita
// o problema de navegadores ignorarem favicons de domínio externo.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upstream = await fetch(SITE.brasaoUrl);
    if (!upstream.ok) {
      return new Response("Not found", { status: 404 });
    }
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
