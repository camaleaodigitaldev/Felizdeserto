"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import type { Document } from "@/types/database";
import PdfViewerModal from "./PdfViewerModal";

interface GroupedDocs {
  key: string;
  label: string;
  items: Document[];
}

interface CategoryIconProps { category: string }

const ICON_PATHS: Record<string, string> = {
  diario_oficial: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  lei: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  decreto: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  portaria: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  prestacao_contas: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  resolucao: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  convenio: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  contrato: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  ata: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  outro: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
};

function CategoryIcon({ category }: CategoryIconProps) {
  const d = ICON_PATHS[category] ?? ICON_PATHS.outro;
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} />
    </svg>
  );
}

interface Props {
  grouped: GroupedDocs[];
  hasTypeFilter: boolean;
  selectedYear: number;
  searchQuery?: string;
  typeFilter?: string;
}

export default function DocumentsList({ grouped, hasTypeFilter, selectedYear, searchQuery, typeFilter }: Props) {
  const [viewer, setViewer] = useState<{ url: string; title: string; filename?: string | null } | null>(null);

  if (grouped.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-400 text-lg font-medium">Nenhum documento encontrado</p>
        <p className="text-gray-400 text-sm mt-1">
          {searchQuery
            ? `Não há documentos com "${searchQuery}" em ${selectedYear}`
            : `Não há documentos publicados em ${selectedYear}`}
        </p>
        {(typeFilter || searchQuery) && (
          <a href={`/documentos?ano=${selectedYear}`} className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand-blue hover:underline">
            ← Ver todos os documentos de {selectedYear}
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {grouped.map(({ key, label, items }) => {
          const cat = DOCUMENT_CATEGORIES[key] ?? DOCUMENT_CATEGORIES.outro;
          return (
            <div key={key}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-4">
                {!hasTypeFilter ? (
                  <div className={`p-2 rounded-xl ${cat.bg}`}>
                    <span className={cat.color}><CategoryIcon category={key} /></span>
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-brand-blue flex-shrink-0" />
                )}
                <h2 className="text-base font-bold text-gray-800 tracking-tight capitalize">{label}</h2>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">{items.length} documento{items.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Documents */}
              <div className="space-y-2">
                {items.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.bg}`}>
                      <span className={cat.color}><CategoryIcon category={doc.category} /></span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {hasTypeFilter && (
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.color}`}>
                            {cat.label}
                          </span>
                        )}
                        {doc.number && <span className="text-xs text-gray-400 font-mono">Nº {doc.number}</span>}
                        <span className="text-xs text-gray-400">
                          {format(new Date(doc.published_date + "T12:00:00"), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{doc.title}</h3>
                      {doc.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{doc.description}</p>}
                    </div>

                    {/* Actions */}
                    {doc.file_url ? (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setViewer({ url: doc.file_url!, title: doc.title, filename: doc.file_name })}
                          className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-2.5 rounded-xl hover:border-brand-blue hover:text-brand-blue transition-all duration-200"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Visualizar
                        </button>
                        <a
                          href={doc.file_url}
                          download={doc.file_name ?? true}
                          className="inline-flex items-center gap-1.5 bg-brand-blue text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-brand-blue-light transition-all duration-200 shadow-sm"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Baixar
                        </a>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex-shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Sem arquivo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF Viewer Modal */}
      {viewer && (
        <PdfViewerModal
          url={viewer.url}
          title={viewer.title}
          filename={viewer.filename}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
}
