-- Supabase Schema para Portfolio
-- Execute este SQL no SQL Editor do Supabase

-- ============================================
-- EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELAS
-- ============================================

-- Perfil
CREATE TABLE profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    email TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    image_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Experiências
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    logo_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilidades
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = TRUE;
CREATE INDEX idx_experience_display_order ON experience(display_order);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_display_order ON skills(display_order);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Políticas: SELECT público apenas
CREATE POLICY "Public read access" ON profile FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON experience FOR SELECT USING (TRUE);
CREATE POLICY "Public read access" ON skills FOR SELECT USING (TRUE);

-- ============================================
-- TRIGGER PARA updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DADOS INICIAIS (Seed)
-- ============================================

-- Profile
INSERT INTO profile (name, role, bio, location, email, github_url, linkedin_url) VALUES (
    'Cadu Romanow',
    'Dados, Código e Sistemas',
    'Transformo problemas confusos em estruturas que fazem sentido — através de dados, código e sistemas.',
    'São Paulo, Brasil',
    'caduromanow@gmail.com',
    'https://github.com/caduhroman',
    'https://www.linkedin.com/in/carlos-eduardo-romanow-silva-076260281/'
);

-- Projects
INSERT INTO projects (title, description, long_description, technologies, github_url, demo_url, image_url, featured, display_order) VALUES
(
    'Projeto principal',
    'Dados → transformação → decisão.',
    'Pipeline completo de dados: extração de múltiplas fontes, transformação e modelagem dimensional, carga em Data Warehouse e visualização em dashboards executivos para apoio à decisão.',
    ARRAY['Python', 'SQL', 'PostgreSQL', 'dbt', 'Power BI'],
    'https://github.com/caduhroman/projeto-principal',
    NULL,
    NULL,
    TRUE,
    1
),
(
    'Projeto de automação',
    'Menos trabalho repetitivo. Mais sistema.',
    'Automação de processos manuais de consolidação de dados entre sistemas legados e ERPs. Redução de 80% no tempo de fechamento mensal através de scripts de ETL agendados e validações automáticas.',
    ARRAY['Python', 'Automação', 'BI', 'ETL', 'Excel/VBA'],
    'https://github.com/caduhroman/automacao-processos',
    NULL,
    NULL,
    TRUE,
    2
),
(
    'Projeto experimental',
    'Uma ideia transformada em software.',
    'Projeto pessoal de experimentação com arquitetura de microsserviços, mensageria assíncrona e deploy automatizado. Foco em aprendizado de padrões de resiliência e observabilidade.',
    ARRAY['Go', 'Docker', 'Kubernetes', 'RabbitMQ', 'Prometheus'],
    'https://github.com/caduhroman/projeto-experimental',
    NULL,
    NULL,
    FALSE,
    3
);

-- Experience
INSERT INTO experience (company, role, description, start_date, end_date, technologies, logo_url, display_order) VALUES
(
    'Grupo Maringá',
    'Analista de Dados / Desenvolvedor',
    'Análise de dados, desenvolvimento de dashboards e automação de processos para apoiar decisões e operações. Trabalho com extração, transformação e visualização de dados, construção de indicadores e soluções que conectam sistemas e equipes.',
    '2025-09-01',
    NULL,
    ARRAY['Power BI', 'SQL', 'Excel / VBA', 'Automação de processos', 'Dashboards e indicadores', 'ERP', 'Desenvolvimento de soluções'],
    NULL,
    1
);

-- Skills
INSERT INTO skills (category, name, display_order) VALUES
('Dados', 'SQL', 1),
('Dados', 'Power BI', 2),
('Dados', 'ETL', 3),
('Dados', 'Análise', 4),
('Dados', 'Modelagem dimensional', 5),
('Código', 'Python', 1),
('Código', 'APIs', 2),
('Código', 'Automação', 3),
('Código', 'Scripting', 4),
('Sistemas', 'Modelagem', 1),
('Sistemas', 'Integração', 2),
('Sistemas', 'Processos', 3);

-- ============================================
-- STORAGE BUCKET (execute no Storage do Supabase)
-- ============================================
-- Criar bucket 'portfolio-images' como público
-- Pastas sugeridas:
--   projects/
--   experience/
--   profile/
--
-- Políticas de storage (executar no SQL Editor):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', TRUE);
--
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
-- CREATE POLICY "Authenticated write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated update" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated delete" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');