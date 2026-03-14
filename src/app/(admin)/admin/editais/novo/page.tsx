"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { EDITAL_CATEGORIES, EDITAL_STATUS_LABELS } from "@/lib/constants";

const schema = z.object({
  title: z.string().min(5, "Título obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  category: z.string(),
  status: z.string(),
  description: z.string().optional(),
  opening_date: z.string().optional(),
  closing_date: z.string().optional(),
  value: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewEditalPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: "licitacao", status: "aberto" },
  });

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

  async function onSubmit(data: FormData) {
    setError("");
    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();

      let pdfUrl: string | null = null;
      let pdfFilename: string | null = null;
      if (pdfFile) {
        const result = await uploadPdf(pdfFile);
        if (result) { pdfUrl = result.url; pdfFilename = result.filename; }
      }

      const { error: err } = await supabase.from("editais").insert({
        title: data.title,
        number: data.number,
        category: data.category as "licitacao",
        status: data.status as "aberto",
        description: data.description || null,
        opening_date: data.opening_date || null,
        closing_date: data.closing_date || null,
        value: data.value ? parseFloat(data.value) : null,
        pdf_url: pdfUrl,
        pdf_filename: pdfFilename,
        published_by: user.user?.id ?? null,
      });
      if (err) throw new Error(err.message);
      router.push("/admin/editais");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Edital</h1>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="label-base">Título *</label>
            <input {...register("title")} className="input-base" placeholder="Ex: Pregão Eletrônico nº 001/2025" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-base">Número *</label>
              <input {...register("number")} className="input-base" placeholder="001/2025" />
              {errors.number && <p className="text-xs text-red-500 mt-1">{errors.number.message}</p>}
            </div>
            <div>
              <label className="label-base">Tipo</label>
              <select {...register("category")} className="input-base">
                {Object.entries(EDITAL_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-base">Status</label>
              <select {...register("status")} className="input-base">
                {Object.entries(EDITAL_STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-base">Descrição</label>
            <textarea {...register("description")} className="input-base resize-none" rows={3} placeholder="Objeto da licitação" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-base">Data de abertura</label>
              <input {...register("opening_date")} type="date" className="input-base" />
            </div>
            <div>
              <label className="label-base">Data de encerramento</label>
              <input {...register("closing_date")} type="date" className="input-base" />
            </div>
            <div>
              <label className="label-base">Valor estimado (R$)</label>
              <input {...register("value")} type="number" step="0.01" className="input-base" placeholder="0,00" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Arquivo PDF</h2>
          <input ref={pdfRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
          {pdfFile ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{pdfFile.name}</p>
                <p className="text-xs text-gray-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={() => setPdfFile(null)} className="text-sm text-red-500 hover:text-red-700">Remover</button>
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

        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving || uploading ? "Salvando..." : "Salvar edital"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
