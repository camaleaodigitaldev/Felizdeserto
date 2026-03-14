import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Banner } from "@/types/database";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });

  const banners = (data ?? []) as Banner[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners / Slides</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Gerencie os slides do carrossel da página inicial
          </p>
        </div>
        <Link href="/admin/banners/novo" className="btn-primary text-sm gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400">Nenhum banner cadastrado</p>
          <Link href="/admin/banners/novo" className="inline-flex items-center gap-1.5 mt-3 text-sm text-brand-blue hover:underline">
            + Criar primeiro banner
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col sm:flex-row transition-all ${
                banner.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-52 h-32 sm:h-auto flex-shrink-0 bg-brand-blue">
                {banner.image_url ? (
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="208px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/60 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-xs text-white/70 bg-black/30 px-2 py-0.5 rounded-full">
                    Ordem #{banner.display_order}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{banner.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      banner.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {banner.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-400 truncate">{banner.subtitle}</p>
                  )}
                  {banner.link_url && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="text-xs text-gray-400 truncate max-w-xs">
                        {banner.link_label && <strong className="text-gray-600">{banner.link_label}</strong>}
                        {banner.link_label && banner.link_url && " → "}
                        {banner.link_url}
                      </span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/admin/banners/${banner.id}`}
                  className="btn-outline text-sm flex-shrink-0"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">
        Os banners ativos aparecem na página inicial em ordem crescente de número.
        Recomendado: imagens de <strong>1920×600px</strong> ou proporção 16:5.
      </p>
    </div>
  );
}
