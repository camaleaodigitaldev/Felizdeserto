import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import type { Document } from "@/types/database";

interface Props {
  searchParams: Promise<{ tipo?: string; ano?: string }>;
}

export default async function AdminDocumentosPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  const currentYear = new Date().getFullYear();
  const selectedYear = params.ano ? parseInt(params.ano) : currentYear;
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  let query = supabase
    .from("documents")
    .select("*")
    .gte("published_date", `${selectedYear}-01-01`)
    .lte("published_date", `${selectedYear}-12-31`)
    .order("published_date", { ascending: false });

  if (params.tipo) query = query.eq("category", params.tipo);

  const { data: docs } = await query;
  const documents = (docs ?? []) as Document[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos Institucionais</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Diário Oficial, Leis, Decretos, Portarias, Prestação de Contas e mais
          </p>
        </div>
        <Link href="/admin/documentos/novo" className="btn-primary text-sm gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Documento
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-center">
        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={`/admin/documentos?ano=${selectedYear}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !params.tipo ? "bg-brand-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todos
          </Link>
          {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => (
            <Link
              key={key}
              href={`/admin/documentos?tipo=${key}&ano=${selectedYear}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                params.tipo === key
                  ? "bg-brand-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Year filter */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Ano:</span>
          {years.map((y) => (
            <Link
              key={y}
              href={`/admin/documentos?ano=${y}${params.tipo ? `&tipo=${params.tipo}` : ""}`}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                y === selectedYear
                  ? "bg-brand-blue text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      {documents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">Nenhum documento em {selectedYear}</p>
          <Link href="/admin/documentos/novo" className="inline-flex items-center gap-1.5 mt-3 text-sm text-brand-blue hover:underline">
            + Adicionar primeiro documento
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Arquivo</th>
                <th className="px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {documents.map((doc) => {
                const cat = DOCUMENT_CATEGORIES[doc.category] ?? DOCUMENT_CATEGORIES.outro;
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${cat.bg}`}>
                          <svg className={`w-4 h-4 ${cat.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-snug line-clamp-1">{doc.title}</p>
                          {doc.number && (
                            <p className="text-xs text-gray-400 font-mono mt-0.5">Nº {doc.number}</p>
                          )}
                          {/* Mobile-only info */}
                          <div className="flex gap-2 mt-1 md:hidden">
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                              {cat.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.bg} ${cat.color}`}>
                        {cat.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 hidden lg:table-cell whitespace-nowrap">
                      {format(new Date(doc.published_date + "T12:00:00"), "dd MMM yyyy", { locale: ptBR })}
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      {doc.file_url ? (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-brand-green hover:underline"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {doc.file_name ? doc.file_name.slice(0, 20) + (doc.file_name.length > 20 ? "…" : "") : "PDF"}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/documentos/${doc.id}`}
                        className="text-xs text-brand-blue hover:underline font-medium"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
            {documents.length} documento{documents.length !== 1 ? "s" : ""} em {selectedYear}
          </div>
        </div>
      )}
    </div>
  );
}
