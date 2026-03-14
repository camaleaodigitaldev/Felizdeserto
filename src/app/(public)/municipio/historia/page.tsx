import Breadcrumbs from "@/components/layout/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "História do Município",
  description: "Conheça a história de Feliz Deserto, município do litoral sul de Alagoas.",
};

export default function HistoriaPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { label: "Município", href: "/municipio" },
          { label: "História" },
        ]}
      />

      <div className="page-header">
        <div className="container-site">
          <h1 className="text-3xl font-bold">História do Município</h1>
          <p className="text-blue-200 mt-1">Feliz Deserto — Alagoas</p>
        </div>
      </div>

      <div className="container-site py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {[
            { label: "População", value: "≈ 4.714 hab." },
            { label: "Área", value: "91,824 km²" },
            { label: "Distância de Maceió", value: "118 km" },
            { label: "Emancipação", value: "07/08/1960" },
          ].map((item) => (
            <div key={item.label} className="bg-brand-blue/5 border border-brand-blue/10 rounded-xl p-5 text-center">
              <p className="text-2xl font-bold text-brand-blue">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-gray max-w-none prose-headings:text-brand-blue prose-a:text-brand-blue">
          <h2>Origens e Formação</h2>
          <p>
            Feliz Deserto é um município do estado de Alagoas, localizado no litoral sul do estado,
            inserido na zona da Mata Atlântica. Com uma área de 91,824 km² e população aproximada
            de 4.714 habitantes, o município fica a 118 quilômetros da capital Maceió.
          </p>
          <p>
            A história de Feliz Deserto remonta ao período colonial, quando a região era habitada
            pelos índios Caetés. A tradição local conta que um naufrágio envolvendo um
            holandês chamado Domingo Mendes teria influenciado os primeiros passos da ocupação
            do território.
          </p>
          <p>
            Um dos marcos culturais e religiosos mais importantes do município é a devoção
            a <strong>Nossa Senhora Mãe dos Homens</strong>, padroeira do município. A tradição
            conta que uma imagem sagrada foi encontrada na região, tornando-se centro de
            peregrinação e fé para os moradores locais e de municípios vizinhos.
          </p>

          <h2>Emancipação Política</h2>
          <p>
            O município de Feliz Deserto foi criado pela <strong>Lei Estadual nº 2.266, de 23 de julho de 1960</strong>,
            tendo sua instalação oficial em <strong>07 de agosto de 1960</strong> — data que é
            celebrada anualmente como o aniversário do município.
          </p>

          <h2>Características Geográficas</h2>
          <p>
            Feliz Deserto está inserido no bioma de Mata Atlântica, com clima tropical litorâneo
            úmido, caracterizado por temperaturas amenas e chuvas bem distribuídas ao longo do ano.
            A região possui belezas naturais significativas, incluindo praias e ecossistemas de
            restinga que atraem visitantes.
          </p>

          <h2>Turismo</h2>
          <p>
            As principais atrações turísticas do município incluem a <strong>Praia do Maçunim</strong>
            e as <strong>Flexeiras</strong>, reconhecidas pela beleza natural e pela tranquilidade
            que oferecem aos visitantes. O município realiza anualmente o <strong>Festival do Maçunim</strong>,
            que já chegou à sua 30ª edição, além de festas juninas, Carnaval, gincana de pesca e
            a tradicional <strong>Festa da Padroeira</strong> em homenagem a Nossa Senhora Mãe dos Homens.
          </p>

          <h2>Dados do Município</h2>
          <ul>
            <li><strong>Nome:</strong> Feliz Deserto</li>
            <li><strong>Estado:</strong> Alagoas (AL)</li>
            <li><strong>Região:</strong> Leste alagoano / Litoral Sul</li>
            <li><strong>Bioma:</strong> Mata Atlântica</li>
            <li><strong>Data de emancipação:</strong> 07/08/1960</li>
            <li><strong>Lei de criação:</strong> Lei Estadual nº 2.266/1960</li>
            <li><strong>CNPJ:</strong> 12.242.020/0001-58</li>
          </ul>
        </div>
      </div>
    </>
  );
}
