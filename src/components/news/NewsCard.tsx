import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { NewsWithCategory } from "@/types/database";

interface Props {
  news: NewsWithCategory;
  variant?: "default" | "compact" | "featured";
}

export default function NewsCard({ news, variant = "default" }: Props) {
  const date = news.published_at
    ? format(new Date(news.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "";

  if (variant === "compact") {
    return (
      <Link
        href={`/noticias/${news.slug}`}
        className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
      >
        {news.cover_image_url && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={news.cover_image_url}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="64px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-brand-blue transition-colors">
            {news.title}
          </p>
          {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/noticias/${news.slug}`}
        className="card group relative h-full block"
      >
        <div className="relative h-64 sm:h-72">
          {news.cover_image_url ? (
            <Image
              src={news.cover_image_url}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center">
              <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {news.news_categories && (
            <span
              className="absolute top-3 left-3 text-xs font-semibold text-white px-2.5 py-1 rounded-full"
              style={{ backgroundColor: news.news_categories.color }}
            >
              {news.news_categories.name}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg leading-snug line-clamp-2 mb-1">
            {news.title}
          </h3>
          {date && <p className="text-white/70 text-xs">{date}</p>}
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/noticias/${news.slug}`} className="card group block">
      <div className="relative h-48 overflow-hidden">
        {news.cover_image_url ? (
          <Image
            src={news.cover_image_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center">
            <svg className="w-12 h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        {news.news_categories && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold text-white px-2.5 py-1 rounded-full"
            style={{ backgroundColor: news.news_categories.color }}
          >
            {news.news_categories.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-brand-blue transition-colors mb-2">
          {news.title}
        </h3>
        {news.summary && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{news.summary}</p>
        )}
        <div className="flex items-center justify-between">
          {date && <span className="text-xs text-gray-400">{date}</span>}
          <span className="text-xs font-medium text-brand-blue group-hover:underline ml-auto">
            Leia mais →
          </span>
        </div>
      </div>
    </Link>
  );
}
