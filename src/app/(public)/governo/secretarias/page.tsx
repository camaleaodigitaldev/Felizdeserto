import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { Secretaria } from "@/types/database";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Secretarias Municipais",
  description: "Conheça as secretarias da Prefeitura Municipal de Feliz Deserto/AL.",
};

export default async function SecretariasPage() {
  const supabase = await createClient();
  const { data: secretarias } = await supabase
    .from("secretarias")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Governo", href: "/governo" },
          { label: "Secretarias" },
        ]}
      />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Secretarias Municipais</h1>
          <p className="text-blue-200 mt-1">
            Conheça as secretarias que compõem a estrutura da Prefeitura de Feliz Deserto
          </p>
        </div>
      </div>

      <div className="container-site py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(secretarias ?? []).map((sec: Secretaria) => (
            <Link
              key={sec.id}
              href={`/governo/secretarias/${sec.slug}`}
              className="card group p-6 flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                {sec.secretary_photo_url ? (
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-full overflow-hidden">
                    <Image
                      src={sec.secretary_photo_url}
                      alt={sec.secretary_name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {(sec.short_name ?? sec.name).charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-1">
                    Secretário(a)
                  </p>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">
                    {sec.secretary_name}
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-brand-blue group-hover:text-brand-blue-light transition-colors leading-tight mb-2">
                {sec.name}
              </h3>

              {sec.phone && (
                <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-auto pt-3 border-t border-gray-50">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {sec.phone}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
