"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Banner } from "@/types/database";

type FormData = Partial<Banner>;

export default function EditBannerPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const { register, control, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("banners")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }: { data: Banner }) => {
        if (data) reset(data);
        setLoading(false);
      });
  }, [id]);

  async function onSubmit(data: FormData) {
    setError("");
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("banners")
        .update({
          title: data.title,
          subtitle: data.subtitle || null,
          image_url: data.image_url || null,
          link_url: data.link_url || null,
          link_label: data.link_label || null,
          display_order: Number(data.display_order),
          is_active: data.is_active,
        })
        .eq("id", id);
      if (err) throw new Error(err.message);
      router.push("/admin/banners");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Excluir este banner? Esta ação não pode ser desfeita.")) return;
    setDeleting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any).from("banners").delete().eq("id", id);
      if (err) throw new Error(err.message);
      router.push("/admin/banners");
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
          <h1 className="text-2xl font-bold text-gray-900">Editar Banner</h1>
          <p className="text-sm text-gray-400 mt-0.5">Atualize o slide do carrossel</p>
        </div>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 rounded-full bg-brand-blue" />
            Imagem de Fundo
          </h2>
          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value || undefined}
                onChange={field.onChange}
                bucket="banners"
                label="Imagem do banner"
                accept="image/jpeg,image/png,image/webp"
              />
            )}
          />
          <p className="text-xs text-gray-400 mt-2">
            Recomendado: <strong>1920 × 600 px</strong> (proporção 16:5) · PNG, JPG ou WEBP · até 10MB
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-green" />
            Conteúdo do Slide
          </h2>

          <div>
            <label className="label-base">Título *</label>
            <input {...register("title")} className="input-base" />
          </div>

          <div>
            <label className="label-base">Subtítulo</label>
            <input {...register("subtitle")} className="input-base" />
          </div>
        </div>

        {/* Button / Link */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-gold" />
            Botão de Ação <span className="text-gray-400 font-normal text-sm">(opcional)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Texto do botão</label>
              <input {...register("link_label")} className="input-base" placeholder="Ex: Saiba Mais" />
            </div>
            <div>
              <label className="label-base">Link de destino</label>
              <input {...register("link_url")} className="input-base" placeholder="Ex: https://... ou /pagina" />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-gray-400" />
            Configurações
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Ordem de exibição</label>
              <input
                {...register("display_order", { valueAsNumber: true })}
                type="number"
                min={1}
                className="input-base w-24"
              />
              <p className="text-xs text-gray-400 mt-1">Menor número = aparece primeiro</p>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input
                {...register("is_active")}
                type="checkbox"
                id="is_active"
                className="w-4 h-4 rounded accent-brand-blue"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                Banner ativo (visível no site)
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center pb-8">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancelar</button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            {deleting ? "Excluindo..." : "Excluir banner"}
          </button>
        </div>
      </form>
    </div>
  );
}
