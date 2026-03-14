import Link from "next/link";
import { SITE } from "@/lib/constants";

const links = [
  {
    href: "/transparencia",
    label: "Transparência",
    desc: "Portal da transparência municipal",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    color: "bg-brand-blue",
    external: false,
  },
  {
    href: "/editais",
    label: "Editais e Licitações",
    desc: "Processos licitatórios em aberto",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
    color: "bg-brand-green",
    external: false,
  },
  {
    href: "/noticias",
    label: "Notícias",
    desc: "Últimas notícias da prefeitura",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    ),
    color: "bg-brand-blue-light",
    external: false,
  },
  {
    href: "/videos",
    label: "Galeria de Vídeos",
    desc: "Vídeos oficiais da gestão",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
    color: "bg-purple-600",
    external: false,
  },
  {
    href: "/telefones-uteis",
    label: "Telefones Úteis",
    desc: "Contatos essenciais do município",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
    color: "bg-orange-500",
    external: false,
  },
  {
    href: "/fale-conosco",
    label: "Fale Conosco",
    desc: "Entre em contato com a prefeitura",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    color: "bg-brand-green-dark",
    external: false,
  },
];

export default function QuickLinks() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container-site">
        <h2 className="section-title text-center mb-2">Serviços e Informações</h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Acesse rapidamente os principais serviços da Prefeitura de Feliz Deserto
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`${link.color} text-white p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {link.icon}
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800 leading-tight mb-1">
                {link.label}
              </span>
              <span className="text-xs text-gray-400 leading-tight hidden sm:block">
                {link.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
