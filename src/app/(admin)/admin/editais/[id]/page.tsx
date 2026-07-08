"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import type { Edital } from "@/types/database";
import { EDITAL_CATEGORIES, EDITAL_STATUS_LABELS } from "@/lib/constants";

export default function EditEditalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);
  const [currentPdfName, setCurrentPdfName] = useState<string | null>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<Partial<Edital>>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase.from("editais").select("*").eq("id", id).single().then(({ data }: { data: any }) => {
      if (data) {
        reset(data);
        setCurrentPdfUrl(data.pdf_url ?? null);
        setCurrentPdfName(data.pdf_filename ?? null);
      }
      setLoading(false);
    });
  }, [id]);

  async function uploadPdf(file: File): Promise<{ url: string; filename: string } | null> {
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: "application/pdf", bucket: "editais-pdfs" }),
      });
      if (!res.ok) return null;
      const { signedUrl, publicUrl } = await res.json();
      await fetch(signedUrl, { method: "PUT", body: file, headers: { "Content-Type": "application/pdf" } });
      return { url: publicUrl, filename: file.name };
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: Partial<Edital>) {
    setError("");
    setSaving(true);
    try {
      let extra: { pdf_url?: string; pdf_filename?: string } = {};
      if (pdfFile) {
        const result = await uploadPdf(pdfFile);
        if (!result) throw new Error("Falha no upload do PDF. Tente novamente.");
        extra = { pdf_url: result.url, pdf_filename: result.filename };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("editais")
        .update({ ...data, ...extra, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (err) throw new Error(err.message);
      router.push("/admin/editais");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-gray-400 py-20 text-center">Carregando...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Edital</h1>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="label-base">Título</label>
            <input {...register("title")} className="input-base" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Número / Referência</label>
              <input {...register("number")} className="input-base" placeholder="Ex: PP 001/2025" />
            </div>
            <div>
              <label className="label-base">Categoria</label>
              <select {...register("category")} className="input-base">
                {Object.entries(EDITAL_CATEGORIES).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Status</label>
              <select {...register("status")} className="input-base">
                {Object.entries(EDITAL_STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-base">Valor estimado (R$)</label>
              <input {...register("value", { valueAsNumber: true })} type="number" step="0.01" className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Data de abertura</label>
              <input {...register("opening_date")} type="date" className="input-base" />
            </div>
            <div>
              <label className="label-base">Data de encerramento</label>
              <input {...register("closing_date")} type="date" className="input-base" />
            </div>
          </div>
          <div>
            <label className="label-base">Descrição</label>
            <textarea {...register("description")} className="input-base resize-none" rows={4} />
          </div>

          {/* Arquivo PDF (upload, igual ao criar edital) */}
          <div>
            <label className="label-base">Arquivo PDF</label>
            <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
            {pdfFile ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{pdfFile.name}</p>
                  <p className="text-xs text-gray-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB · novo arquivo</p>
                </div>
                <button type="button" onClick={() => setPdfFile(null)} className="text-sm text-red-500 hover:text-red-700">Cancelar</button>
              </div>
            ) : currentPdfUrl ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <a href={currentPdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-blue hover:underline truncate block">
                    {currentPdfName || "Ver PDF atual"}
                  </a>
                  <p className="text-xs text-gray-400">PDF atual</p>
                </div>
                <button type="button" onClick={() => pdfRef.current?.click()} className="text-sm text-brand-blue hover:underline">Trocar</button>
              </div>
            ) : (
              <button type="button" onClick={() => pdfRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-blue hover:bg-brand-blue/5 transition-colors">
                <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm font-medium text-gray-600">Clique para selecionar PDF</p>
                <p className="text-xs text-gray-400 mt-1">PDF até 20MB</p>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving || uploading ? "Salvando..." : "Salvar alterações"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
