-- ============================================================
-- DOCUMENTOS INSTITUCIONAIS
-- Diário Oficial, Leis, Decretos, Portarias, Prestação de Contas, etc.
-- ============================================================

CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  number          TEXT,
  category        TEXT NOT NULL DEFAULT 'outro',
  description     TEXT,
  file_url        TEXT,
  file_name       TEXT,
  published_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  published_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_category      ON documents(category);
CREATE INDEX idx_documents_published     ON documents(published_date DESC) WHERE is_active = TRUE;
CREATE INDEX idx_documents_year          ON documents(EXTRACT(YEAR FROM published_date)::INTEGER);
CREATE INDEX idx_documents_search        ON documents USING GIN(
  TO_TSVECTOR('portuguese', title || ' ' || COALESCE(number, '') || ' ' || COALESCE(description, ''))
);

-- RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read documents"  ON documents FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Staff manage documents" ON documents FOR ALL USING (is_staff());

COMMENT ON TABLE  documents                IS 'Documentos institucionais: Diário Oficial, Leis, Decretos, etc.';
COMMENT ON COLUMN documents.category      IS 'diario_oficial | lei | decreto | portaria | prestacao_contas | resolucao | convenio | contrato | ata | outro';
COMMENT ON COLUMN documents.published_date IS 'Data de publicação/emissão do documento';
