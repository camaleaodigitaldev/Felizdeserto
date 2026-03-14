-- ============================================================
-- SEED: dados iniciais da Prefeitura de Feliz Deserto/AL
-- ============================================================

-- CATEGORIAS DE NOTÍCIAS
insert into news_categories (name, slug, color) values
  ('Gabinete do Prefeito', 'gabinete-do-prefeito', '#1a3a6b'),
  ('Saúde',               'saude',                '#16a34a'),
  ('Educação',            'educacao',             '#f59e0b'),
  ('Obras',               'obras',                '#64748b'),
  ('Eventos',             'eventos',              '#8b5cf6'),
  ('Assistência Social',  'assistencia-social',   '#ec4899'),
  ('Agricultura',         'agricultura',          '#84cc16');

-- SECRETARIAS
insert into secretarias (name, slug, short_name, secretary_name, display_order) values
  ('Secretaria Municipal de Educação',
   'educacao', 'Educação', 'Djalma Barros Siqueira Neto', 1),
  ('Secretaria Municipal de Saúde',
   'saude', 'Saúde', 'José Derival Silva Nunes', 2),
  ('Secretaria Municipal de Assistência Social',
   'assistencia-social', 'Assistência Social', 'Tânia Maria Dias de Melo', 3),
  ('Secretaria Municipal de Administração',
   'administracao', 'Administração', 'José Harry Guedes Santos Jr', 4),
  ('Secretaria Municipal de Finanças',
   'financas', 'Finanças', 'Jeane Valério de Lima', 5),
  ('Secretaria Municipal de Agricultura, Meio Ambiente e Pesca',
   'agricultura-meio-ambiente', 'Agricultura', 'Idelmon Silva Cota', 6),
  ('Secretaria Municipal de Obras e Urbanismo',
   'obras-urbanismo', 'Obras', 'José Horgdys Gomes da Rocha', 7),
  ('Secretaria Municipal de Turismo e Promoção de Eventos',
   'turismo-eventos', 'Turismo', 'Edenilton Soares dos Santos', 8),
  ('Secretaria Municipal de Planejamento, Desenvolvimento e Gestão',
   'planejamento', 'Planejamento', 'Marco Aurélio de Oliveira', 9),
  ('Secretaria Municipal de Esporte e Cultura',
   'esporte-cultura', 'Esporte e Cultura', 'Patrícia Soares de Araújo Lessa', 10);

-- TELEFONES ÚTEIS
insert into useful_phones (category, name, phone, display_order) values
  ('Prefeitura',   'Prefeitura Municipal',          '(82) 3556-1128', 1),
  ('Prefeitura',   'Secretaria de Educação',         '(82) 3556-1213', 2),
  ('Prefeitura',   'Secretaria de Saúde',            '(82) 3556-1106', 3),
  ('Emergência',   'SAMU',                           '192',            4),
  ('Emergência',   'Bombeiros',                      '193',            5),
  ('Emergência',   'Polícia Militar',                '190',            6),
  ('Emergência',   'Defesa Civil',                   '199',            7),
  ('Emergência',   'Central de Emergências',         '911',            8),
  ('Utilidade',    'Ouvidoria',                      '(82) 3556-1128', 9),
  ('Utilidade',    'Procon Alagoas',                 '151',           10);

-- CONFIGURAÇÕES DO SITE
insert into site_settings (key, value, label, setting_group) values
  ('site_name',           'Prefeitura de Feliz Deserto',                'Nome do site',           'geral'),
  ('site_slogan',         'Uma Gestão a Serviço do Povo',               'Slogan',                 'geral'),
  ('site_description',    'Portal oficial da Prefeitura Municipal de Feliz Deserto, Alagoas.', 'Descrição do site', 'geral'),
  ('contact_email',       'faleconosco@felizdeserto.al.gov.br',         'E-mail de contato',      'contato'),
  ('contact_phone',       '(82) 3556-1128',                             'Telefone principal',     'contato'),
  ('address',             'Rua Dr. Getúlio Vargas, 32, Centro',         'Endereço',               'contato'),
  ('city_state_zip',      'Feliz Deserto/AL - CEP: 57.220-000',         'Cidade/Estado/CEP',      'contato'),
  ('office_hours',        'Segunda a Sexta, das 07h30 às 13h30',        'Horário de atendimento', 'contato'),
  ('cnpj',                '12.242.020/0001-58',                         'CNPJ',                   'contato'),
  ('instagram_url',       'https://www.instagram.com/prefeituradefelizdeserto/', 'URL Instagram',  'redes_sociais'),
  ('instagram_handle',    '@prefeituradefelizdeserto',                  'Handle Instagram',       'redes_sociais'),
  ('youtube_url',         '',                                           'URL YouTube',            'redes_sociais'),
  ('facebook_url',        '',                                           'URL Facebook',           'redes_sociais'),
  ('transparency_url',    'https://www.transparenciafelizdeserto.al.gov.br', 'URL Transparência', 'links'),
  ('google_analytics_id', '',                                           'Google Analytics ID',    'analytics'),
  ('instagram_token',     '',                                           'Instagram Access Token', 'integracoes'),
  ('recaptcha_site_key',  '',                                           'reCAPTCHA Site Key',     'integracoes'),
  ('prefeito_name',       'Jorge Luiz Silva Nunes',                     'Nome do Prefeito',       'governo'),
  ('prefeito_partido',    '',                                           'Partido do Prefeito',    'governo'),
  ('prefeito_mandato',    '2025–2028',                                  'Mandato',                'governo'),
  ('vice_prefeito_name',  'João Paulo',                                 'Nome do Vice-Prefeito',  'governo');

-- BANNERS INICIAIS (placeholders)
insert into banners (title, subtitle, image_url, link_url, link_label, display_order) values
  ('Bem-vindo ao Portal de Feliz Deserto',
   'Uma gestão a serviço do povo',
   '/placeholder-banner-1.jpg',
   '/noticias',
   'Ver Notícias',
   1),
  ('Acesse o Portal da Transparência',
   'Informações públicas ao alcance de todos',
   '/placeholder-banner-2.jpg',
   'https://www.transparenciafelizdeserto.al.gov.br',
   'Acessar Portal',
   2),
  ('Editais e Licitações',
   'Confira os processos licitatórios em aberto',
   '/placeholder-banner-3.jpg',
   '/editais',
   'Ver Editais',
   3);
