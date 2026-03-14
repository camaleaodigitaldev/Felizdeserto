import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Metadata } from "next";
import type { NewsWithCategory, NewsCategory } from "@/types/database";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("secretarias")
    .select("name, secretary_name, mission")
    .eq("slug", slug)
    .single();
  if (!data) return { title: "Secretaria não encontrada" };
  return {
    title: data.name,
    description:
      data.mission ??
      `${data.name} — Secretário(a): ${data.secretary_name}. Prefeitura Municipal de Feliz Deserto/AL.`,
  };
}

export default async function SecretariaDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: sec } = await supabase
    .from("secretarias")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!sec) notFound();

  const accent = sec.accent_color ?? "#1a3a6b";

  // Fetch linked news category
  let newsCategory: NewsCategory | null = null;
  if (sec.news_category_id) {
    const { data } = await supabase
      .from("news_categories")
      .select("*")
      .eq("id", sec.news_category_id)
      .single();
    newsCategory = data;
  }

  // Fetch news from linked category
  let news: NewsWithCategory[] = [];
  if (sec.news_category_id) {
    const { data: newsData } = await supabase
      .from("news")
      .select("*, news_categories(id, name, slug, color), profiles(full_name)")
      .eq("category_id", sec.news_category_id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6);
    if (newsData) news = newsData as NewsWithCategory[];
  }

  const hasContent = !!sec.description || news.length > 0;

  return (
    <>
      {/* ── Hero ── */}
      <div className="relative min-h-[300px] sm:min-h-[360px] flex flex-col justify-end overflow-hidden">
        {/* Background: cover image or solid accent */}
        {sec.cover_image_url ? (
          <Image
            src={sec.cover_image_url}
            alt={sec.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: accent }} />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${accent}ee 0%, ${accent}99 50%, ${accent}55 100%)`,
          }}
        />

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 z-10 pt-4">
          <div className="container-site">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-white/60">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Início</Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>/</span>
                  <Link href="/governo/secretarias" className="hover:text-white transition-colors">Secretarias</Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>/</span>
                  <span className="text-white/90 font-medium">{sec.short_name ?? sec.name}</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 container-site pb-10 pt-16">
          <div className="flex items-end gap-5">
            {/* Logo */}
            {sec.logo_url && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-sm overflow-hidden flex-shrink-0 border-2 border-white/30 shadow-lg">
                <Image
                  src={sec.logo_url}
                  alt="Logo"
                  width={96}
                  height={96}
                  className="object-contain w-full h-full p-1"
                />
              </div>
            )}

            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">
                Prefeitura de Feliz Deserto/AL
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                {sec.name}
              </h1>
              {sec.mission && (
                <p className="text-white/75 mt-2 text-base max-w-2xl leading-relaxed">
                  {sec.mission}
                </p>
              )}

              {/* Tags/pills */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {sec.secretary_name && (
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {sec.secretary_name}
                  </span>
                )}
                {newsCategory && (
                  <span
                    className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"
                    style={{ backgroundColor: `${newsCategory.color}99` }}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    {news.length} notícia{news.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bg-gray-50/60 min-h-screen">
        <div className="container-site py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-1 space-y-4">

              {/* Secretary card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                {sec.secretary_photo_url ? (
                  <div
                    className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 ring-4 ring-offset-2"
                    style={{ ["--tw-ring-color" as string]: `${accent}40` }}
                  >
                    <Image
                      src={sec.secretary_photo_url}
                      alt={sec.secretary_name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-3 shadow-inner"
                    style={{ backgroundColor: accent }}
                  >
                    <span className="text-white font-bold text-3xl">
                      {sec.secretary_name.charAt(0)}
                    </span>
                  </div>
                )}
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: accent }}
                >
                  Secretário(a)
                </p>
                <p className="font-bold text-gray-900 text-sm leading-snug">{sec.secretary_name}</p>
                {sec.secretary_bio && (
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed text-left">
                    {sec.secretary_bio}
                  </p>
                )}
              </div>

              {/* Contact card — hidden on mobile (shown in main content below) */}
              {(sec.phone || sec.email || sec.address || sec.hours) && (
                <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <h3 className="font-semibold text-gray-800 text-sm">Contato</h3>
                  {sec.phone && (
                    <a
                      href={`tel:${sec.phone.replace(/\D/g, "")}`}
                      className="text-sm text-gray-600 flex items-center gap-2.5 hover:text-gray-900 transition-colors group"
                    >
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-3.5 h-3.5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      {sec.phone}
                    </a>
                  )}
                  {sec.email && (
                    <a
                      href={`mailto:${sec.email}`}
                      className="text-sm text-gray-600 flex items-center gap-2.5 hover:text-gray-900 transition-colors"
                    >
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-3.5 h-3.5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="truncate">{sec.email}</span>
                    </a>
                  )}
                  {sec.hours && (
                    <div className="text-sm text-gray-600 flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-3.5 h-3.5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      {sec.hours}
                    </div>
                  )}
                  {sec.address && (
                    <div className="text-sm text-gray-600 flex items-start gap-2.5">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-3.5 h-3.5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      {sec.address}
                    </div>
                  )}
                </div>
              )}

              {/* Page index */}
              {hasContent && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">Nesta página</h3>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1.5 lg:flex-col lg:gap-x-0 lg:space-y-2">
                    {sec.description && (
                      <li>
                        <a
                          href="#sobre"
                          className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: accent }}
                          />
                          Sobre a Secretaria
                        </a>
                      </li>
                    )}
                    {news.length > 0 && (
                      <li>
                        <a
                          href="#noticias"
                          className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: accent }}
                          />
                          Notícias
                        </a>
                      </li>
                    )}
                    <li>
                      <a
                        href="#contato"
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: accent }}
                        />
                        Contato
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </aside>

            {/* ── Main content ── */}
            <main className="lg:col-span-3 space-y-8">

              {/* About section */}
              {sec.description && (
                <section
                  id="sobre"
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-1 h-6 rounded-full" style={{ backgroundColor: accent }} />
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Sobre a Secretaria</h2>
                  </div>
                  <div
                    className="prose prose-gray max-w-none prose-headings:text-brand-blue prose-a:text-brand-blue prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: sec.description }}
                  />
                </section>
              )}

              {/* News section */}
              {news.length > 0 && (
                <section id="noticias" className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="w-1 h-6 rounded-full" style={{ backgroundColor: accent }} />
                      <h2 className="text-lg font-bold text-gray-900 tracking-tight">Notícias da Secretaria</h2>
                    </div>
                    {newsCategory && (
                      <Link
                        href={`/noticias?categoria=${newsCategory.slug}`}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
                      >
                        Ver todas
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {news.map((item) => (
                      <Link
                        key={item.id}
                        href={`/noticias/${item.slug}`}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                      >
                        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                          {item.cover_image_url ? (
                            <Image
                              src={item.cover_image_url}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ backgroundColor: `${accent}15` }}
                            >
                              <svg className="w-10 h-10 opacity-30" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-3 mb-2 tracking-tight flex-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-auto">
                            {item.published_at
                              ? format(new Date(item.published_at), "dd 'de' MMM 'de' yyyy", { locale: ptBR })
                              : ""}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact section */}
              <section
                id="contato"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1 h-6 rounded-full" style={{ backgroundColor: accent }} />
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Fale com a Secretaria</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sec.phone && (
                    <a
                      href={`tel:${sec.phone.replace(/\D/g, "")}`}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-5 h-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Telefone</p>
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-brand-blue transition-colors">{sec.phone}</p>
                      </div>
                    </a>
                  )}
                  {sec.email && (
                    <a
                      href={`mailto:${sec.email}`}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-5 h-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">E-mail</p>
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-brand-blue transition-colors truncate">{sec.email}</p>
                      </div>
                    </a>
                  )}
                  {sec.hours && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-5 h-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Horário de Atendimento</p>
                        <p className="font-semibold text-gray-900 text-sm">{sec.hours}</p>
                      </div>
                    </div>
                  )}
                  {sec.address && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${accent}18` }}
                      >
                        <svg className="w-5 h-5" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Endereço</p>
                        <p className="font-semibold text-gray-900 text-sm">{sec.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* No contact info fallback */}
                {!sec.phone && !sec.email && !sec.hours && !sec.address && (
                  <p className="text-sm text-gray-400">
                    Entre em contato com a Prefeitura para obter informações sobre esta secretaria.
                  </p>
                )}
              </section>

              {/* Empty state */}
              {!hasContent && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${accent}15` }}
                  >
                    <svg className="w-7 h-7" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Informações sobre esta secretaria serão publicadas em breve.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
