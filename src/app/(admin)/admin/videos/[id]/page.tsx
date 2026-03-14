"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { extractYoutubeId, getYoutubeThumbnail } from "@/lib/youtube";
import type { Video } from "@/types/database";

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<Partial<Video>>();
  const youtubeUrl = watch("youtube_url");

  useEffect(() => {
    supabase.from("videos").select("*").eq("id", id).single().then(({ data }) => {
      if (data) {
        reset(data);
        setPreview(data.thumbnail_url);
      }
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (youtubeUrl) {
      const youtubeId = extractYoutubeId(youtubeUrl);
      if (youtubeId) setPreview(getYoutubeThumbnail(youtubeId));
    }
  }, [youtubeUrl]);

  async function onSubmit(data: Partial<Video>) {
    setError("");
    setSaving(true);
    try {
      const youtubeId = extractYoutubeId(data.youtube_url ?? "");
      if (!youtubeId) throw new Error("URL do YouTube inválida");
      const thumbnail = getYoutubeThumbnail(youtubeId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: err } = await (supabase as any)
        .from("videos")
        .update({ ...data, youtube_id: youtubeId, thumbnail_url: thumbnail })
        .eq("id", id);
      if (err) throw new Error(err.message);
      router.push("/admin/videos");
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
        <h1 className="text-2xl font-bold text-gray-900">Editar Vídeo</h1>
        <button onClick={() => router.back()} className="btn-outline text-sm">← Voltar</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="label-base">URL do YouTube</label>
            <input {...register("youtube_url")} type="url" className="input-base font-mono text-sm" placeholder="https://www.youtube.com/watch?v=..." />
          </div>

          {preview && (
            <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-gray-200">
              <Image src={preview} alt="Thumbnail" fill className="object-cover" />
            </div>
          )}

          <div>
            <label className="label-base">Título</label>
            <input {...register("title")} className="input-base" />
          </div>
          <div>
            <label className="label-base">Descrição (opcional)</label>
            <textarea {...register("description")} className="input-base resize-none" rows={3} />
          </div>
          <div className="flex items-center gap-2">
            <input {...register("is_featured")} type="checkbox" id="is_featured" className="rounded" />
            <label htmlFor="is_featured" className="text-sm text-gray-700">Vídeo em destaque</label>
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
