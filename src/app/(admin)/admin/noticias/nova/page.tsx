"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploader from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/slugify";
import type { NewsCategory } from "@/types/database";

const schema = z.object({
  title: z.string().min(5, "Título obrigatório"),
  slug: z.string().min(3, "Slug obrigatório"),
  summary: z.string().optional(),
  body: z.string().min(10, "Conteúdo obrigatório"),
  cover_image_url: z.string().optional(),
  category_id: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published"]),
  scheduled_for: z.string().optional(),
  tags: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewsCreatePage() {
  const router = useRouter();
  const supabase = createClient();
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft", body: "" },
  });

  const titleValue = watch("title");
  const statusValue = watch("status");

  useEffect(() => {
    supabase.from("news_categories").select("*").order("name").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (titleValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: false });
    }
  }, [titleValue, setValue]);

  async function onSubmit(data: FormData) {
    setError("");
    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const payload = {
        title: data.title,
        slug: data.slug,
        summary: data.summary || null,
        body: data.body,
        cover_image_url: data.cover_image_url || null,
        category_id: data.category_id ? Number(data.category_id) : null,
        author_id: user.user?.id ?? null,
        status: data.status,
        published_at: data.status === "published" ? new Date().toISOString() : null,
        scheduled_for: data.status === "scheduled" && data.scheduled_for
          ? new Date(data.scheduled_for).toISOString()
          : null,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
      };

      const { error: err } = await supabase.from("news").insert(payload);
      if (err) throw new Error(err.message);

      router.push("/admin/noticias");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Notícia</h1>
          <p className="text-gray-500 text-sm mt-1">Crie uma nova publicação</p>
        </div>
        <button
          onClick={() => router.back()}
          className="btn-outline text-sm"
        >
          ← Voltar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 border-b pb-3">Conteúdo</h2>

          <div>
            <label className="label-base">Título *</label>
            <input {...register("title")} className="input-base" placeholder="Título da notícia" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label-base">Slug (URL) *</label>
            <input {...register("slug")} className="input-base font-mono text-sm" />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="label-base">Resumo</label>
            <textarea
              {...register("summary")}
              className="input-base resize-none"
              rows={3}
              placeholder="Breve descrição da notícia (aparece na listagem)"
            />
          </div>

          <div>
            <label className="label-base">Conteúdo *</label>
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Escreva o conteúdo da notícia..."
                />
              )}
            />
            {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 border-b pb-3 mb-5">Imagem</h2>
          <Controller
            name="cover_image_url"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                label="Imagem de capa"
              />
            )}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 border-b pb-3">Publicação</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-base">Categoria</label>
              <select {...register("category_id")} className="input-base">
                <option value="">Sem categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-base">Status</label>
              <select {...register("status")} className="input-base">
                <option value="draft">Rascunho</option>
                <option value="published">Publicar agora</option>
                <option value="scheduled">Agendar</option>
              </select>
            </div>
          </div>

          {statusValue === "scheduled" && (
            <div>
              <label className="label-base">Data e hora de publicação</label>
              <input
                {...register("scheduled_for")}
                type="datetime-local"
                className="input-base"
              />
            </div>
          )}

          <div>
            <label className="label-base">Tags (separadas por vírgula)</label>
            <input
              {...register("tags")}
              className="input-base"
              placeholder="saude, educacao, obras"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 border-b pb-3">SEO (opcional)</h2>
          <div>
            <label className="label-base">Meta título</label>
            <input {...register("meta_title")} className="input-base" placeholder="Deixe em branco para usar o título" />
          </div>
          <div>
            <label className="label-base">Meta descrição</label>
            <textarea
              {...register("meta_description")}
              className="input-base resize-none"
              rows={2}
              placeholder="Descrição para mecanismos de busca"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar notícia"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
