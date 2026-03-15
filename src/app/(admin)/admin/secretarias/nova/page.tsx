"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import type { NewsCategory } from "@/types/database";

interface FormData {
  name: string;
  short_name: string;
  slug: string;
  secretary_name: string;
  secretary_bio: string;
  mission: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  accent_color: string;
  news_category_id: number | "";
  cover_image_url: string;
  logo_url: string;
  secretary_photo_url: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NovaSecretariaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [accentPreview, setAccentPreview] = useState("#1a3a6b");

  const { register, control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      accent_color: "#1a3a6b",
      is_active: true,
      display_order: 0,
    },
  });

  const watchedAccent = watch("accent_color");
  const watchedName = watch("name");

  useEffect(() => {
    if (watchedAccent) setAccentPreview(watchedAccent);
  }, [watchedAccent]);

  // Auto-gera slug a partir do nome
  useEffect(() => {
    if (watchedName) setValue("slug", slugify(watchedName));
  }, [watchedName, setValue]);

  useEffect(() => {
    supabase.from("news_categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data as NewsCategory[]);
    });
  }, []);

  async function onSubmit(data: FormData) {
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...data,
        news_category_id: data.news_category_id === "" ? null : Number(data.news_category_id),
        display_order: Number(data.display_order) || 0,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("secretarias")
        .insert(payload);
      if (err) throw new Error(err.message);
      router.push("/admin/secretarias");
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
          <h1 className="text-2xl font-bold text-gray-900">Nova Secretaria</h1>
          <p className="text-sm text-gray-400 mt-0.5">Crie um mini-site para a nova secretaria</p>
        </div>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Informações básicas ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-blue" />
            Informações da Secretaria
          </h2>
          <div>
            <label className="label-base">Nome da Secretaria *</label>
            <input {...register("name", { required: true })} className="input-base" placeholder="Ex: Secretaria Municipal de Saúde" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Nome curto</label>
              <input {...register("short_name")} className="input-base" placeholder="Ex: Saúde" />
            </div>
            <div>
              <label className="label-base">Slug (URL) *</label>
              <input {...register("slug", { required: true })} className="input-base font-mono text-sm" placeholder="saude" />
              <p className="text-xs text-gray-400 mt-1">Auto-gerado a partir do nome. Ex: saude</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Secretário(a) *</label>
              <input {...register("secretary_name", { required: true })} className="input-base" />
            </div>
            <div>
              <label className="label-base">Ordem de exibição</label>
              <input {...register("display_order")} type="number" className="input-base" placeholder="0" />
            </div>
          </div>
          <div>
            <label className="label-base">Missão / Slogan <span className="text-gray-400 font-normal">(aparece no hero)</span></label>
            <input {...register("mission")} className="input-base" placeholder="Ex: Promovendo saúde e qualidade de vida para todos..." />
          </div>
          <div>
            <label className="label-base">Mini-bio do(a) secretário(a)</label>
            <textarea {...register("secretary_bio")} className="input-base resize-none" rows={3} placeholder="Ex: Médico com 20 anos de experiência..." />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Horário de atendimento</label>
              <input {...register("hours")} className="input-base" />
            </div>
            <div>
              <label className="label-base">Endereço</label>
              <input {...register("address")} className="input-base" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input {...register("is_active")} type="checkbox" id="is_active" className="w-4 h-4 rounded" />
            <label htmlFor="is_active" className="text-sm text-gray-700">Secretaria ativa (visível no site)</label>
          </div>
        </div>

        {/* ── Mini-site ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-green" />
            Personalização do Mini-site
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-base">Cor de destaque</label>
              <div className="flex items-center gap-3">
                <input {...register("accent_color")} type="color" className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5" />
                <div className="flex-1 h-10 rounded-xl border border-gray-200 flex items-center px-3 text-sm font-mono text-gray-600 transition-colors" style={{ backgroundColor: `${accentPreview}18` }}>
                  {accentPreview}
                </div>
              </div>
            </div>
            <div>
              <label className="label-base">Categoria de notícias vinculada</label>
              <select {...register("news_category_id")} className="input-base">
                <option value="">— Nenhuma —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1.5">Notícias desta categoria aparecerão no mini-site</p>
            </div>
          </div>
          <Controller name="cover_image_url" control={control} render={({ field }) => (
            <ImageUploader value={field.value ?? undefined} onChange={field.onChange} bucket="banners" label="Imagem de fundo do hero (banner)" />
          )} />
          <Controller name="logo_url" control={control} render={({ field }) => (
            <ImageUploader value={field.value ?? undefined} onChange={field.onChange} bucket="profiles" label="Logo da secretaria (opcional)" />
          )} />
        </div>

        {/* ── Foto do secretário ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-brand-gold" />
            Foto do Secretário(a)
          </h2>
          <Controller name="secretary_photo_url" control={control} render={({ field }) => (
            <ImageUploader value={field.value ?? undefined} onChange={field.onChange} bucket="profiles" label="Foto do secretário(a)" />
          )} />
        </div>

        {/* ── Descrição ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-purple-500" />
            Descrição / Atribuições
          </h2>
          <Controller name="description" control={control} render={({ field }) => (
            <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Descreva as atribuições desta secretaria..." />
          )} />
        </div>

        <div
          className="rounded-2xl p-5 text-white text-sm flex items-center gap-4"
          style={{ backgroundColor: accentPreview }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">S</div>
          <div>
            <p className="font-bold">Prévia da cor de destaque</p>
            <p className="text-white/70 text-xs">O mini-site usará esta cor nos elementos de destaque</p>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Criando..." : "Criar secretaria"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
