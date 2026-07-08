import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import BannersList from "@/components/admin/BannersList";
import type { Banner } from "@/types/database";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true })
    .order("id", { ascending: true });

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

      <BannersList initial={banners} />

      <p className="text-xs text-gray-400 mt-6 text-center">
        Reordene os banners com as setas ▲▼. O primeiro da lista aparece primeiro no site.
        Recomendado: imagens de <strong>1920×600px</strong> (proporção 16:5).
      </p>
    </div>
  );
}
