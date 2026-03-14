import Image from "next/image";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prefeito Municipal",
  description: `Conheça o Prefeito Municipal de Feliz Deserto: ${SITE.prefeito}.`,
};

export default function PrefeitorPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Governo", href: "/governo" },
          { label: "Prefeito" },
        ]}
      />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Gabinete do Prefeito</h1>
          <p className="text-blue-200 mt-1">Gestão Municipal de Feliz Deserto/AL</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Photo */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">Foto a ser inserida</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-brand-blue rounded-xl text-white text-center">
              <p className="font-bold text-lg">{SITE.prefeito}</p>
              <p className="text-blue-200 text-sm">Prefeito Municipal</p>
              <p className="text-blue-200 text-sm">Mandato 2025–2028</p>
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-4">
                {SITE.prefeito}
              </h2>
              <div className="w-12 h-1 bg-brand-green rounded mb-6" />
              <p className="text-gray-600 leading-relaxed">
                O Prefeito Municipal de Feliz Deserto conduz a administração pública municipal
                com foco no desenvolvimento sustentável, na melhoria da qualidade de vida
                dos munícipes e na transparência da gestão pública.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Comprometido com o slogan{" "}
                <strong className="text-brand-blue">
                  &quot;{SITE.slogan}&quot;
                </strong>
                , a gestão prioriza investimentos em saúde, educação, infraestrutura
                e geração de emprego e renda para o município de Feliz Deserto/AL.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Cargo", value: "Prefeito Municipal" },
                { label: "Mandato", value: "2025–2028" },
                { label: "Município", value: "Feliz Deserto/AL" },
                { label: "CNPJ", value: SITE.cnpj },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-gray-800 font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="p-5 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
              <h3 className="font-semibold text-brand-blue mb-2">Contato do Gabinete</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📍 {SITE.address} — {SITE.cityStateZip}</p>
                <p>📞 {SITE.phone}</p>
                <p>✉️ {SITE.email}</p>
                <p>🕐 {SITE.officeHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
