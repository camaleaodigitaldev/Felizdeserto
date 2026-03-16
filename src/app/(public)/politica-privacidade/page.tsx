import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { SITE } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Saiba como a ${SITE.name} coleta, usa e protege seus dados pessoais, em conformidade com a Lei nº 13.709/2018 (LGPD).`,
};

const LAST_UPDATE = "16 de março de 2026";

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Política de Privacidade" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Política de Privacidade</h1>
          <p className="text-blue-200 mt-1">
            Última atualização: {LAST_UPDATE}
          </p>
        </div>
      </div>

      <div className="container-site py-10">
        <div className="max-w-3xl mx-auto prose prose-sm prose-gray">

          {/* Aviso de conformidade */}
          <div className="not-prose bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 flex gap-3">
            <svg className="w-5 h-5 text-brand-blue mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p className="text-sm text-blue-900 m-0">
              Esta política está em conformidade com a <strong>Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD)</strong> e com as orientações da Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </div>

          {/* 1. Controlador */}
          <Section id="controlador" title="1. Quem é o Controlador dos seus dados?">
            <p>O controlador dos dados pessoais tratados neste site é:</p>
            <InfoBlock rows={[
              ["Órgão", SITE.name],
              ["CNPJ", SITE.cnpj],
              ["Endereço", `${SITE.address} — ${SITE.cityStateZip}`],
              ["Telefone", SITE.phone],
              ["E-mail", SITE.email],
              ["Horário de atendimento", SITE.officeHours],
            ]} />
          </Section>

          {/* 2. Dados coletados */}
          <Section id="dados" title="2. Quais dados coletamos?">
            <SubSection title="2.1 Navegação no site (Analytics)">
              <p>
                Quando você navega neste portal, coletamos — somente com seu consentimento —
                as seguintes informações de forma <strong>pseudonimizada</strong>:
              </p>
              <ul>
                <li>Endereço IP (usado exclusivamente para identificar a localização geográfica aproximada e descartado em seguida)</li>
                <li>Cidade e país de origem da conexão</li>
                <li>Tipo de dispositivo (celular, tablet ou computador)</li>
                <li>Navegador e sistema operacional</li>
                <li>Página acessada e página de origem (referrer)</li>
                <li>Data e horário do acesso</li>
              </ul>
              <p>
                Esses dados são coletados para fins exclusivamente estatísticos e de melhoria do portal.
                Nenhum dado de analytics é vinculado à sua identidade pessoal.
              </p>
            </SubSection>

            <SubSection title="2.2 Formulário Fale Conosco">
              <p>Ao entrar em contato conosco, coletamos:</p>
              <ul>
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone (opcional)</li>
                <li>Assunto e conteúdo da mensagem</li>
              </ul>
              <p>
                Esses dados são usados <strong>exclusivamente para responder à sua solicitação</strong>.
                As mensagens são encaminhadas por e-mail interno e <strong>não são armazenadas em banco de dados</strong>.
              </p>
            </SubSection>

            <SubSection title="2.3 Autenticação de usuários administrativos">
              <p>
                O acesso ao painel administrativo deste portal utiliza cookies de sessão do Supabase.
                Esses cookies são <strong>estritamente necessários</strong> para a autenticação e não rastreiam sua navegação.
              </p>
            </SubSection>

            <SubSection title="2.4 Preferências de acessibilidade">
              <p>
                Salvamos suas preferências de acessibilidade (contraste, tamanho de fonte etc.) no
                armazenamento local do seu navegador (<code>localStorage</code>).
                Esses dados permanecem apenas no seu dispositivo e nunca são enviados a servidores.
              </p>
            </SubSection>
          </Section>

          {/* 3. Base legal */}
          <Section id="base-legal" title="3. Base legal para o tratamento">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border border-gray-200">Finalidade</th>
                  <th className="text-left p-2 border border-gray-200">Base legal (LGPD)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Analytics de navegação", "Art. 7°, I — Consentimento"],
                  ["Atendimento via Fale Conosco", "Art. 7°, V — Execução de contrato ou procedimentos preliminares"],
                  ["Cookies de sessão (admin)", "Art. 7°, II — Cumprimento de obrigação legal ou regulatória"],
                  ["Operação do portal público", "Art. 23 — Tratamento por pessoa jurídica de direito público"],
                ].map(([fin, base]) => (
                  <tr key={fin}>
                    <td className="p-2 border border-gray-200">{fin}</td>
                    <td className="p-2 border border-gray-200 text-brand-blue font-medium">{base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* 4. Compartilhamento */}
          <Section id="terceiros" title="4. Compartilhamento com terceiros">
            <p>
              Para operar este portal, utilizamos os seguintes serviços de terceiros, cada um
              regido por sua própria política de privacidade:
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border border-gray-200">Serviço</th>
                  <th className="text-left p-2 border border-gray-200">Finalidade</th>
                  <th className="text-left p-2 border border-gray-200">Dados acessados</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Supabase (EUA)", "Banco de dados e autenticação", "Dados de navegação (analytics), sessões de admin"],
                  ["Vercel (EUA)", "Hospedagem do portal", "Logs de acesso (IP, headers)"],
                  ["ip-api.com", "Geolocalização por IP", "Endereço IP (somente se consentido)"],
                  ["Resend (EUA)", "Envio de e-mails", "Nome, e-mail, telefone e mensagem do Fale Conosco"],
                ].map(([s, f, d]) => (
                  <tr key={s}>
                    <td className="p-2 border border-gray-200 font-medium">{s}</td>
                    <td className="p-2 border border-gray-200">{f}</td>
                    <td className="p-2 border border-gray-200 text-gray-500">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-sm text-gray-500 mt-2">
              Nenhum dado pessoal é vendido, alugado ou compartilhado com terceiros para fins comerciais.
            </p>
          </Section>

          {/* 5. Retenção */}
          <Section id="retencao" title="5. Por quanto tempo mantemos seus dados?">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-2 border border-gray-200">Categoria</th>
                  <th className="text-left p-2 border border-gray-200">Prazo de retenção</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Dados de analytics (navegação)", "90 dias — excluídos automaticamente após esse período"],
                  ["Mensagens do Fale Conosco", "Encaminhadas por e-mail; não armazenadas em banco de dados"],
                  ["Cookies de sessão (admin)", "Expiram ao fechar o navegador ou após 7 dias de inatividade"],
                  ["Preferências de acessibilidade", "Indefinido — permanecem no seu dispositivo até você limpar os dados do navegador"],
                ].map(([c, p]) => (
                  <tr key={c}>
                    <td className="p-2 border border-gray-200 font-medium">{c}</td>
                    <td className="p-2 border border-gray-200">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          {/* 6. Direitos */}
          <Section id="direitos" title="6. Seus direitos como titular de dados (Art. 18, LGPD)">
            <p>Você tem os seguintes direitos garantidos pela LGPD:</p>
            <ul>
              <li><strong>Confirmação e acesso</strong> — saber se tratamos seus dados e obter uma cópia</li>
              <li><strong>Correção</strong> — solicitar a correção de dados incompletos, inexatos ou desatualizados</li>
              <li><strong>Anonimização, bloqueio ou eliminação</strong> — de dados desnecessários ou excessivos</li>
              <li><strong>Portabilidade</strong> — receber seus dados em formato estruturado</li>
              <li><strong>Revogação do consentimento</strong> — retirar o consentimento a qualquer momento (sem prejuízo de tratamentos anteriores)</li>
              <li><strong>Oposição</strong> — se discordar de algum tratamento realizado</li>
              <li><strong>Informação sobre compartilhamento</strong> — saber com quais entidades seus dados foram compartilhados</li>
            </ul>
            <p>
              Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
              <a href={`mailto:${SITE.email}`} className="text-brand-blue underline">
                {SITE.email}
              </a>{" "}
              ou pelo telefone <strong>{SITE.phone}</strong>.
            </p>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-900 m-0">
                <strong>Revogação de consentimento de cookies:</strong> você pode alterar sua
                preferência de cookies a qualquer momento limpando os dados do navegador
                (<code>localStorage</code>) ou acessando as configurações do seu navegador.
                Ao recarregar a página, o banner de consentimento reaparecerá.
              </p>
            </div>
          </Section>

          {/* 7. Encarregado */}
          <Section id="encarregado" title="7. Encarregado de Dados (DPO)">
            <p>
              Nos termos do Art. 41 da LGPD, a {SITE.name} designa como Encarregado pelo
              Tratamento de Dados Pessoais o responsável pela Secretaria de Administração.
            </p>
            <InfoBlock rows={[
              ["Canal de contato", SITE.email],
              ["Telefone", SITE.phone],
              ["Horário", SITE.officeHours],
            ]} />
            <p className="text-sm text-gray-500">
              O Encarregado atua como canal de comunicação entre os titulares de dados,
              a Prefeitura e a Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </Section>

          {/* 8. Cookies */}
          <Section id="cookies" title="8. Sobre cookies e armazenamento local">
            <SubSection title="Cookies essenciais">
              <p>
                Usados exclusivamente para manter a sessão de usuários administrativos autenticados.
                Não podem ser desativados sem impedir o funcionamento do painel administrativo.
                <strong> Cidadãos que apenas navegam no portal não têm cookies essenciais definidos.</strong>
              </p>
            </SubSection>
            <SubSection title="Cookies de analytics">
              <p>
                Coletam informações sobre como o site é utilizado (páginas visitadas, origem do acesso,
                tipo de dispositivo). São ativados <strong>somente com seu consentimento expresso</strong>.
                Você pode recusar ou revogar a qualquer momento.
              </p>
            </SubSection>
          </Section>

          {/* 9. Alterações */}
          <Section id="alteracoes" title="9. Alterações nesta política">
            <p>
              Esta política pode ser atualizada periodicamente. A data da última atualização é
              sempre indicada no topo desta página. Mudanças significativas serão comunicadas
              por meio de aviso no portal.
            </p>
          </Section>

          {/* CTA */}
          <div className="not-prose mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Tem dúvidas ou deseja exercer seus direitos?</p>
            <Link
              href="/fale-conosco"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
            >
              Entrar em contato
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

/* ── helpers internos ─────────────────────────────────────── */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="not-prose mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="prose prose-sm prose-gray max-w-none">{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      {children}
    </div>
  );
}

function InfoBlock({ rows }: { rows: [string, string][] }) {
  return (
    <div className="not-prose bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 my-3">
      {rows.map(([label, value]) => (
        <div key={label} className="flex px-4 py-2.5 gap-4">
          <span className="text-sm font-medium text-gray-500 w-36 flex-shrink-0">{label}</span>
          <span className="text-sm text-gray-800">{value}</span>
        </div>
      ))}
    </div>
  );
}
