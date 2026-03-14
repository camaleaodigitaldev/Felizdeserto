import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EDITAL_CATEGORIES, EDITAL_STATUS_COLORS, EDITAL_STATUS_LABELS } from "@/lib/constants";
import type { Metadata } from "next";

export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("editais").select("title, description").eq("id", id).single();
  if (!data) return { title: "Edital não encontrado" };
  return {
    title: data.title,
    description: data.description ?? undefined,
  };
}

export default async function EditalPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: edital } = await supabase
    .from("editais")
    .select("*")
    .eq("id", id)
    .single();

  if (!edital) notFound();

  const statusColor = EDITAL_STATUS_COLORS[edital.status] ?? "bg-gray-100 text-gray-700";
  const categoryLabel = EDITAL_CATEGORIES[edital.category] ?? edital.category;

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: "Editais e Licitações", href: "/editais" }, { label: edital.title }]} />
      <div className="bg-brand-blue text-white py-8">
        <div className="container-site">
          <h1 className="text-2xl font-bold">{edital.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
              {EDITAL_STATUS_LABELS[edital.status]}
            </span>
            <span className="text-white/70 text-sm">{categoryLabel}</span>
            {edital.number && (
              <span className="text-white/70 text-sm">Nº {edital.number}</span>
            )}
          </div>
        </div>
      </div>

      <div className="container-site py-8 max-w-4xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 pb-8 border-b">
            {edital.opening_date && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Abertura</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(edital.opening_date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            )}
            {edital.closing_date && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Encerramento</p>
                <p className="text-sm font-medium text-gray-900">
                  {format(new Date(edital.closing_date + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            )}
            {edital.value && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Valor estimado</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(edital.value)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Publicado em</p>
              <p className="text-sm font-medium text-gray-900">
                {format(new Date(edital.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          {edital.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{edital.description}</p>
            </div>
          )}

          {edital.pdf_url ? (
            <a
              href={edital.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Baixar edital (PDF)
            </a>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              O arquivo PDF deste edital ainda não está disponível para download.
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link href="/editais" className="text-brand-blue hover:underline text-sm">← Voltar para Editais e Licitações</Link>
        </div>
      </div>
    </div>
  );
}
