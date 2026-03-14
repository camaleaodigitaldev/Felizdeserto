import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { NewsWithCategory } from "@/types/database";

interface Props {
  news: NewsWithCategory[];
}

export default function LatestNews({ news }: Props) {
  if (!news.length) return null;

  return (
    <section className="py-12 bg-gray-50/60">
      <div className="container-site">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1 h-8 rounded-full bg-brand-green" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Novidades da Prefeitura</h2>
              <p className="text-gray-400 text-xs mt-0.5">Fique por dentro das últimas informações</p>
            </div>
          </div>
          <Link
            href="/noticias"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue border-2 border-brand-blue/20 px-4 py-2 rounded-xl hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-200"
          >
            Ver todas
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map((item) => (
            <Link
              key={item.id}
              href={`/noticias/${item.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                {item.cover_image_url ? (
                  <Image
                    src={item.cover_image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {item.news_categories && (
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white bg-brand-green/90 backdrop-blur-sm">
                    {item.news_categories.name}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-3 mb-3 flex-1 tracking-tight">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.published_at
                    ? format(new Date(item.published_at), "dd/MM/yyyy", { locale: ptBR })
                    : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/noticias" className="btn-outline text-sm">
            Ver todas as notícias
          </Link>
        </div>
      </div>
    </section>
  );
}
