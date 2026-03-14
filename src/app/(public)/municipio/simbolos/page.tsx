import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Símbolos do Município",
  description: "Conheça os símbolos oficiais de Feliz Deserto/AL: bandeira, brasão e hino.",
};

export default function SimbolosPage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Município", href: "/municipio" }, { label: "Símbolos" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Símbolos Municipais</h1>
          <p className="text-blue-200 mt-1">Brasão, Bandeira e Hino de Feliz Deserto/AL</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {["Brasão de Armas", "Bandeira Municipal", "Logomarca"].map((item) => (
            <div key={item} className="card p-8 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-4 text-gray-300">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs mt-2">Imagem a inserir</span>
              </div>
              <h3 className="font-semibold text-brand-blue">{item}</h3>
            </div>
          ))}
        </div>

        <div className="prose prose-gray max-w-none prose-headings:text-brand-blue">
          <h2>Hino Municipal</h2>
          <p className="text-gray-500 italic">
            A letra do Hino Municipal de Feliz Deserto será publicada em breve.
          </p>
        </div>
      </div>
    </>
  );
}
