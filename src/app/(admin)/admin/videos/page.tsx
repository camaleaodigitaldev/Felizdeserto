import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Video } from "@/types/database";

export default async function AdminVideosPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("display_order")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeria de Vídeos</h1>
          <p className="text-gray-500 text-sm mt-1">{videos?.length ?? 0} vídeos</p>
        </div>
        <Link href="/admin/videos/novo" className="btn-primary">+ Novo Vídeo</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(!videos || videos.length === 0) ? (
          <div className="col-span-3 text-center py-16">
            <p className="text-gray-400 mb-4">Nenhum vídeo cadastrado.</p>
            <Link href="/admin/videos/novo" className="btn-primary inline-flex">Adicionar vídeo</Link>
          </div>
        ) : (
          (videos as Video[]).map((video) => (
            <div key={video.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {video.thumbnail_url && (
                <div className="relative aspect-video bg-gray-100">
                  <Image src={video.thumbnail_url} alt={video.title} fill className="object-cover" sizes="400px" />
                  {video.is_featured && (
                    <span className="absolute top-2 left-2 bg-brand-gold text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      Destaque
                    </span>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-brand-blue">
                    Ver no YouTube ↗
                  </a>
                  <Link href={`/admin/videos/${video.id}`} className="text-brand-blue text-sm font-medium hover:underline">
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
