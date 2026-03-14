import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: news }, { data: secretarias }, { data: editais }] = await Promise.all([
    supabase
      .from("news")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false }),
    supabase.from("secretarias").select("slug, updated_at").eq("is_active", true),
    supabase.from("editais").select("id, updated_at").order("created_at", { ascending: false }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/noticias`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/governo/prefeito`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/governo/vice-prefeito`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/governo/secretarias`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/municipio/historia`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE.url}/municipio/cultura`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE.url}/municipio/simbolos`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE.url}/transparencia`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/editais`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/videos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE.url}/telefones-uteis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/fale-conosco`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  const newsPages: MetadataRoute.Sitemap = (news ?? []).map((item) => ({
    url: `${SITE.url}/noticias/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const secretariaPages: MetadataRoute.Sitemap = (secretarias ?? []).map((item) => ({
    url: `${SITE.url}/governo/secretarias/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages, ...secretariaPages];
}
