import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("secretarias")
    .select("name, secretary_name")
    .eq("slug", slug)
    .single();
  if (!data) return { title: "Secretaria não encontrada" };
  return {
    title: data.name,
    description: `${data.name} — Secretário(a): ${data.secretary_name}. Prefeitura Municipal de Feliz Deserto/AL.`,
  };
}

export default async function SecretariaDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: sec } = await supabase
    .from("secretarias")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!sec) notFound();

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Governo", href: "/governo" },
          { label: "Secretarias", href: "/governo/secretarias" },
          { label: sec.short_name ?? sec.name },
        ]}
      />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">{sec.name}</h1>
          <p className="text-blue-200 mt-1">Prefeitura Municipal de Feliz Deserto/AL</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Secretary card */}
          <div className="md:col-span-1">
            <div className="card p-6 text-center">
              {sec.secretary_photo_url ? (
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={sec.secretary_photo_url}
                    alt={sec.secretary_name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-4xl">
                    {sec.secretary_name.charAt(0)}
                  </span>
                </div>
              )}
              <p className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-1">
                Secretário(a)
              </p>
              <p className="font-bold text-gray-900">{sec.secretary_name}</p>
            </div>

            {/* Contact */}
            {(sec.phone || sec.email || sec.address || sec.hours) && (
              <div className="card p-5 mt-4 space-y-3">
                <h3 className="font-semibold text-brand-blue text-sm">Contato</h3>
                {sec.phone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {sec.phone}
                  </p>
                )}
                {sec.email && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {sec.email}
                  </p>
                )}
                {sec.hours && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {sec.hours}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-brand-blue mb-2">{sec.name}</h2>
            <div className="w-12 h-1 bg-brand-green rounded mb-6" />
            {sec.description ? (
              <div
                className="prose prose-gray max-w-none prose-headings:text-brand-blue"
                dangerouslySetInnerHTML={{ __html: sec.description }}
              />
            ) : (
              <p className="text-gray-500">
                Informações sobre esta secretaria serão publicadas em breve.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
