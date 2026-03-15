import { createClient } from "@/lib/supabase/server";
import NewsCard from "@/components/news/NewsCard";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { NewsWithCategory, NewsCategory } from "@/types/database";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Notícias",
  description: "Últimas notícias e informações da Prefeitura Municipal de Feliz Deserto/AL.",
};

interface Props {
  searchParams: Promise<{ categoria?: string; pagina?: string }>;
}

export default async function NoticiasPage({ searchParams }: Props) {
  const params = await searchParams;
  const categoria = params.categoria;
  const page = Number(params.pagina ?? 1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const supabase = await createClient();

  // Busca categorias primeiro para resolver o id pelo slug
  const { data: categoriesRaw } = await supabase
    .from("news_categories")
    .select("*")
    .order("name");

  const categories = (categoriesRaw ?? []) as unknown as NewsCategory[];

  const selectedCategory = categoria
    ? categories.find((c) => c.slug === categoria)
    : null;

  let newsQuery = supabase
    .from("news")
    .select("*, news_categories(*), profiles(full_name)", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  if (selectedCategory) {
    newsQuery = newsQuery.eq("category_id", selectedCategory.id);
  }

  const { data: newsData, count } = await newsQuery;

  const news = (newsData ?? []) as unknown as NewsWithCategory[];
  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Notícias" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Notícias</h1>
          <p className="text-blue-200 mt-1">
            Últimas informações da Prefeitura de Feliz Deserto
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        {/* Category filter */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/noticias"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !categoria
                  ? "bg-brand-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todas
            </Link>
            {(categories as NewsCategory[]).map((cat) => (
              <Link
                key={cat.id}
                href={`/noticias?categoria=${cat.slug}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  categoria === cat.slug
                    ? "text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={categoria === cat.slug ? { backgroundColor: cat.color } : {}}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {news.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nenhuma notícia encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/noticias?${categoria ? `categoria=${categoria}&` : ""}pagina=${page - 1}`}
                className="btn-outline px-4 py-2 text-sm"
              >
                ← Anterior
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/noticias?${categoria ? `categoria=${categoria}&` : ""}pagina=${p}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-brand-blue text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/noticias?${categoria ? `categoria=${categoria}&` : ""}pagina=${page + 1}`}
                className="btn-outline px-4 py-2 text-sm"
              >
                Próxima →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
