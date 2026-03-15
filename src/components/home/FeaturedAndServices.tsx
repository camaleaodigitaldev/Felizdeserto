"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SITE } from "@/lib/constants";
import type { NewsWithCategory } from "@/types/database";

const services = [
  {
    href: "/noticias",
    label: "Notícias",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    ),
  },
  {
    href: "/editais",
    label: "Editais e\nLicitações",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
  {
    href: SITE.transparencyUrl,
    label: "Portal da\nTransparência",
    external: true,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    href: "/documentos",
    label: "Documentos\nOficiais",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </>
    ),
  },
  {
    href: "/fale-conosco",
    label: "Fale\nConosco",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    href: "/telefones-uteis",
    label: "Telefones\nÚteis",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
  },
  {
    href: "/governo/secretarias",
    label: "Secretarias\nMunicipais",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    ),
  },
  {
    href: "/videos",
    label: "Galeria de\nVídeos",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
  },
  {
    href: "/governo/prefeito",
    label: "Gabinete do\nPrefeito",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    href: "/municipio/historia",
    label: "Nossa\nHistória",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    ),
  },
  {
    href: "/municipio/cultura",
    label: "Cultura e\nTradições",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    ),
  },
  {
    href: "/municipio/simbolos",
    label: "Símbolos\nMunicipais",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    ),
  },
];

interface Props {
  featured: NewsWithCategory | null;
}

export default function FeaturedAndServices({ featured }: Props) {
  return (
    <section className="py-10 bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[56%_44%] gap-8">

          {/* Featured news - left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 rounded-full bg-brand-green" />
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Destaque</h2>
            </div>
            {featured ? (
              <Link href={`/noticias/${featured.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                {featured.cover_image_url && (
                  <div className="relative h-56 sm:h-72 w-full overflow-hidden">
                    <Image
                      src={featured.cover_image_url}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {featured.news_categories && (
                      <span className="absolute top-3 left-3 bg-brand-green/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {featured.news_categories.name}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-blue transition-colors leading-snug mb-2 tracking-tight">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{featured.excerpt}</p>
                  )}
                  <span className="text-xs text-gray-400">
                    {featured.published_at
                      ? format(new Date(featured.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      : ""}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
                Nenhuma notícia publicada ainda.
              </div>
            )}
          </div>

          {/* Services grid - right */}
          <div>
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">Acesso Rápido aos Serviços</h2>
              </div>
              <p className="text-sm text-gray-400 ml-7">Clique nos ícones abaixo e tenha acesso rápido</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {services.map((svc) => {
                const Tag = svc.external ? "a" : Link;
                const extraProps = svc.external
                  ? { href: svc.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: svc.href };
                return (
                  <Tag
                    key={svc.href}
                    {...(extraProps as object)}
                    className="flex flex-col items-center text-center py-4 px-2 bg-gray-100 rounded-xl hover:bg-gray-200 hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <svg
                      className="w-9 h-9 text-green-600 mb-2.5 group-hover:scale-110 transition-transform duration-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {svc.icon}
                    </svg>
                    <span className="text-xs font-medium text-gray-600 leading-tight whitespace-pre-line">
                      {svc.label}
                    </span>
                  </Tag>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
