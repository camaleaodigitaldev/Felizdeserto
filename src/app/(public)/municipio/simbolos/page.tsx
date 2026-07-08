import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Símbolos do Município",
  description: "Conheça os símbolos oficiais de Feliz Deserto/AL: bandeira, brasão e hino.",
};

const SYMBOLS: { label: string; image: string | null }[] = [
  { label: "Brasão de Armas", image: SITE.brasaoUrl },
  { label: "Bandeira Municipal", image: null },
  { label: "Logomarca", image: null },
];

const HINO: string[][] = [
  [
    "Terra boa, gentil, carinhosa",
    "Em que nós os teus filhos vivemos",
    "Para todos és mãe amorosa",
    "E felizes em ti nós seremos",
  ],
  [
    "De Alagoas, recanto querido",
    "Nós queremos pra sempre te amar",
    "Ver-te grande, feliz destemido",
    "E por ti com amor trabalhar",
  ],
  [
    "Acordando as paragens dormentes",
    "Brame o mar dadivoso ali perto",
    "Somos de almas heróicas sementes",
    "Nós teus filhos é Feliz Deserto",
  ],
  [
    "Coqueirais em teus seios encerras",
    "Flores mil os teus campos também",
    "Não invejam teus filhos as terras",
    "Nem os céus de outros povos de além",
  ],
  [
    "É Maria, do céu mãe bondosa",
    "Quem nos guia nos passos da vida",
    "E por Ela, é terra ditosa",
    "Terás força e amparo na lida",
  ],
  [
    "Só por Deus, Santidade e Amor",
    "Nós queremos alegres viver",
    "O trabalho, a justiça, o valor",
    "Nosso lema de glória hão de ser",
  ],
];

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
          {SYMBOLS.map(({ label, image }) => (
            <div key={label} className="card p-8 flex flex-col items-center text-center">
              {image ? (
                <div className="relative w-40 h-40 mb-4">
                  <Image
                    src={image}
                    alt={label}
                    fill
                    sizes="160px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-4 text-gray-300">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs mt-2">Imagem a inserir</span>
                </div>
              )}
              <h3 className="font-semibold text-brand-blue">{label}</h3>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-brand-blue mb-1">Hino Municipal</h2>
          <p className="text-sm text-gray-400 mb-6">Hino de Feliz Deserto</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {HINO.map((estrofe, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-brand-gold font-bold select-none">{i + 1}</span>
                <p className="text-gray-700 leading-relaxed">
                  {estrofe.map((verso, j) => (
                    <span key={j}>
                      {verso}
                      {j < estrofe.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
