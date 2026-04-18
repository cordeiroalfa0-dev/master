import { Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Calendar, Clock, ArrowRight, Rss } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  slug: string;
  titulo: string;
  resumo: string | null;
  conteudo: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  publicado: boolean;
  publicado_em: string | null;
  autor: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export const STATIC_POSTS: BlogPost[] = [
  { id:"s1", slug:"quanto-custa-automacao-residencial-curitiba", titulo:"Quanto custa automatizar uma casa em Curitiba em 2025?", resumo:"Descubra os valores reais de projetos de automação residencial em Curitiba, desde apartamentos compactos até coberturas de alto padrão.", conteudo:null, meta_title:null, meta_description:null, og_image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format&q=80", publicado:true, publicado_em:"2025-03-10T00:00:00Z", autor:"Master Elétrica", tags:["Residencial"], created_at:"2025-03-10T00:00:00Z", updated_at:"2025-03-10T00:00:00Z" },
  { id:"s2", slug:"automacao-residencial-vs-predial-diferenca", titulo:"Automação residencial x predial: qual a diferença?", resumo:"Entenda as principais diferenças entre automação para casas e para edifícios, quais tecnologias são usadas em cada caso.", conteudo:null, meta_title:null, meta_description:null, og_image:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=450&fit=crop&auto=format&q=80", publicado:true, publicado_em:"2025-02-20T00:00:00Z", autor:"Master Elétrica", tags:["Guia"], created_at:"2025-02-20T00:00:00Z", updated_at:"2025-02-20T00:00:00Z" },
  { id:"s3", slug:"economia-energia-automacao-industrial-curitiba", titulo:"Como a automação industrial reduz custos na sua fábrica", resumo:"Empresas em Curitiba reduziram até 40% nos custos operacionais com automação industrial.", conteudo:null, meta_title:null, meta_description:null, og_image:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop&auto=format&q=80", publicado:true, publicado_em:"2025-01-15T00:00:00Z", autor:"Master Elétrica", tags:["Industrial"], created_at:"2025-01-15T00:00:00Z", updated_at:"2025-01-15T00:00:00Z" },
];

function fmtDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function readTime(conteudo: string | null) {
  if (!conteudo) return "5 min";
  const words = conteudo.trim().split(/\s+/).length;
  return `${Math.max(2, Math.round(words / 200))} min`;
}

export function tagColor(tag: string) {
  const map: Record<string, string> = {
    Residencial:"bg-blue-500/10 text-blue-600", Industrial:"bg-orange-500/10 text-orange-600",
    Predial:"bg-indigo-500/10 text-indigo-600", "Segurança":"bg-red-500/10 text-red-600",
    Tecnologia:"bg-emerald-500/10 text-emerald-600", Guia:"bg-violet-500/10 text-violet-600",
  };
  return map[tag] ?? "bg-primary/10 text-primary";
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  usePageSeo({
    title: "Blog — Master Elétrica Automatizada | Dicas de Automação em Curitiba",
    description: "Artigos, guias e dicas sobre automação residencial, predial e industrial em Curitiba.",
    path: "/blog",
  });

  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("publicado", true).order("publicado_em", { ascending: false })
      .then(
        ({ data }) => { setPosts(data && data.length > 0 ? (data as BlogPost[]) : STATIC_POSTS); setLoading(false); },
        () => { setPosts(STATIC_POSTS); setLoading(false); }
      );
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name:"Início", url:"/" }, { name:"Blog", url:"/blog" }])} />
      <section className="bg-gradient-hero py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center gap-2"><Rss className="h-4 w-4 text-energy" /><span className="text-xs font-bold uppercase tracking-widest text-energy">Blog</span></div>
          <h1 className="mt-3 font-display text-4xl font-bold text-balance md:text-6xl">Dicas e Guias de Automação</h1>
          <p className="mt-4 max-w-2xl text-white/70">Tudo que você precisa saber sobre automação residencial, predial e industrial em Curitiba.</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">{[1,2,3].map(i => (<div key={i} className="rounded-2xl border bg-card shadow-card animate-pulse"><div className="aspect-[16/9] rounded-t-2xl bg-muted"/><div className="p-5 space-y-3"><div className="h-3 w-20 rounded-full bg-muted"/><div className="h-4 w-full rounded bg-muted"/><div className="h-4 w-3/4 rounded bg-muted"/></div></div>))}</div>
        ) : (
          <>
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="group mb-12 flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/20 md:flex-row">
                <div className="aspect-[16/9] overflow-hidden md:aspect-auto md:w-1/2 md:min-h-[300px]">
                  {featured.og_image ? <img src={featured.og_image} alt={featured.titulo} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/> : <div className="h-full w-full bg-gradient-primary flex items-center justify-center"><span className="text-4xl">⚡</span></div>}
                </div>
                <div className="flex flex-1 flex-col justify-center p-8">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-energy/10 px-2.5 py-0.5 text-[11px] font-bold text-energy uppercase tracking-wide">Destaque</span>
                    {featured.tags?.[0] && <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColor(featured.tags[0])}`}>{featured.tags[0]}</span>}
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold leading-snug group-hover:text-primary transition-colors md:text-3xl">{featured.titulo}</h2>
                  {featured.resumo && <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{featured.resumo}</p>}
                  <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4"><span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{fmtDate(featured.publicado_em)}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{readTime(featured.conteudo)}</span></div>
                    <span className="flex items-center gap-1 font-semibold text-primary">Ler artigo <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"/></span>
                  </div>
                </div>
              </Link>
            )}
            {rest.length > 0 && (
              <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                {rest.map(post => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-primary/20">
                    <div className="aspect-[16/9] overflow-hidden bg-gradient-primary">
                      {post.og_image ? <img src={post.og_image} alt={post.titulo} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/> : <div className="h-full w-full flex items-center justify-center"><span className="text-3xl">⚡</span></div>}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap gap-1.5">{post.tags?.slice(0,2).map(tag => <span key={tag} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColor(tag)}`}>{tag}</span>)}</div>
                      <h2 className="mt-3 font-display text-base font-bold leading-snug group-hover:text-primary transition-colors">{post.titulo}</h2>
                      {post.resumo && <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.resumo}</p>}
                      <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-3"><span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>{fmtDate(post.publicado_em)}</span><span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{readTime(post.conteudo)}</span></div>
                        <span className="flex items-center gap-1 font-semibold text-primary">Ler <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1"/></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
