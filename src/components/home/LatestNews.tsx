import Link from "next/link";
import NewsCard from "@/components/news/NewsCard";
import type { NewsWithCategory } from "@/types/database";

interface Props {
  news: NewsWithCategory[];
}

export default function LatestNews({ news }: Props) {
  if (!news.length) return null;

  const [featured, ...rest] = news;

  return (
    <section className="py-12">
      <div className="container-site">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Últimas Notícias</h2>
            <p className="text-gray-500 text-sm mt-1">
              Fique por dentro das novidades da Prefeitura de Feliz Deserto
            </p>
          </div>
          <Link href="/noticias" className="btn-outline hidden sm:inline-flex">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured (first news, bigger) */}
          {featured && (
            <div className="lg:col-span-2 lg:row-span-2">
              <NewsCard news={featured} variant="featured" />
            </div>
          )}

          {/* Remaining news */}
          {rest.slice(0, 2).map((item) => (
            <div key={item.id}>
              <NewsCard news={item} />
            </div>
          ))}
        </div>

        {/* More news row */}
        {rest.length > 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {rest.slice(2, 5).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link href="/noticias" className="btn-outline">
            Ver todas as notícias
          </Link>
        </div>
      </div>
    </section>
  );
}
