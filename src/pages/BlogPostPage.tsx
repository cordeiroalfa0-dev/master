import { useParams, Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { ArrowLeft, Calendar, Clock, Phone, User, Tag } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { BlogPost, readTime, tagColor } from "./BlogPage";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";
import { LeadForm } from "@/components/LeadForm";
import { useEffect, useState } from "react";
import { getPostBySlug } from "@/lib/blog-storage";

// ── Renderer de markdown simples ──────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let key = 0;

  function flushList() {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={key++} className="my-4 ml-5 space-y-1.5 list-disc">
        {listBuffer.map((item, i) => (
          <li key={i} className="text-[15px] leading-relaxed text-foreground/80">{parseLine(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  }

  function parseLine(text: string): React.ReactNode {
    const parts = text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((p, i) => {
      if (p.startsWith("***") && p.endsWith("***")) return <strong key={i} className="font-semibold italic">{p.slice(3, -3)}</strong>;
      if (p.startsWith("**") && p.endsWith("**")) return <strong key={i} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
      if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>;
      if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary">{p.slice(1, -1)}</code>;
      return p;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("# ")) {
      flushList();
      elements.push(<h1 key={key++} className="mt-8 mb-4 font-display text-3xl font-bold">{parseLine(line.slice(2))}</h1>);
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={key++} className="mt-8 mb-3 font-display text-2xl font-bold border-b pb-2">{parseLine(line.slice(3))}</h2>);
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={key++} className="mt-6 mb-2 font-display text-xl font-bold text-primary">{parseLine(line.slice(4))}</h3>);
    } else if (line.startsWith("#### ")) {
      flushList();
      elements.push(<h4 key={key++} className="mt-4 mb-2 font-semibold text-base">{parseLine(line.slice(5))}</h4>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2));
    } else if (/^\d+\. /.test(line)) {
      flushList();
      const match = line.match(/^(\d+)\. (.+)/);
      if (match) {
        elements.push(
          <div key={key++} className="flex gap-3 my-2">
            <span className="shrink-0 grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{match[1]}</span>
            <p className="text-[15px] leading-relaxed text-foreground/80 pt-0.5">{parseLine(match[2])}</p>
          </div>
        );
      }
    } else if (line.startsWith("> ")) {
      flushList();
      elements.push(
        <blockquote key={key++} className="my-5 border-l-4 border-energy pl-5 py-1 bg-energy/5 rounded-r-lg">
          <p className="text-[15px] italic text-foreground/75">{parseLine(line.slice(2))}</p>
        </blockquote>
      );
    } else if (line.trim() === "" || line.trim() === "---") {
      flushList();
      if (line.trim() === "---") elements.push(<hr key={key++} className="my-8 border-border"/>);
    } else if (line.trim() !== "") {
      flushList();
      elements.push(<p key={key++} className="my-3 text-[15px] leading-relaxed text-foreground/80">{parseLine(line)}</p>);
    }
  }
  flushList();
  return <>{elements}</>;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  usePageSeo({
    title: post ? `${post.titulo} | Master Elétrica` : "Artigo — Master Elétrica",
    description: post?.resumo ?? post?.meta_description ?? "",
    path: `/blog/${slug}`,
    image: post?.og_image ?? undefined,
  });

  useEffect(() => {
    if (!slug) return;
    const localPost = getPostBySlug(slug);
    setPost(localPost ?? null);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-72 rounded-2xl bg-muted" />
          <div className="mx-auto max-w-3xl space-y-3 pt-8">
            <div className="h-6 w-2/3 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Artigo não encontrado</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">Ver todos os artigos</Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative h-72 md:h-[420px]">
          {post.og_image ? (
            <img src={post.og_image} alt={post.titulo} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-hero flex items-center justify-center">
              <span className="text-6xl">⚡</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060c22]/95 via-[#060c22]/50 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-4xl px-4 pb-10 md:px-6">
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Blog
              </Link>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {post.tags?.map(tag => (
                  <span key={tag} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColor(tag)}`}>{tag}</span>
                ))}
              </div>
              <h1 className="font-display text-2xl font-bold text-white text-balance md:text-4xl lg:text-5xl">{post.titulo}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/45">
                {post.autor && <span className="flex items-center gap-1"><User className="h-3 w-3"/>{post.autor}</span>}
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>
                  {new Date(post.publicado_em ?? post.created_at).toLocaleDateString("pt-BR", { day:"2-digit", month:"long", year:"numeric" })}
                </span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{readTime(post.conteudo)} de leitura</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px]">
          <article>
            {post.resumo && (
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground border-l-4 border-primary pl-5 py-1 bg-primary/5 rounded-r-lg">
                {post.resumo}
              </p>
            )}
            {post.conteudo ? (
              <MarkdownContent content={post.conteudo} />
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <p>Conteúdo deste artigo será publicado em breve.</p>
                <Link to="/blog" className="mt-3 inline-block text-primary hover:underline">Ver outros artigos</Link>
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center gap-2 border-t pt-6">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map(tag => (
                  <span key={tag} className={`rounded-full px-3 py-1 text-xs font-semibold ${tagColor(tag)}`}>{tag}</span>
                ))}
              </div>
            )}
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-primary">Orçamento grátis</div>
              <h3 className="font-display text-lg font-bold">Fale com um especialista</h3>
              <p className="mt-1 text-sm text-muted-foreground">Resposta em até 2h.</p>
              <div className="mt-4">
                <LeadForm source={`blog_${slug}`} />
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-5 shadow-card text-center">
              <p className="text-sm font-semibold">Prefere falar agora?</p>
              <div className="mt-3 space-y-2">
                <WhatsAppButton source={`blog_${slug}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  WhatsApp
                </WhatsAppButton>
                <a href={`tel:${SITE_CONFIG.contact.phoneE164}`} onClick={() => trackPhone(`blog_${slug}`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold hover:bg-accent transition-colors">
                  <Phone className="h-4 w-4" /> {SITE_CONFIG.contact.phone}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
