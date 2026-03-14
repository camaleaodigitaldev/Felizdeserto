"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Secretaria, NewsCategory } from "@/types/database";

export default function EditSecretariaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [accentPreview, setAccentPreview] = useState("#1a3a6b");

  const { register, control, handleSubmit, reset, watch } = useForm<Partial<Secretaria>>();

  const watchedAccent = watch("accent_color");

  useEffect(() => {
    if (watchedAccent) setAccentPreview(watchedAccent);
  }, [watchedAccent]);

  useEffect(() => {
    Promise.all([
      supabase.from("secretarias").select("*").eq("id", id).single(),
      supabase.from("news_categories").select("*").order("name"),
    ]).then(([{ data: sec }, { data: cats }]) => {
      if (sec) {
        reset(sec);
        setAccentPreview(sec.accent_color ?? "#1a3a6b");
      }
      if (cats) setCategories(cats as NewsCategory[]);
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Secretaria</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure o mini-site desta secretaria</p>
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
          <div>
            <label className="label-base">Missão / Slogan <span className="text-gray-400 font-normal">(aparece no hero do mini-site)</span></label>
            <input
              {...register("mission")}
              className="input-base"
              placeholder="Ex: Promovendo saúde e qualidade de vida para todos..."
            />
          </div>
          <div>
            <label className="label-base">
              Experiência / Mini-bio
              <span className="text-gray-400 font-normal ml-1">(aparece abaixo do nome no mini-site)</span>
            </label>
            <textarea
              {...register("secretary_bio")}
              className="input-base resize-none"
              rows={3}
              placeholder="Ex: Pedagoga com 15 anos de experiência na rede pública, especialista em gestão educacional e políticas de inclusão..."
            />
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
        </div>

        {/* ── Mini-site: personalização ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-brand-green" />
            Personalização do Mini-site
          </h2>

          {/* Accent color + category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-base">Cor de destaque</label>
              <div className="flex items-center gap-3">
                <input
                  {...register("accent_color")}
                  type="color"
                  className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                />
                <div
                  className="flex-1 h-10 rounded-xl border border-gray-200 flex items-center px-3 text-sm font-mono text-gray-600 transition-colors"
                  style={{ backgroundColor: `${accentPreview}18` }}
                >
                  {accentPreview}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Usada no hero, ícones e bordas do mini-site
              </p>
            </div>

            <div>
              <label className="label-base">
                Categoria de notícias vinculada
              </label>
              <select
                {...register("news_category_id", { valueAsNumber: true })}
                className="input-base"
              >
                <option value="">— Nenhuma —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1.5">
                Notícias desta categoria aparecem no mini-site
              </p>
            </div>
          </div>

          {/* Cover image */}
          <div>
            <Controller
              name="cover_image_url"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  bucket="banners"
                  label="Imagem de fundo do hero (banner)"
                />
              )}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Recomendado: 1920×600px. Se não definida, usará a cor de destaque como fundo.
            </p>
          </div>

          {/* Logo */}
          <div>
            <Controller
              name="logo_url"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value ?? undefined}
                  onChange={field.onChange}
                  bucket="profiles"
                  label="Logo da secretaria (opcional)"
                />
              )}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Aparece no canto do hero ao lado do nome da secretaria.
            </p>
          </div>
        </div>

        {/* ── Foto do secretário ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-brand-gold" />
            Foto do Secretário(a)
          </h2>
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

        {/* ── Descrição ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-purple-500" />
            Descrição / Atribuições
          </h2>
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

        {/* Preview mini */}
        <div
          className="rounded-2xl p-5 text-white text-sm flex items-center gap-4"
          style={{ backgroundColor: accentPreview }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
            S
          </div>
          <div>
            <p className="font-bold">Prévia da cor de destaque</p>
            <p className="text-white/70 text-xs">O mini-site usará esta cor nos elementos de destaque</p>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
