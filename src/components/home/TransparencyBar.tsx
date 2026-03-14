import Link from "next/link";
import { SITE } from "@/lib/constants";

const items = [
  {
    href: SITE.transparencyUrl,
    label: "Portal da Transparência",
    desc: "Receitas, despesas e contratos",
    external: true,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
  },
  {
    href: `${SITE.transparencyUrl}/acesso-a-informacao/esic/solicitacao`,
    label: "e-SIC",
    desc: "Solicitação de acesso à informação",
    external: true,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    ),
  },
  {
    href: `${SITE.transparencyUrl}/acesso-a-informacao/ouvidoria/sugestao`,
    label: "Ouvidoria",
    desc: "Sugestões, elogios e reclamações",
    external: true,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    ),
  },
  {
    href: "/editais",
    label: "Editais e Licitações",
    desc: "Processos licitatórios",
    external: false,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
];

export default function TransparencyBar() {
  return (
    <section className="bg-brand-blue py-8">
      <div className="container-site">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="text-white font-semibold text-sm uppercase tracking-widest">
            Transparência e Acesso à Informação
          </h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item) => {
            const inner = (
              <div className="flex flex-col items-center text-center p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors group cursor-pointer h-full">
                <svg
                  className="w-8 h-8 text-brand-gold mb-2 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {item.icon}
                </svg>
                <span className="text-white font-semibold text-sm">{item.label}</span>
                <span className="text-blue-200 text-xs mt-1 hidden sm:block">{item.desc}</span>
              </div>
            );

            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {inner}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="block">
                {inner}
              </Link>
            );
          })}
        </div>

        <p className="text-center text-blue-300 text-xs mt-6">
          Em cumprimento à Lei de Acesso à Informação — Lei nº 12.527/2011
        </p>
      </div>
    </section>
  );
}
