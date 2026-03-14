"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import type { News, NewsCategory } from "@/types/database";
import { NEWS_STATUS_LABELS } from "@/lib/constants";
import { slugify } from "@/lib/slugify";

export default function EditNoticiaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<NewsCategory[]>([]);

  const { register, control, handleSubmit, reset, watch, setValue } = useForm<Partial<News>>();
  const title = watch("title", "");

  useEffect(() => {
    Promise.all([
      supabase.from("news").select("*").eq("id", id).single(),
      supabase.from("news_categories").select("*").order("name"),
    ]).then(([{ data: news }, { data: cats }]) => {
      if (news) reset(news);
      if (cats) setCategories(cats);
      setLoading(false);
    });
  }, [id]);

  async function onSubmit(data: Partial<News>) {
    setError("");
    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("news")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (err) throw new Error(err.message);
      router.push("/admin/noticias");
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
        <h1 className="text-2xl font-bold text-gray-900">Editar Notícia</h1>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="label-base">Título</label>
            <input
              {...register("title")}
              className="input-base"
              onChange={(e) => {
                setValue("title", e.target.value);
                setValue("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <label className="label-base">Slug (URL)</label>
            <input {...register("slug")} className="input-base font-mono text-sm" />
          </div>
          <div>
            <label className="label-base">Resumo</label>
            <textarea {...register("summary")} className="input-base resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Categoria</label>
              <select {...register("category_id", { valueAsNumber: true })} className="input-base">
                <option value="">Sem categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-base">Status</label>
              <select {...register("status")} className="input-base">
                {Object.entries(NEWS_STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label-base">Publicar em (agendamento)</label>
            <input {...register("scheduled_for")} type="datetime-local" className="input-base" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Imagem de capa</h2>
          <Controller
            name="cover_image_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value ?? undefined}
                onChange={field.onChange}
                bucket="news-images"
                label="Imagem de capa"
              />
            )}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-5">Conteúdo</h2>
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Escreva o conteúdo da notícia..."
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
