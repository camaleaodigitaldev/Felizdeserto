import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vice-Prefeito",
  description: `Conheça o Vice-Prefeito de Feliz Deserto: ${SITE.vicePrefeito}.`,
};

export default function VicePrefeitoPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Governo", href: "/governo" },
          { label: "Vice-Prefeito" },
        ]}
      />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Vice-Prefeito</h1>
          <p className="text-blue-200 mt-1">Gestão Municipal de Feliz Deserto/AL</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">Foto a ser inserida</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-brand-green rounded-xl text-white text-center">
              <p className="font-bold text-lg">{SITE.vicePrefeito}</p>
              <p className="text-green-100 text-sm">Vice-Prefeito</p>
              <p className="text-green-100 text-sm">Mandato 2025–2028</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-4">{SITE.vicePrefeito}</h2>
              <div className="w-12 h-1 bg-brand-green rounded mb-6" />
              <p className="text-gray-600 leading-relaxed">
                O Vice-Prefeito Municipal de Feliz Deserto atua em parceria direta com o
                Prefeito na condução da gestão pública, representando o município e
                colaborando com as ações da administração em todas as secretarias e órgãos municipais.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Cargo", value: "Vice-Prefeito" },
                { label: "Mandato", value: "2025–2028" },
                { label: "Município", value: "Feliz Deserto/AL" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-gray-800 font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
