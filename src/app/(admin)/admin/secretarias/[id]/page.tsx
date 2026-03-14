"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Secretaria } from "@/types/database";

export default function EditSecretariaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { register, control, handleSubmit, reset, setValue } = useForm<Partial<Secretaria>>();

  useEffect(() => {
    supabase.from("secretarias").select("*").eq("id", id).single().then(({ data }) => {
      if (data) reset(data);
      setLoading(false);
    });
  }, [id]);

  async function onSubmit(data: Partial<Secretaria>) {
    setError("");
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("secretarias")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (err) throw new Error(err.message);
      router.push("/admin/secretarias");
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
        <h1 className="text-2xl font-bold text-gray-900">Editar Secretaria</h1>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="label-base">Nome da Secretaria</label>
            <input {...register("name")} className="input-base" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Nome curto</label>
              <input {...register("short_name")} className="input-base" placeholder="Ex: Saúde" />
            </div>
            <div>
              <label className="label-base">Secretário(a)</label>
              <input {...register("secretary_name")} className="input-base" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Telefone</label>
              <input {...register("phone")} className="input-base" />
            </div>
            <div>
              <label className="label-base">E-mail</label>
              <input {...register("email")} type="email" className="input-base" />
            </div>
          </div>

          <div>
            <label className="label-base">Horário de atendimento</label>
            <input {...register("hours")} className="input-base" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Foto do Secretário(a)</h2>
          <Controller
            name="secretary_photo_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value ?? undefined}
                onChange={field.onChange}
                bucket="profiles"
                label="Foto do secretário(a)"
              />
            )}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Descrição / Atribuições</h2>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Descreva as atribuições desta secretaria..."
              />
            )}
          />
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
