"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/youtube";

const schema = z.object({
  title: z.string().min(3, "Título obrigatório"),
  youtube_url: z.string().url("URL inválida").refine(
    (url) => extractYoutubeId(url) !== null,
    "URL do YouTube inválida"
  ),
  description: z.string().optional(),
  is_featured: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewVideoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_featured: false },
  });

  const youtubeUrl = watch("youtube_url");

  function handleUrlChange(url: string) {
    const id = extractYoutubeId(url);
    setPreview(id ? getYoutubeThumbnail(id) : null);
  }

  async function onSubmit(data: FormData) {
    setError("");
    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const youtubeId = extractYoutubeId(data.youtube_url)!;
      const thumbnail = getYoutubeThumbnail(youtubeId);

      const { error: err } = await supabase.from("videos").insert({
        title: data.title,
        youtube_url: data.youtube_url,
        youtube_id: youtubeId,
        thumbnail_url: thumbnail,
        description: data.description || null,
        is_featured: data.is_featured ?? false,
        published_by: user.user?.id ?? null,
      });
      if (err) throw new Error(err.message);
      router.push("/admin/videos");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Novo Vídeo</h1>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="label-base">URL do YouTube *</label>
            <input
              {...register("youtube_url")}
              className="input-base"
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            {errors.youtube_url && <p className="text-xs text-red-500 mt-1">{errors.youtube_url.message}</p>}
          </div>

          {preview && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
              <Image src={preview} alt="Preview" fill className="object-cover" sizes="500px" />
            </div>
          )}

          <div>
            <label className="label-base">Título *</label>
            <input {...register("title")} className="input-base" placeholder="Título do vídeo" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label-base">Descrição</label>
            <textarea {...register("description")} className="input-base resize-none" rows={3} placeholder="Descrição opcional" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input {...register("is_featured")} type="checkbox" className="w-4 h-4 accent-brand-blue" />
            <span className="text-sm font-medium text-gray-700">Destaque (aparece primeiro)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Salvando..." : "Salvar vídeo"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
