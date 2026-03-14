import { createClient } from "@/lib/supabase/server";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EDITAL_CATEGORIES, EDITAL_STATUS_COLORS, EDITAL_STATUS_LABELS } from "@/lib/constants";
import type { Edital } from "@/types/database";
import type { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Editais e Licitações",
  description: "Consulte os editais e processos licitatórios da Prefeitura Municipal de Feliz Deserto/AL.",
};

interface Props {
  searchParams: Promise<{ status?: string; categoria?: string }>;
}

export default async function EditaisPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("editais")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);
  if (params.categoria) query = query.eq("category", params.categoria);

  const { data: editais } = await query;

  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Editais e Licitações" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Editais e Licitações</h1>
          <p className="text-blue-200 mt-1">
            Processos licitatórios da Prefeitura de Feliz Deserto/AL
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/editais"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !params.status && !params.categoria
                ? "bg-brand-blue text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todos
          </Link>
          {["aberto", "encerrado", "homologado"].map((s) => (
            <Link
              key={s}
              href={`/editais?status=${s}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                params.status === s
                  ? "bg-brand-blue text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {EDITAL_STATUS_LABELS[s]}
            </Link>
          ))}
        </div>

        {!editais || editais.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">Nenhum edital encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(editais as Edital[]).map((edital) => (
              <div key={edital.id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        EDITAL_STATUS_COLORS[edital.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {EDITAL_STATUS_LABELS[edital.status] ?? edital.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {EDITAL_CATEGORIES[edital.category] ?? edital.category}
                    </span>
                    <span className="text-xs text-gray-400">Nº {edital.number}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{edital.title}</h3>
                  {edital.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{edital.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400">
                    {edital.opening_date && (
                      <span>
                        Abertura:{" "}
                        {format(new Date(edital.opening_date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                    {edital.closing_date && (
                      <span>
                        Encerramento:{" "}
                        {format(new Date(edital.closing_date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                    {edital.value && (
                      <span>
                        Valor estimado:{" "}
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(edital.value)}
                      </span>
                    )}
                  </div>
                </div>
                {edital.pdf_url && (
                  <a
                    href={edital.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-shrink-0 text-sm gap-2"
                    download={edital.pdf_filename ?? true}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
