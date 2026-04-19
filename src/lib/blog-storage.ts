import { BlogPost, STATIC_POSTS } from "@/pages/BlogPage";

const BLOG_STORAGE_KEY = "master_blog_posts";

export function getLocalPosts(): BlogPost[] {
  try {
    const stored = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!stored) {
      // Se não houver nada no localStorage, inicializa com os posts estáticos
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(STATIC_POSTS));
      return STATIC_POSTS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Erro ao ler posts do localStorage:", error);
    return STATIC_POSTS;
  }
}

export function saveLocalPosts(posts: BlogPost[]) {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Erro ao salvar posts no localStorage:", error);
  }
}

export function getPublicPosts(): BlogPost[] {
  return getLocalPosts().filter(p => p.publicado).sort((a, b) => {
    const dateA = new Date(a.publicado_em || a.created_at).getTime();
    const dateB = new Date(b.publicado_em || b.created_at).getTime();
    return dateB - dateA;
  });
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getLocalPosts().find(p => p.slug === slug);
}
