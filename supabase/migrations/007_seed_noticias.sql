-- ============================================================
-- NOTÍCIAS — 10 publicações baseadas em fatos reais (2025)
-- Fontes: felizdeserto.al.gov.br, Tribuna do Sertão,
--         Câmara Municipal de Feliz Deserto, AMA-AL
-- ============================================================

INSERT INTO news (title, slug, summary, body, category_id, status, published_at, tags, meta_title, meta_description)
VALUES

-- 1. POSSE DO PREFEITO
(
  'Jorge Nunes toma posse e inaugura nova era de gestão em Feliz Deserto',
  'jorge-nunes-toma-posse-prefeito-feliz-deserto-2025',
  'Após oito anos como vice-prefeito, Jorge Nunes assume o comando do executivo municipal ao lado do vice João Paulo Cota, prometendo transformação e serviço ao povo.',
  '<p>Com emoção e festa nas ruas do centro histórico, <strong>Jorge Nunes</strong> tomou posse, em 1º de janeiro de 2025, como prefeito de Feliz Deserto — município do Litoral Sul de Alagoas com cerca de 4.800 habitantes. Ao seu lado, o vice-prefeito <strong>João Paulo Cota</strong> também prestou compromisso diante da Câmara Municipal e de centenas de moradores que lotaram o plenário.</p>

<p>Natural do próprio município, Jorge Nunes é servidor público e acumulou oito anos de experiência como vice-prefeito na gestão da ex-prefeita Rosiana Beltrão (2017–2024). Filiado ao PP, ele venceu as eleições de outubro de 2024 com <strong>56,23% dos votos válidos</strong>, derrotando o candidato Douglas Simões (40,90%).</p>

<p>Em seu discurso de posse, Nunes ressaltou o compromisso com a população mais vulnerável e anunciou como prioridades da nova gestão a <strong>melhoria da saúde, educação e infraestrutura urbana</strong>. "Feliz Deserto merece novos tempos e novos rumos. Trabalharemos incansavelmente a serviço do povo", declarou o novo prefeito.</p>

<p>Foram empossados também os vereadores eleitos: Everton Rocha, Gaguinho do Pires, Gil dos Pontes, Jau do Zezinho, Josan Lessa, Lilao, Tânia Melo, Vaqueiro Marruá e Zé Adilson, que formarão a bancada da Câmara Municipal para a legislatura 2025–2028.</p>

<p>A cerimônia contou com a presença de autoridades estaduais, lideranças regionais e representantes de municípios vizinhos, consolidando a expectativa de novos investimentos e parcerias para o município.</p>',
  (SELECT id FROM news_categories WHERE slug = 'gabinete-do-prefeito'),
  'published',
  '2025-01-01 14:00:00+00',
  ARRAY['posse', 'jorge-nunes', 'gestão', 'prefeito', 'feliz-deserto'],
  'Jorge Nunes toma posse como prefeito de Feliz Deserto em 2025',
  'Jorge Nunes assume a prefeitura de Feliz Deserto/AL após vencer as eleições de 2024 com mais de 56% dos votos. Conheça as prioridades da nova gestão.'
),

-- 2. REUNIÃO COM CAIXA ECONÔMICA FEDERAL
(
  'Prefeito Jorge Nunes se reúne com Caixa Econômica Federal para captar investimentos ao município',
  'prefeito-jorge-nunes-reuniao-caixa-economica-federal-investimentos',
  'Gestão municipal busca recursos federais para financiar projetos de infraestrutura, habitação e saneamento básico em Feliz Deserto.',
  '<p>O prefeito <strong>Jorge Nunes</strong> esteve reunido com representantes da gerência e equipe técnica da <strong>Caixa Econômica Federal</strong> para tratar de ações voltadas ao <strong>desenvolvimento sustentável de Feliz Deserto</strong>. A agenda, realizada nos primeiros meses da nova gestão, faz parte de uma estratégia de aproximação com instituições financeiras federais para garantir crédito e recursos ao município.</p>

<p>Entre os temas discutidos estão projetos de habitação popular, saneamento básico, pavimentação e modernização da estrutura administrativa do município. A Caixa é o principal agente operador de programas federais como <strong>Minha Casa Minha Vida</strong> e <strong>Avança Brasil</strong>, fundamentais para municípios de pequeno porte.</p>

<p>"Feliz Deserto tem capacidade de crescer. Estamos buscando todas as oportunidades de recursos disponíveis para transformar a realidade do nosso povo", afirmou Jorge Nunes ao término da reunião.</p>

<p>A prefeitura informou que as tratativas avançam positivamente e que novos encontros estão programados para detalhar os projetos e formalizar possíveis contratos de financiamento. A população será informada à medida que os acordos forem concluídos.</p>',
  (SELECT id FROM news_categories WHERE slug = 'gabinete-do-prefeito'),
  'published',
  '2025-02-10 09:00:00+00',
  ARRAY['caixa-economica', 'investimentos', 'infraestrutura', 'habitação', 'saneamento'],
  'Prefeito de Feliz Deserto busca recursos na Caixa Econômica Federal',
  'Prefeito Jorge Nunes se reúne com a Caixa Econômica Federal para captar investimentos em habitação, saneamento e infraestrutura para Feliz Deserto/AL.'
),

-- 3. CHAMAMENTO PÚBLICO SAÚDE
(
  'Secretaria de Saúde lança chamamento público para fortalecer atenção básica em Feliz Deserto',
  'secretaria-saude-chamamento-publico-cuidados-integrados-feliz-deserto',
  'Edital convida entidades sem fins lucrativos a parceria para execução do Projeto Cuidados Integrados, que visa ampliar o atendimento à população.',
  '<p>A <strong>Secretaria Municipal de Saúde de Feliz Deserto</strong> publicou o <strong>Chamamento Público nº 02/2025</strong>, abrindo processo seletivo para a escolha de entidade privada sem fins lucrativos interessada em formalizar Termo de Colaboração com o município. O objetivo é a execução do <strong>Projeto Cuidados Integrados</strong>, voltado ao fortalecimento da atenção básica e à promoção da saúde preventiva.</p>

<p>O projeto prevê a ampliação de serviços de acompanhamento de pacientes com doenças crônicas, ações de educação em saúde nas comunidades rurais e urbanas, e suporte às equipes da <strong>Estratégia Saúde da Família (ESF)</strong> que atuam no município.</p>

<p>As organizações interessadas devem comprovar experiência na área de saúde pública, equipe técnica qualificada e regularidade fiscal e jurídica. As propostas serão avaliadas pela Comissão de Seleção da Secretaria Municipal de Saúde.</p>

<p>A iniciativa demonstra o compromisso da gestão Jorge Nunes com a universalização do acesso à saúde no município. "Queremos garantir que todo cidadão de Feliz Deserto tenha atendimento de qualidade, especialmente os mais vulneráveis", destacou o secretário de saúde, <strong>José Derival Silva Nunes</strong>.</p>

<p>Documentos e informações adicionais estão disponíveis na sede da Prefeitura, à Rua Dr. Getúlio Vargas, 32, Centro, ou pelo e-mail: <em>cplfelizdeserto.al@outlook.com</em>.</p>',
  (SELECT id FROM news_categories WHERE slug = 'saude'),
  'published',
  '2025-02-20 08:00:00+00',
  ARRAY['saúde', 'atenção-básica', 'chamamento-público', 'ESF', 'cuidados-integrados'],
  'Secretaria de Saúde de Feliz Deserto abre chamamento público para parceria',
  'A Prefeitura de Feliz Deserto/AL abre seleção de entidade para execução do Projeto Cuidados Integrados, fortalecendo a atenção básica no município.'
),

-- 4. FESTIVAL DO MAÇUNIM
(
  '30ª edição do Festival do Maçunim chega com R$ 70 mil em prêmios e programação histórica',
  '30a-edicao-festival-macunim-feliz-deserto-2025',
  'Maior evento de pesca esportiva do Nordeste em premiação retorna em abril com estrutura recorde, atraindo competidores de todo o Brasil.',
  '<p>Feliz Deserto se prepara para receber, nos dias <strong>5 e 6 de abril de 2025</strong>, a <strong>30ª edição do Festival do Maçunim e XXVI Gincana de Pesca de Arremesso</strong> — um evento que ao longo de três décadas se tornou referência nacional no turismo de pesca esportiva. A edição comemorativa promete ser a maior da história, com <strong>mais de R$ 70 mil em prêmios</strong>.</p>

<p>Considerado o <strong>maior evento de pesca esportiva do Nordeste brasileiro</strong> em termos de premiação, estrutura e programação festiva, o festival atrai participantes de todas as regiões do país. Pescadores amadores e profissionais disputam a captura do maçunim — molusco típico das lagoas alagoanas — em competições que exigem técnica, resistência e conhecimento do ambiente.</p>

<p>A programação inclui não apenas as disputas esportivas, mas também shows musicais, barracas de comidas típicas regionais, exposição de artesanato local e atividades culturais que celebram a identidade do povo felizdesertense. A expectativa é de <strong>movimentação de dezenas de milhares de reais</strong> na economia local durante os dois dias de evento.</p>

<p>A prefeitura, por meio da <strong>Secretaria Municipal de Turismo e Promoção de Eventos</strong>, coordena a organização junto a patrocinadores e parceiros. O prefeito Jorge Nunes destacou o papel estratégico do festival: "O Festival do Maçunim é nossa maior vitrine para o mundo. Recebemos visitantes de todo o Brasil e mostramos a riqueza natural e cultural de Feliz Deserto."</p>

<p>As inscrições e demais informações podem ser obtidas na Secretaria de Turismo da Prefeitura Municipal.</p>',
  (SELECT id FROM news_categories WHERE slug = 'turismo-e-eventos'),
  'published',
  '2025-03-15 10:00:00+00',
  ARRAY['festival', 'maçunim', 'pesca', 'turismo', 'evento', 'cultura'],
  '30º Festival do Maçunim 2025 em Feliz Deserto — R$ 70 mil em prêmios',
  'A 30ª edição do Festival do Maçunim acontece em abril de 2025 em Feliz Deserto/AL, com mais de R$ 70 mil em prêmios e estrutura recorde.'
),

-- 5. AUDIÊNCIA PÚBLICA EDUCAÇÃO
(
  'Conselho Municipal de Educação realiza audiência pública para construção do Referencial Curricular',
  'audiencia-publica-referencial-curricular-feliz-deserto-2025',
  'Comunidade escolar, pais e especialistas participam de encontro para definir diretrizes pedagógicas que nortearão a educação municipal pelos próximos anos.',
  '<p>O <strong>Conselho Municipal de Educação de Feliz Deserto</strong> realizou Audiência Pública para receber contribuições da sociedade civil ao <strong>Referencial Curricular Municipal</strong> — documento que estabelecerá as bases pedagógicas das escolas da rede pública nas próximas gestões. O encontro, aberto a toda a comunidade, reuniu professores, diretores, pais de alunos, estudantes e técnicos da Secretaria de Educação.</p>

<p>O Referencial Curricular é um instrumento fundamental para garantir a qualidade do ensino. Alinhado à <strong>Base Nacional Comum Curricular (BNCC)</strong>, o documento deve adaptar as diretrizes nacionais à realidade cultural, histórica e social de Feliz Deserto, valorizando as especificidades do litoral sul alagoano.</p>

<p>Durante o evento, grupos de trabalho debateram temas como <strong>educação ambiental e sustentabilidade</strong>, <strong>valorização da cultura local</strong> (incluindo a pesca artesanal e o maçunim), <strong>alfabetização na idade certa</strong> e <strong>educação inclusiva</strong> para estudantes com deficiência.</p>

<p>O secretário municipal de educação, <strong>Djalma Barros Siqueira Neto</strong>, ressaltou a importância da participação popular: "Um currículo que não escuta a comunidade é um currículo vazio. Queremos que as vozes dos nossos professores e famílias estejam na base de cada decisão pedagógica."</p>

<p>As contribuições coletadas na audiência serão sistematizadas pelo Conselho Municipal e incorporadas à versão final do documento, que passará por aprovação formal antes de entrar em vigor nas escolas do município.</p>',
  (SELECT id FROM news_categories WHERE slug = 'educacao'),
  'published',
  '2025-04-02 09:00:00+00',
  ARRAY['educação', 'currículo', 'BNCC', 'audiência-pública', 'escola'],
  'Audiência pública define Referencial Curricular de Feliz Deserto',
  'Conselho Municipal de Educação de Feliz Deserto realiza audiência pública para construção participativa do Referencial Curricular Municipal.'
),

-- 6. CRECHE CRIA
(
  'Feliz Deserto recebe 78ª Creche Cria e abre 100 vagas para crianças de 0 a 3 anos',
  'creche-cria-78-feliz-deserto-agosto-2025',
  'Em parceria com o Governo de Alagoas, a prefeitura entrega unidade moderna que atenderá famílias da zona urbana e garante acesso à educação infantil de qualidade.',
  '<p>Feliz Deserto ganhou, no dia <strong>19 de agosto de 2025</strong>, sua primeira unidade do programa <strong>Creche Cria</strong> — a 78ª entregue pelo Governo de Alagoas em todo o estado. A solenidade de inauguração contou com a presença do governador <strong>Paulo Dantas</strong>, do prefeito <strong>Jorge Nunes</strong> e de centenas de famílias que aguardavam ansiosamente pela estrutura.</p>

<p>A nova creche dispõe de salas de aula climatizadas, área de recreação coberta, refeitório, banheiros adaptados e cozinha equipada, oferecendo <strong>100 vagas em período integral</strong> para crianças de 0 a 3 anos. A unidade integra a política estadual de universalização da educação infantil, que prevê a entrega de <strong>200 creches até 2026</strong>, gerando 40 mil novas vagas em Alagoas e aproximadamente 8 mil empregos diretos.</p>

<p>O governador Paulo Dantas destacou o impacto social do programa: "Hoje estamos abrindo praticamente 16 mil vagas de creche em todo o estado de Alagoas. Isso é investir no futuro de Alagoas, é cuidar das crianças e liberar mães para trabalhar e estudar."</p>

<p>O prefeito Jorge Nunes celebrou a entrega com emoção: "Essa creche era o sonho de muitas mães e pais de Feliz Deserto. Agradeço ao governador pela parceria e reafirmo nosso compromisso de zelar por cada criança deste município."</p>

<p>As matrículas serão realizadas pela <strong>Secretaria Municipal de Educação</strong>. Prioridade será dada a crianças em situação de vulnerabilidade social e filhos de mães trabalhadoras.</p>',
  (SELECT id FROM news_categories WHERE slug = 'educacao'),
  'published',
  '2025-08-19 12:00:00+00',
  ARRAY['creche', 'educação-infantil', 'creche-cria', 'obras', 'governo-alagoas'],
  'Feliz Deserto recebe Creche Cria com 100 vagas para a primeira infância',
  'A 78ª Creche Cria é entregue em Feliz Deserto/AL, oferecendo 100 vagas para crianças de 0 a 3 anos e fortalecendo a educação infantil no município.'
),

-- 7. MINHA CIDADE LINDA / PAVIMENTAÇÃO
(
  'Minha Cidade Linda leva 6,5 km de pavimentação e nova cara às ruas de Feliz Deserto',
  'minha-cidade-linda-pavimentacao-feliz-deserto-agosto-2025',
  'Programa do Governo de Alagoas investe R$ 3,7 milhões em calçamento, drenagem e sinalização no Conjunto Divaldo Suruagy 2, beneficiando centenas de famílias.',
  '<p>Cerca de <strong>40 ruas do Conjunto Divaldo Suruagy 2</strong>, em Feliz Deserto, foram transformadas pelo programa <strong>Minha Cidade Linda</strong>, do Governo do Estado de Alagoas. Entregues em <strong>19 de agosto de 2025</strong>, as obras de pavimentação somam <strong>6,5 km de calçamento em paralelepípedo</strong>, com sistema de drenagem pluvial, sinalização vertical e horizontal e passeios públicos acessíveis, representando um investimento de <strong>R$ 3,7 milhões</strong> do Tesouro Estadual.</p>

<p>As intervenções foram realizadas em ruas que, até então, eram de terra batida — causa frequente de alagamentos no período de chuvas e de poeira excessiva na estiagem, comprometendo a mobilidade e a saúde dos moradores. Com a pavimentação, o trânsito de veículos e pedestres foi significativamente melhorado.</p>

<p>O secretário especial de Obras da Setrand, <strong>Alcides Tenório</strong>, destacou o alcance da ação: "Quando se investe em infraestrutura, há uma melhoria na mobilidade urbana como um todo, transformando a qualidade de vida da população. Feliz Deserto é um exemplo de como o programa pode mudar o cotidiano das pessoas."</p>

<p>Moradores do conjunto comemoraram as entregas. "Antes, minha rua era um lamaçal na chuva. Hoje posso sair de casa com dignidade", disse uma moradora durante a solenidade.</p>

<p>O prefeito Jorge Nunes afirmou que a parceria com o Governo Estadual continua ativa: "Vamos seguir buscando recursos para urbanizar cada canto de Feliz Deserto. Nenhum bairro ficará de fora."</p>',
  (SELECT id FROM news_categories WHERE slug = 'obras'),
  'published',
  '2025-08-19 14:00:00+00',
  ARRAY['pavimentação', 'obras', 'minha-cidade-linda', 'infraestrutura', 'urbanismo'],
  'Programa Minha Cidade Linda entrega 6,5 km de pavimentação em Feliz Deserto',
  'O programa Minha Cidade Linda pavimenta 40 ruas no Conjunto Divaldo Suruagy 2 em Feliz Deserto/AL, com R$ 3,7 milhões investidos em infraestrutura urbana.'
),

-- 8. GINÁSIO POLIESPORTIVO
(
  'Ginásio Poliesportivo Laércio Barreto dos Santos é requalificado e devolvido à comunidade',
  'ginasio-poliesportivo-laercio-barreto-reforma-feliz-deserto-2025',
  'Com investimento de R$ 476 mil em convênio entre Estado e Município, equipamento esportivo recebe reforma ampla e passa a oferecer espaço moderno para esporte e cultura.',
  '<p>O <strong>Ginásio Poliesportivo Laércio Barreto dos Santos</strong>, em Feliz Deserto, foi reinaugurado em <strong>19 de agosto de 2025</strong> após extensa reforma financiada por convênio entre o <strong>Governo do Estado de Alagoas</strong> e a <strong>Prefeitura Municipal</strong>. O investimento total ultrapassou <strong>R$ 476 mil</strong> e proporcionou melhorias estruturais, de segurança e conforto ao espaço, que é referência para o esporte e o lazer da população.</p>

<p>As obras incluíram recuperação da cobertura, reforma do piso esportivo, adequação das instalações elétricas e hidráulicas, pintura geral, instalação de banheiros acessíveis e modernização do sistema de iluminação. O resultado é um ginásio que atende às normas técnicas para a prática de <strong>futsal, vôlei, basquete e handebol</strong>, além de poder sediar eventos culturais e festividades.</p>

<p>A reforma consolida o ginásio como polo esportivo e educacional para estudantes da rede pública e atletas do município. "Esse ginásio vai muito além do esporte. Ele é um espaço de formação de caráter, de disciplina, de cidadania para a nossa juventude", afirmou o prefeito <strong>Jorge Nunes</strong>.</p>

<p>O governador <strong>Paulo Dantas</strong> reforçou o compromisso estadual com a qualidade de vida nos municípios: "Investir em estrutura esportiva é investir em saúde, em educação e em segurança pública. Quando o jovem está na quadra, está fora das ruas."</p>

<p>A Secretaria Municipal de Esporte e Cultura já planeja uma programação regular de atividades físicas, escolinhas esportivas e competições interescolares para movimentar o espaço ao longo do ano.</p>',
  (SELECT id FROM news_categories WHERE slug = 'obras'),
  'published',
  '2025-08-19 15:30:00+00',
  ARRAY['ginásio', 'esporte', 'reforma', 'obras', 'juventude', 'lazer'],
  'Ginásio Poliesportivo de Feliz Deserto é reformado com R$ 476 mil',
  'O Ginásio Poliesportivo Laércio Barreto dos Santos em Feliz Deserto/AL é requalificado com R$ 476 mil em convênio entre Estado e Município.'
),

-- 9. XXV MARCHA A BRASÍLIA
(
  'Prefeito Jorge Nunes participa da Marcha a Brasília em Defesa dos Municípios',
  'marcha-brasilia-defesa-municipios-jorge-nunes-feliz-deserto-2025',
  'Gestão municipal marca presença no principal encontro de prefeitos do país para reivindicar mais recursos e autonomia para os municípios brasileiros.',
  '<p>O prefeito de Feliz Deserto, <strong>Jorge Nunes</strong>, participou da <strong>Marcha a Brasília em Defesa dos Municípios</strong> — o maior evento de mobilização política de prefeitos e vereadores do Brasil, organizado pela <strong>Confederação Nacional de Municípios (CNM)</strong>. Representando os interesses da população felizdesertense, o prefeito integrou a delegação alagoana que esteve na capital federal ao lado de gestores de todo o país.</p>

<p>O evento reuniu milhares de prefeitos para reivindicar junto ao Congresso Nacional e ao governo federal pautas urgentes para os municípios, como o <strong>reequilíbrio das transferências do Fundo de Participação dos Municípios (FPM)</strong>, o fortalecimento do Sistema Único de Saúde (SUS) no âmbito local, recursos para habitação e saneamento básico, e maior participação municipal nas receitas da União.</p>

<p>Durante a marcha, o prefeito Jorge Nunes participou de reuniões com parlamentares alagoanos e representantes de ministérios, apresentando projetos e demandas específicas de Feliz Deserto. "Vim a Brasília com a responsabilidade de cada família do nosso município. Precisamos de mais recursos para continuar transformando a realidade do nosso povo", declarou Nunes.</p>

<p>A Marcha é também um espaço de formação e troca de experiências entre gestores. A presença de Feliz Deserto no evento reforça o compromisso da atual administração com a articulação política necessária para viabilizar investimentos e projetos estruturantes para o município.</p>',
  (SELECT id FROM news_categories WHERE slug = 'gabinete-do-prefeito'),
  'published',
  '2025-05-28 11:00:00+00',
  ARRAY['brasília', 'marcha', 'municípios', 'FPM', 'política', 'jorge-nunes'],
  'Prefeito de Feliz Deserto participa da Marcha em Defesa dos Municípios',
  'Jorge Nunes representa Feliz Deserto/AL na Marcha a Brasília em Defesa dos Municípios, reivindicando mais recursos e autonomia para os gestores locais.'
),

-- 10. RODOVIA INCOCO
(
  'Nova rodovia de acesso à Incoco fortalece economia e gera empregos em Feliz Deserto',
  'rodovia-incoco-inauguracao-feliz-deserto-dezembro-2025',
  'Investimento de R$ 4,4 milhões pelo programa Alagoas de Ponta a Ponta conecta o centro da cidade à maior indústria local, beneficiando 550 trabalhadores diretos e indiretos.',
  '<p>Feliz Deserto ganhou, em <strong>17 de dezembro de 2025</strong>, uma nova e moderna rodovia que conecta o centro urbano do município à <strong>Indústria Incoco de Beneficiamento de Coco</strong>, pela BR-349 (antiga AL-101 Sul). A obra, inaugurada pelo governador <strong>Paulo Dantas</strong> ao lado do prefeito <strong>Jorge Nunes</strong>, é fruto do programa <strong>Alagoas de Ponta a Ponta</strong> e representa um investimento de <strong>R$ 4,4 milhões</strong>, com uma pista nova de aproximadamente <strong>2 km de extensão</strong>.</p>

<p>A Incoco é um dos maiores empregadores do município, responsável por <strong>150 empregos diretos</strong> e mais de <strong>400 empregos indiretos</strong>, movimentando a cadeia produtiva do coco no Litoral Sul alagoano. A nova rodovia melhora significativamente a logística de escoamento da produção, reduz custos operacionais e aumenta a segurança viária para os trabalhadores que acessam a fábrica diariamente.</p>

<p>O governador Paulo Dantas destacou o impacto econômico da obra: "Infraestrutura de qualidade atrai investimento, gera empregos e melhora a vida das pessoas. Essa rodovia é um presente para os trabalhadores de Feliz Deserto e para a economia do município."</p>

<p>O prefeito Jorge Nunes celebrou a entrega e contextualizou o conjunto de obras realizadas: "Estamos comemorando a grande obra de hoje, mas não podemos nos esquecer da Creche Cria, do Ginásio e do Minha Cidade Linda que o Governo de Alagoas nos deu. Juntos, estamos construindo um Feliz Deserto melhor."</p>

<p>A rodovia também beneficia produtores rurais da região, que passam a ter um acesso mais rápido e seguro para o escoamento de outros produtos agrícolas cultivados no entorno.</p>',
  (SELECT id FROM news_categories WHERE slug = 'agricultura'),
  'published',
  '2025-12-17 13:00:00+00',
  ARRAY['rodovia', 'incoco', 'coco', 'agricultura', 'infraestrutura', 'empregos', 'economia'],
  'Nova rodovia acessa Incoco e fortalece economia em Feliz Deserto/AL',
  'Investimento de R$ 4,4 milhões inaugura rodovia que conecta Feliz Deserto à Indústria Incoco, gerando logística e 550 empregos no município alagoano.'
);
