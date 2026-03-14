import { createClient } from "@/lib/supabase/server";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import type { Video } from "@/types/database";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Galeria de Vídeos",
  description: "Assista aos vídeos oficiais da Prefeitura Municipal de Feliz Deserto/AL.",
};

export default async function VideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("display_order")
    .order("created_at", { ascending: false });

  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Galeria de Vídeos" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Galeria de Vídeos</h1>
          <p className="text-blue-200 mt-1">
            Vídeos oficiais da Prefeitura de Feliz Deserto/AL
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        {!videos || videos.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 text-lg">Nenhum vídeo publicado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(videos as Video[]).map((video) => (
              <div key={video.id} className="card overflow-hidden">
                <div className="relative aspect-video bg-gray-900">
                  <iframe
                    src={getYoutubeEmbedUrl(video.youtube_id)}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
