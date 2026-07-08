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
  brasaoUrl:
    "https://desohrdjqujmmplawntj.supabase.co/storage/v1/object/public/banners/c7b85a93-37ad-42ef-8c30-04d67014d40d/1783469035682-u4rcz85vaws.png",
  bandeiraUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Bandeira_de_Feliz_Deserto_Alagoas.png/1920px-Bandeira_de_Feliz_Deserto_Alagoas.png",
};

export const NAV_LINKS = [
  {
    label: "Governo",
    href: "/governo",
    children: [
      { label: "Prefeito", href: "/governo/prefeito" },
      { label: "Vice-Prefeito", href: "/governo/vice-prefeito" },
    ],
  },
  // "Secretarias" é inserida dinamicamente no Header após "Governo"
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
  { label: "Documentos", href: "/documentos" },
  { label: "Transparência", href: "/transparencia" },
  { label: "Vídeos", href: "/videos" },
  {
    label: "Fale Conosco",
    href: "/fale-conosco",
    children: [
      { label: "Fale Conosco", href: "/fale-conosco" },
      { label: "Telefones Úteis", href: "/telefones-uteis" },
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

export const DOCUMENT_CATEGORIES: Record<string, { label: string; color: string; bg: string }> = {
  diario_oficial:   { label: "Diário Oficial",       color: "text-blue-800",   bg: "bg-blue-100"   },
  lei:              { label: "Lei Municipal",         color: "text-indigo-800", bg: "bg-indigo-100" },
  decreto:          { label: "Decreto",               color: "text-purple-800", bg: "bg-purple-100" },
  portaria:         { label: "Portaria",              color: "text-orange-800", bg: "bg-orange-100" },
  prestacao_contas: { label: "Prestação de Contas",   color: "text-green-800",  bg: "bg-green-100"  },
  resolucao:        { label: "Resolução",             color: "text-teal-800",   bg: "bg-teal-100"   },
  convenio:         { label: "Convênio",              color: "text-sky-800",    bg: "bg-sky-100"    },
  contrato:         { label: "Contrato",              color: "text-rose-800",   bg: "bg-rose-100"   },
  ata:              { label: "Ata de Reunião",        color: "text-amber-800",  bg: "bg-amber-100"  },
  outro:            { label: "Outros",                color: "text-gray-800",   bg: "bg-gray-100"   },
};
