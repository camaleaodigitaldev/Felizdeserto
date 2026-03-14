import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cultura",
  description: "Conheça a cultura e as tradições de Feliz Deserto/AL.",
};

export default function CulturaPage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ label: "Município", href: "/municipio" }, { label: "Cultura" }]} />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">Cultura e Tradições</h1>
          <p className="text-blue-200 mt-1">Feliz Deserto — Alagoas</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-4xl">
        <div className="prose prose-gray max-w-none prose-headings:text-brand-blue">
          <h2>Festas e Eventos Culturais</h2>
          <p>
            Feliz Deserto possui uma rica agenda cultural e religiosa ao longo do ano.
            As principais festividades que marcam o calendário do município são:
          </p>
          <ul>
            <li>
              <strong>Festival do Maçunim</strong> — principal evento cultural do município,
              com mais de 30 edições, celebrando a cultura local com shows, gastronomia e
              a tradicional gincana de pesca de arremesso.
            </li>
            <li>
              <strong>Festa da Padroeira — Nossa Senhora Mãe dos Homens</strong> — celebração
              religiosa de grande importância, reunindo fiéis de todo o estado de Alagoas
              para o novenário e a missa solene em homenagem à padroeira.
            </li>
            <li>
              <strong>Festas Juninas</strong> — forró, quadrilhas e as tradições do Nordeste
              tomam as ruas do município durante o mês de junho.
            </li>
            <li>
              <strong>Carnaval</strong> — celebrado com animação e alegria, respeitando
              as normas de segurança estabelecidas pela gestão municipal.
            </li>
            <li>
              <strong>Aniversário do Município</strong> — comemorado em 07 de agosto,
              data da instalação do município em 1960.
            </li>
          </ul>

          <h2>Gastronomia</h2>
          <p>
            A culinária de Feliz Deserto reflete a riqueza natural da região, com destaque
            para os frutos do mar frescos, especialmente o maçunim (molusco local que dá
            nome ao principal festival do município), além dos pratos típicos nordestinos
            como moqueca, peixe grelhado e mariscos.
          </p>

          <h2>Religiosidade</h2>
          <p>
            A fé é parte fundamental da identidade cultural de Feliz Deserto. A devoção
            a Nossa Senhora Mãe dos Homens atravessa gerações e une a comunidade em
            momentos de celebração e gratidão. Além do catolicismo, o município possui
            uma comunidade evangélica ativa.
          </p>

          <h2>Patrimônio Natural</h2>
          <p>
            As belezas naturais de Feliz Deserto — suas praias, a Mata Atlântica preservada
            e os ecossistemas costeiros — são patrimônios a serem protegidos e valorizados.
            A gestão municipal investe na preservação ambiental e no turismo sustentável
            como pilares de desenvolvimento.
          </p>
        </div>
      </div>
    </>
  );
}
