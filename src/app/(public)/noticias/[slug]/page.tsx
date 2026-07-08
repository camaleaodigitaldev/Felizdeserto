import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { sanitizeHtml } from "@/lib/sanitize";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Metadata } from "next";
import type { NewsWithCategory } from "@/types/database";
import { SITE } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("title, summary, cover_image_url, meta_title, meta_description, og_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Notícia não encontrada" };

  return {
    title: data.meta_title ?? data.title,
    description: data.meta_description ?? data.summary ?? undefined,
    openGraph: {
      title: data.meta_title ?? data.title,
      description: data.meta_description ?? data.summary ?? undefined,
      images: data.og_image_url ?? data.cover_image_url
        ? [{ url: (data.og_image_url ?? data.cover_image_url)! }]
        : [],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("news")
    .select("*, news_categories(*), profiles(full_name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) notFound();

  const news = data as unknown as NewsWithCategory;
  const date = news.published_at
    ? format(new Date(news.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "";

  // Increment views (fire and forget)
  supabase
    .from("news")
    .update({ views: (news.views ?? 0) + 1 })
    .eq("id", news.id)
    .then(() => {});

  // Related news
  const { data: related } = await supabase
    .from("news")
    .select("id, title, slug, cover_image_url, published_at, news_categories(*)")
    .eq("status", "published")
    .eq("category_id", news.category_id ?? 0)
    .neq("id", news.id)
    .order("published_at", { ascending: false })
    .limit(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    description: news.summary,
    image: news.cover_image_url ? [news.cover_image_url] : [],
    datePublished: news.published_at,
    dateModified: news.updated_at,
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/noticias/${news.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        crumbs={[
          { label: "Notícias", href: "/noticias" },
          { label: news.title },
        ]}
      />

      <article className="container-site py-8 max-w-4xl">
        {/* Category */}
        {news.news_categories && (
          <Link
            href={`/noticias?categoria=${news.news_categories.slug}`}
            className="inline-block text-xs font-semibold text-white px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: news.news_categories.color }}
          >
            {news.news_categories.name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {news.title}
        </h1>

        {news.summary && (
          <p className="text-xl text-gray-500 leading-relaxed mb-6">{news.summary}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b">
          {date && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {date}
            </span>
          )}
          {news.profiles?.full_name && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {news.profiles.full_name}
            </span>
          )}
        </div>

        {/* Cover image */}
        {news.cover_image_url && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={news.cover_image_url}
              alt={news.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        )}

        {/* Body */}
        <div
          className="prose prose-gray max-w-none prose-headings:text-brand-blue prose-a:text-brand-blue prose-img:rounded-xl news-body"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(news.body) }}
        />

        {/* Share */}
        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Compartilhar:</span>
          <div className="flex gap-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${SITE.url}/noticias/${news.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Compartilhar no Facebook"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${news.title} — ${SITE.url}/noticias/${news.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Compartilhar no WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </div>
      </article>

      {/* Related news */}
      {related && related.length > 0 && (
        <section className="bg-gray-50 py-10 mt-8">
          <div className="container-site max-w-4xl">
            <h2 className="text-xl font-bold text-brand-blue mb-6">Notícias relacionadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(related as unknown as NewsWithCategory[]).map((item) => (
                <Link
                  key={item.id}
                  href={`/noticias/${item.slug}`}
                  className="card group p-4 flex gap-3"
                >
                  {item.cover_image_url && (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.cover_image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-700 group-hover:text-brand-blue line-clamp-3 transition-colors">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
