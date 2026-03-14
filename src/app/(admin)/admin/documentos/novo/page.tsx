"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";

const schema = z.object({
  title: z.string().min(3, "Título obrigatório"),
  number: z.string().optional(),
  category: z.string().min(1),
  description: z.string().optional(),
  published_date: z.string().min(1, "Data obrigatória"),
});

type FormData = z.infer<typeof schema>;

export default function NovoDocumentoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: "diario_oficial",
      published_date: today,
    },
  });

  async function uploadPdf(file: File): Promise<{ url: string; filename: string } | null> {
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: "application/pdf",
          bucket: "documentos",
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Falha no upload");
      }
      const { signedUrl, publicUrl } = await res.json();
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "application/pdf" },
      });
      if (!uploadRes.ok) throw new Error("Falha ao enviar arquivo");
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

      let fileUrl: string | null = null;
      let fileName: string | null = null;
      if (pdfFile) {
        const result = await uploadPdf(pdfFile);
        if (result) { fileUrl = result.url; fileName = result.filename; }
      }

      const { error: err } = await supabase.from("documents").insert({
        title: data.title,
        number: data.number || null,
        category: data.category,
        description: data.description || null,
        published_date: data.published_date,
        file_url: fileUrl,
        file_name: fileName,
        published_by: user.user?.id ?? null,
      });

      if (err) throw new Error(err.message);
      router.push("/admin/documentos");
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Documento</h1>
          <p className="text-sm text-gray-400 mt-0.5">Adicione um documento institucional ao portal</p>
        </div>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-blue" />
            Informações do Documento
          </h2>

          <div>
            <label className="label-base">Título *</label>
            <input
              {...register("title")}
              className="input-base"
              placeholder="Ex: Lei Municipal nº 1.234/2025 — Dispõe sobre..."
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-base">Número / Identificador</label>
              <input
                {...register("number")}
                className="input-base font-mono"
                placeholder="001/2025"
              />
            </div>
            <div>
              <label className="label-base">Tipo de Documento *</label>
              <select {...register("category")} className="input-base">
                {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-base">Data de Publicação *</label>
              <input
                {...register("published_date")}
                type="date"
                className="input-base"
              />
              {errors.published_date && (
                <p className="text-xs text-red-500 mt-1">{errors.published_date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label-base">Descrição / Ementa</label>
            <textarea
              {...register("description")}
              className="input-base resize-none"
              rows={3}
              placeholder="Resumo ou ementa do documento..."
            />
          </div>
        </div>

        {/* File upload */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 rounded-full bg-brand-green" />
            Arquivo PDF
          </h2>

          <input
            ref={pdfRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
          />

          {pdfFile ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{pdfFile.name}</p>
                <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Remover
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => pdfRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-brand-blue hover:bg-brand-blue/5 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600 group-hover:text-brand-blue transition-colors">
                Clique para fazer upload do PDF
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF até 20MB</p>
            </button>
          )}
        </div>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving || uploading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {uploading ? "Enviando PDF..." : "Salvando..."}
              </span>
            ) : (
              "Salvar documento"
            )}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
