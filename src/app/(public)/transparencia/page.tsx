import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transparência e Acesso à Informação",
  description: "Portal de Transparência e informações sobre a Lei de Acesso à Informação (Lei nº 12.527/2011) da Prefeitura de Feliz Deserto/AL.",
};

const transparencyLinks = [
  { label: "Apresentação", href: `${SITE.transparencyUrl}/apresentacao` },
  { label: "Estrutura Organizacional", href: `${SITE.transparencyUrl}/estrutura` },
  { label: "Receitas", href: `${SITE.transparencyUrl}/receitas` },
  { label: "Despesas", href: `${SITE.transparencyUrl}/despesas` },
  { label: "Compras Públicas", href: `${SITE.transparencyUrl}/compras` },
  { label: "Convênios e Acordos", href: `${SITE.transparencyUrl}/convenios-e-acordos` },
  { label: "Obras Públicas", href: `${SITE.transparencyUrl}/obras-publicas` },
  { label: "Avisos e Editais", href: `${SITE.transparencyUrl}/avisos-e-editais` },
  { label: "Legislações", href: `${SITE.transparencyUrl}/legislacoes` },
  { label: "Contas e Orçamento", href: `${SITE.transparencyUrl}/contas-e-orcamento/prestacao_contas` },
  { label: "Recursos Humanos", href: `${SITE.transparencyUrl}/recursos-humanos` },
  { label: "Folha de Pagamento", href: `${SITE.transparencyUrl}/recursos-humanos/folha-de-pagamento` },
  { label: "Dados Abertos", href: `${SITE.transparencyUrl}/dados-abertos` },
  { label: "e-SIC (Acesso à Informação)", href: `${SITE.transparencyUrl}/acesso-a-informacao/esic/solicitacao` },
  { label: "Ouvidoria", href: `${SITE.transparencyUrl}/acesso-a-informacao/ouvidoria/sugestao` },
];

export default function TransparenciaPage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Transparência" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Transparência e Acesso à Informação</h1>
          <p className="text-blue-200 mt-1">Lei nº 12.527/2011 — Lei de Acesso à Informação</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-5xl">
        {/* LAI compliance notice */}
        <div className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="bg-brand-green text-white p-3 rounded-xl flex-shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-brand-green text-lg mb-2">
                Comprometidos com a Transparência Pública
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Em cumprimento à <strong>Lei Federal nº 12.527/2011</strong> (Lei de Acesso à Informação — LAI),
                a Prefeitura Municipal de Feliz Deserto mantém um Portal da Transparência completo,
                disponibilizando ao cidadão informações sobre receitas, despesas, contratos,
                folha de pagamento e demais atos da administração pública.
              </p>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="text-center mb-12">
          <p className="text-gray-600 mb-6 text-lg">
            Acesse o Portal da Transparência da Prefeitura de Feliz Deserto:
          </p>
          <a
            href={SITE.transparencyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand-blue hover:bg-brand-blue-light text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Acessar Portal da Transparência
          </a>
          <p className="text-gray-400 text-sm mt-3">{SITE.transparencyUrl}</p>
        </div>

        {/* Quick links */}
        <h2 className="section-title mb-6">Seções do Portal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {transparencyLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand-blue hover:bg-brand-blue/5 transition-colors group"
            >
              <svg
                className="w-4 h-4 text-brand-green flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-sm font-medium text-gray-700 group-hover:text-brand-blue transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-brand-blue mb-3">e-SIC — Serviço de Informação ao Cidadão</h3>
            <p className="text-gray-600 text-sm mb-4">
              Solicite informações públicas de forma online. Toda solicitação será respondida
              em até 20 dias úteis, conforme previsto na Lei de Acesso à Informação.
            </p>
            <a
              href={`${SITE.transparencyUrl}/acesso-a-informacao/esic/solicitacao`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              Fazer solicitação
            </a>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-brand-blue mb-3">Ouvidoria Municipal</h3>
            <p className="text-gray-600 text-sm mb-4">
              Envie sugestões, reclamações, denúncias ou elogios. A ouvidoria é o canal
              direto entre o cidadão e a administração pública.
            </p>
            <a
              href={`${SITE.transparencyUrl}/acesso-a-informacao/ouvidoria/sugestao`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Acessar Ouvidoria
            </a>
          </div>
        </div>

        {/* Municipality info */}
        <div className="mt-8 p-5 bg-gray-50 rounded-xl text-sm text-gray-500">
          <p><strong>Prefeitura Municipal de Feliz Deserto</strong></p>
          <p>{SITE.address} — {SITE.cityStateZip}</p>
          <p>Telefone: {SITE.phone} | E-mail: {SITE.email}</p>
          <p>Atendimento: {SITE.officeHours}</p>
          <p>CNPJ: {SITE.cnpj}</p>
        </div>
      </div>
    </>
  );
}
