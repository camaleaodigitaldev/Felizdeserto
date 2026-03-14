"use client";

import { useEffect, useState } from "react";
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
  const [error, setError] = useState("");

  const { register, handleSubmit, reset } = useForm<Partial<Edital>>();

  useEffect(() => {
    supabase.from("editais").select("*").eq("id", id).single().then(({ data }) => {
      if (data) reset(data);
      setLoading(false);
    });
  }, [id]);

  async function onSubmit(data: Partial<Edital>) {
    setError("");
    setSaving(true);
    try {
      const { error: err } = await supabase
        .from("editais")
        .update({ ...data, updated_at: new Date().toISOString() })
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
          <div>
            <label className="label-base">URL do PDF</label>
            <input {...register("pdf_url")} type="url" className="input-base font-mono text-sm" placeholder="https://..." />
            <p className="text-xs text-gray-400 mt-1">Cole a URL do PDF após fazer upload via painel de Editais</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
