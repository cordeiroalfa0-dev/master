-- ============ BLOG POSTS ============
-- Tabela para CMS de blog SEO (Fase 2)
-- Criada agora para o schema estar pronto antes do admin ser construído

CREATE TABLE public.blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  titulo       TEXT NOT NULL,
  resumo       TEXT,
  conteudo     TEXT,
  meta_title   TEXT,
  meta_description TEXT,
  og_image     TEXT,
  publicado    BOOLEAN NOT NULL DEFAULT false,
  publicado_em TIMESTAMPTZ,
  autor        TEXT DEFAULT 'Master Elétrica',
  tags         TEXT[],
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Posts publicados são visíveis para todos
CREATE POLICY "Public can read published posts"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (publicado = true);

-- Admins podem tudo
CREATE POLICY "Admins can manage blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_publicado ON public.blog_posts(publicado, publicado_em DESC);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING GIN(tags);
