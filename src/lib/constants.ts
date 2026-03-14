export const SITE = {
  name: "Prefeitura de Feliz Deserto",
  slogan: "Uma Gestão a Serviço do Povo",
  description:
    "Portal oficial da Prefeitura Municipal de Feliz Deserto, Alagoas. Acesse notícias, editais, transparência e serviços municipais.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://felizdeserto.al.gov.br",
  email: "faleconosco@felizdeserto.al.gov.br",
  phone: "(82) 3556-1128",
  address: "Rua Dr. Getúlio Vargas, 32, Centro",
  cityStateZip: "Feliz Deserto/AL — CEP: 57.220-000",
  cnpj: "12.242.020/0001-58",
  officeHours: "Segunda a Sexta, das 07h30 às 13h30",
  instagram: "https://www.instagram.com/prefeituradefelizdeserto/",
  transparencyUrl: "https://www.transparenciafelizdeserto.al.gov.br",
  prefeito: "Jorge Luiz Silva Nunes",
  vicePrefeito: "João Paulo",
};

export const NAV_LINKS = [
  {
    label: "Governo",
    href: "/governo",
    children: [
      { label: "Prefeito", href: "/governo/prefeito" },
      { label: "Vice-Prefeito", href: "/governo/vice-prefeito" },
      { label: "Secretarias", href: "/governo/secretarias" },
    ],
  },
  {
    label: "Município",
    href: "/municipio",
    children: [
      { label: "História", href: "/municipio/historia" },
      { label: "Cultura", href: "/municipio/cultura" },
      { label: "Símbolos", href: "/municipio/simbolos" },
    ],
  },
  { label: "Notícias", href: "/noticias" },
  { label: "Editais", href: "/editais" },
  { label: "Transparência", href: "/transparencia" },
  { label: "Vídeos", href: "/videos" },
  {
    label: "Mais",
    href: "#",
    children: [
      { label: "Telefones Úteis", href: "/telefones-uteis" },
      { label: "Fale Conosco", href: "/fale-conosco" },
    ],
  },
];

export const EDITAL_CATEGORIES: Record<string, string> = {
  licitacao: "Licitação",
  pregao: "Pregão",
  dispensa: "Dispensa",
  inexigibilidade: "Inexigibilidade",
  chamamento_publico: "Chamamento Público",
  concurso_publico: "Concurso Público",
  processo_seletivo: "Processo Seletivo",
  outro: "Outro",
};

export const EDITAL_STATUS_LABELS: Record<string, string> = {
  aberto: "Aberto",
  encerrado: "Encerrado",
  suspenso: "Suspenso",
  anulado: "Anulado",
  homologado: "Homologado",
};

export const EDITAL_STATUS_COLORS: Record<string, string> = {
  aberto: "bg-green-100 text-green-800",
  encerrado: "bg-gray-100 text-gray-800",
  suspenso: "bg-yellow-100 text-yellow-800",
  anulado: "bg-red-100 text-red-800",
  homologado: "bg-blue-100 text-blue-800",
};

export const NEWS_STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  scheduled: "Agendado",
  published: "Publicado",
  archived: "Arquivado",
};

export const NEWS_STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  scheduled: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-red-100 text-red-700",
};

export const ITEMS_PER_PAGE = 12;
