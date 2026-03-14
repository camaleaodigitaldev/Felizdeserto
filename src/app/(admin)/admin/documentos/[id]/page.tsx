"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import type { Document } from "@/types/database";

type FormData = Partial<Document>;

export default function EditDocumentoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [existingFile, setExistingFile] = useState<{ url: string; name: string | null } | null>(null);
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          reset(data);
          if (data.file_url) setExistingFile({ url: data.file_url, name: data.file_name });
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
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "application/pdf" },
      });
      return { url: publicUrl, filename: file.name };
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: FormData) {
    setError("");
    setSaving(true);
    try {
      let fileUrl = existingFile?.url ?? null;
      let fileName = existingFile?.name ?? null;

      if (newPdfFile) {
        const result = await uploadPdf(newPdfFile);
        if (result) { fileUrl = result.url; fileName = result.filename; }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("documents")
        .update({
          title: data.title,
          number: data.number || null,
          category: data.category,
          description: data.description || null,
          published_date: data.published_date,
          file_url: fileUrl,
          file_name: fileName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (err) throw new Error(err.message);
      router.push("/admin/documentos");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.")) return;
    setDeleting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("documents")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (err) throw new Error(err.message);
      router.push("/admin/documentos");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao excluir");
      setDeleting(false);
    }
  }

  if (loading) return <div className="text-gray-400 py-20 text-center">Carregando...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Documento</h1>
          <p className="text-sm text-gray-400 mt-0.5">Atualize as informações do documento institucional</p>
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
            <input {...register("title")} className="input-base" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label-base">Número / Identificador</label>
              <input {...register("number")} className="input-base font-mono" placeholder="001/2025" />
            </div>
            <div>
              <label className="label-base">Tipo de Documento</label>
              <select {...register("category")} className="input-base">
                {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-base">Data de Publicação</label>
              <input {...register("published_date")} type="date" className="input-base" />
            </div>
          </div>

          <div>
            <label className="label-base">Descrição / Ementa</label>
            <textarea {...register("description")} className="input-base resize-none" rows={3} />
          </div>
        </div>

        {/* File section */}
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
            onChange={(e) => setNewPdfFile(e.target.files?.[0] ?? null)}
          />

          {/* New file selected */}
          {newPdfFile ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Novo arquivo selecionado</p>
                <p className="text-xs text-gray-500 truncate">{newPdfFile.name} — {(newPdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => setNewPdfFile(null)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          ) : existingFile ? (
            /* Existing file */
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {existingFile.name ?? "Arquivo atual"}
                </p>
                <a
                  href={existingFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-blue hover:underline"
                >
                  Visualizar PDF ↗
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => pdfRef.current?.click()}
                  className="text-xs text-brand-blue hover:underline font-medium"
                >
                  Substituir
                </button>
                <button
                  type="button"
                  onClick={() => setExistingFile(null)}
                  className="text-xs text-red-500 hover:underline font-medium"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => pdfRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-7 text-center hover:border-brand-blue hover:bg-brand-blue/5 transition-all duration-200 group"
            >
              <svg className="w-8 h-8 text-gray-300 group-hover:text-brand-blue mx-auto mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-sm font-medium text-gray-500 group-hover:text-brand-blue transition-colors">
                Clique para adicionar PDF
              </p>
              <p className="text-xs text-gray-400 mt-0.5">PDF até 20MB</p>
            </button>
          )}
        </div>

        <div className="flex gap-3 items-center pb-8">
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving || uploading ? "Salvando..." : "Salvar alterações"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            {deleting ? "Excluindo..." : "Excluir documento"}
          </button>
        </div>
      </form>
    </div>
  );
}
