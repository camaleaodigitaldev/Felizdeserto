import { createClient } from "@/lib/supabase/server";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import type { Document } from "@/types/database";
import type { Metadata } from "next";
import DocumentsList from "@/components/docs/DocumentsList";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Documentos",
  description:
    "Acesse o Diário Oficial, Leis Municipais, Decretos, Portarias, Prestação de Contas e demais documentos da Prefeitura de Feliz Deserto/AL.",
};

interface Props {
  searchParams: Promise<{ tipo?: string; ano?: string; q?: string }>;
}

export default async function DocumentosPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const selectedYear = params.ano ? parseInt(params.ano) : currentYear;

  let query = supabase
    .from("documents")
    .select("*")
    .eq("is_active", true)
    .gte("published_date", `${selectedYear}-01-01`)
    .lte("published_date", `${selectedYear}-12-31`)
    .order("published_date", { ascending: false });

  if (params.tipo) query = query.eq("category", params.tipo);
  if (params.q) query = query.ilike("title", `%${params.q}%`);

  const { data: docs } = await query;
  const documents = (docs ?? []) as Document[];

  // Group by category (no filter) or by month (with filter)
  type Grouped = { key: string; label: string; items: Document[] }[];
  let grouped: Grouped = [];

  if (!params.tipo) {
    const byCategory: Record<string, Document[]> = {};
    for (const doc of documents) {
      if (!byCategory[doc.category]) byCategory[doc.category] = [];
      byCategory[doc.category].push(doc);
    }
    grouped = Object.entries(byCategory).map(([cat, items]) => ({
      key: cat,
      label: DOCUMENT_CATEGORIES[cat]?.label ?? "Outros",
      items,
    }));
  } else {
    const byMonth: Record<string, Document[]> = {};
    for (const doc of documents) {
      const monthKey = doc.published_date.slice(0, 7);
      if (!byMonth[monthKey]) byMonth[monthKey] = [];
      byMonth[monthKey].push(doc);
    }
    grouped = Object.entries(byMonth).map(([monthKey, items]) => ({
      key: monthKey,
      label: format(new Date(monthKey + "-01T12:00:00"), "MMMM 'de' yyyy", { locale: ptBR }),
      items,
    }));
  }

  const totalDocs = documents.length;

  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Documentos" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-blue-200 mt-1 text-sm">
            Diário Oficial, Leis, Decretos, Portarias, Prestação de Contas e demais atos normativos
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 space-y-4">

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/documentos?ano=${selectedYear}${params.q ? `&q=${params.q}` : ""}`}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                !params.tipo ? "bg-brand-blue text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Todos
              {!params.tipo && totalDocs > 0 && (
                <span className="bg-white/20 text-white text-xs px-1.5 rounded-full">{totalDocs}</span>
              )}
            </Link>
            {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => (
              <Link
                key={key}
                href={`/documentos?tipo=${key}&ano=${selectedYear}${params.q ? `&q=${params.q}` : ""}`}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  params.tipo === key ? "bg-brand-blue text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Year + Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Ano:</label>
              <div className="flex flex-wrap gap-1.5">
                {years.map((y) => (
                  <Link
                    key={y}
                    href={`/documentos?ano=${y}${params.tipo ? `&tipo=${params.tipo}` : ""}${params.q ? `&q=${params.q}` : ""}`}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                      y === selectedYear ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>

            <form method="GET" action="/documentos" className="sm:ml-auto flex items-center gap-2">
              {params.tipo && <input type="hidden" name="tipo" value={params.tipo} />}
              <input type="hidden" name="ano" value={selectedYear} />
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-brand-blue focus-within:bg-white transition-all">
                <input
                  type="text"
                  name="q"
                  defaultValue={params.q}
                  placeholder="Buscar por título..."
                  className="px-3 py-2 text-sm outline-none bg-transparent w-48 text-gray-700 placeholder-gray-400"
                />
                <button type="submit" className="bg-brand-blue text-white px-3 py-2 hover:bg-brand-blue-light transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              {params.q && (
                <Link
                  href={`/documentos?ano=${selectedYear}${params.tipo ? `&tipo=${params.tipo}` : ""}`}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕ Limpar
                </Link>
              )}
            </form>
          </div>
        </div>

        {/* Results — client component handles modal state */}
        <DocumentsList
          grouped={grouped}
          hasTypeFilter={!!params.tipo}
          selectedYear={selectedYear}
          searchQuery={params.q}
          typeFilter={params.tipo}
        />

        <p className="text-center text-xs text-gray-400 mt-10">
          Em cumprimento à Lei de Acesso à Informação — Lei nº 12.527/2011 &nbsp;·&nbsp;
          Responsabilidade Fiscal — Lei Complementar nº 101/2000
        </p>
      </div>
    </>
  );
}
