import { Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useState, useEffect, useRef } from "react";
import {
  PlusCircle, Edit3, Trash2, Eye, EyeOff, Save, ArrowLeft,
  Loader2, Sparkles, Image as ImageIcon, LogOut, Users,
  Settings, BookOpen, CheckCircle2, AlertCircle, RefreshCw, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isAdminLoggedIn, adminLogout } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "./BlogPage";

// ── Helpers ────────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" });
}

const TAG_OPTIONS = ["Residencial","Predial","Industrial","Segurança","Tecnologia","Guia","Curitiba","Economia"];

// ── Formulário de edição / criação ─────────────────────────────────────────
interface FormData {
  id: string | null;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  tags: string[];
  publicado: boolean;
  autor: string;
}

const EMPTY_FORM: FormData = {
  id: null, titulo: "", slug: "", resumo: "", conteudo: "",
  meta_title: "", meta_description: "", og_image: "",
  tags: [], publicado: false, autor: "Master Elétrica",
};

// ── Chamada à API do Claude para gerar conteúdo ────────────────────────────
async function generateContent(titulo: string, tags: string[]): Promise<{ resumo: string; conteudo: string; meta_title: string; meta_description: string }> {
  const tagStr = tags.join(", ") || "automação";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Você é redator especialista em automação elétrica para a empresa Master Elétrica Automatizada de Curitiba, PR.

Gere um artigo de blog SEO completo em português brasileiro sobre: "${titulo}"
Categorias: ${tagStr}

Responda APENAS com JSON válido (sem markdown, sem backticks):
{
  "resumo": "Resumo do artigo em 2 frases para SEO (max 160 chars)",
  "meta_title": "Título SEO com palavra-chave (max 60 chars)",
  "meta_description": "Meta description para SEO (max 155 chars)",
  "conteudo": "Artigo completo em markdown com ## títulos, listas e parágrafos. Mínimo 600 palavras. Mencione Curitiba, automação, Master Elétrica. Inclua dicas práticas, números e CTAs naturais. Use ## para seções, - para listas, **negrito** para destaques."
}`
      }]
    })
  });
  const data = await response.json();
  const text = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "{}";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── Geração de imagem via Unsplash (busca por relevância) ──────────────────
async function generateImage(titulo: string, tags: string[]): Promise<string> {
  const queries: Record<string, string> = {
    Residencial: "smart home automation living room",
    Predial: "building automation smart building",
    Industrial: "industrial automation factory",
    "Segurança": "security camera surveillance system",
    Tecnologia: "smart technology home devices",
    Guia: "electrical automation modern",
  };
  const tag = tags.find(t => queries[t]);
  const q = tag ? queries[tag] : "home automation technology";
  const rand = Math.floor(Math.random() * 30);
  return `https://images.unsplash.com/photo-${unsplashId(q, rand)}?w=1200&h=630&fit=crop&auto=format&q=80`;
}

// Pool curado de IDs Unsplash por tema
function unsplashId(q: string, n: number): string {
  const pools: Record<string, string[]> = {
    "smart home automation living room": ["1558618666-fcd25c85cd64","1586953208448-b8b12d93c0a5","1484154218962-a197022b5858","1565043589221-1a6fd9ae45c7","1564078516393-cf04bd966897"],
    "building automation smart building": ["1545324418-cc1a3fa10c00","1486325212027-8081e485255e","1497366811353-6870744d04b2","1497366216548-37526070297c","1486325212027-8081e485255e"],
    "industrial automation factory": ["1581091226825-a6a2a5aee158","1565043589221-1a6fd9ae45c7","1565043589221-1a6fd9ae45c7","1565043589221-1a6fd9ae45c7","1508614999368-9260051292e5"],
    "security camera surveillance system": ["1555664424-778a1e5e1b48","1557597774-9d273605dfa9","1541888946425-d81bb19240f5","1558618666-fcd25c85cd64","1555664424-778a1e5e1b48"],
    "smart technology home devices": ["1558089687-f282ffcbc126","1518770660439-4636190af475","1515378791036-0648a3ef77b2","1518770660439-4636190af475","1558089687-f282ffcbc126"],
    "home automation technology": ["1558618666-fcd25c85cd64","1545324418-cc1a3fa10c00","1558089687-f282ffcbc126","1486325212027-8081e485255e","1581091226825-a6a2a5aee158"],
  };
  const pool = pools[q] ?? pools["home automation technology"];
  return pool[n % pool.length];
}

// ── Componente principal ───────────────────────────────────────────────────
export default function AdminBlogPage() {
  usePageSeo({ title: "Admin — Blog | Master Elétrica", description: "", path: "/admin/blog", noindex: true });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [view, setView] = useState<"list" | "edit">("list");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function handleLogout() { adminLogout(); window.location.href = "/admin/login"; }

  async function fetchPosts() {
    setLoadingPosts(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts((data ?? []) as BlogPost[]);
    setLoadingPosts(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  function openNew() {
    setForm(EMPTY_FORM);
    setSlugManual(false);
    setSaveMsg(null);
    setView("edit");
  }

  function openEdit(post: BlogPost) {
    setForm({
      id: post.id, titulo: post.titulo, slug: post.slug,
      resumo: post.resumo ?? "", conteudo: post.conteudo ?? "",
      meta_title: post.meta_title ?? "", meta_description: post.meta_description ?? "",
      og_image: post.og_image ?? "", tags: post.tags ?? [],
      publicado: post.publicado, autor: post.autor ?? "Master Elétrica",
    });
    setSlugManual(true);
    setSaveMsg(null);
    setView("edit");
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => {
      const next = { ...f, [key]: value };
      if (key === "titulo" && !slugManual) next.slug = slugify(value as string);
      return next;
    });
  }

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  }

  // ── Gerar conteúdo via IA ──────────────────────────────────────────────
  async function handleGenerateContent() {
    if (!form.titulo.trim()) { setSaveMsg({ type:"err", text:"Informe o título antes de gerar conteúdo." }); return; }
    setGeneratingContent(true);
    setSaveMsg(null);
    try {
      const result = await generateContent(form.titulo, form.tags);
      setForm(f => ({
        ...f,
        resumo: result.resumo ?? f.resumo,
        conteudo: result.conteudo ?? f.conteudo,
        meta_title: result.meta_title ?? f.meta_title,
        meta_description: result.meta_description ?? f.meta_description,
      }));
      setSaveMsg({ type:"ok", text:"Conteúdo gerado com sucesso! Revise e edite antes de publicar." });
    } catch {
      setSaveMsg({ type:"err", text:"Erro ao gerar conteúdo. Verifique sua conexão e tente novamente." });
    }
    setGeneratingContent(false);
  }

  // ── Gerar imagem ──────────────────────────────────────────────────────
  async function handleGenerateImage() {
    setGeneratingImage(true);
    const url = await generateImage(form.titulo, form.tags);
    setForm(f => ({ ...f, og_image: url }));
    setGeneratingImage(false);
  }

  // ── Salvar no Supabase ─────────────────────────────────────────────────
  async function handleSave(publish?: boolean) {
    if (!form.titulo.trim() || !form.slug.trim()) {
      setSaveMsg({ type:"err", text:"Título e slug são obrigatórios." }); return;
    }
    setSaving(true);
    setSaveMsg(null);

    const payload = {
      titulo: form.titulo.trim(),
      slug: form.slug.trim(),
      resumo: form.resumo || null,
      conteudo: form.conteudo || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      og_image: form.og_image || null,
      tags: form.tags.length > 0 ? form.tags : null,
      autor: form.autor || "Master Elétrica",
      publicado: publish !== undefined ? publish : form.publicado,
      publicado_em: (publish ?? form.publicado) ? new Date().toISOString() : null,
    };

    let error;
    if (form.id) {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", form.id));
    } else {
      const { data, error: e } = await supabase.from("blog_posts").insert([payload]).select().single();
      error = e;
      if (data) setForm(f => ({ ...f, id: (data as BlogPost).id, publicado: payload.publicado }));
    }

    setSaving(false);
    if (error) {
      setSaveMsg({ type:"err", text: `Erro: ${error.message}` });
    } else {
      setSaveMsg({ type:"ok", text: publish ? "Artigo publicado!" : "Rascunho salvo." });
      setForm(f => ({ ...f, publicado: payload.publicado }));
      await fetchPosts();
    }
  }

  // ── Toggle publicado ──────────────────────────────────────────────────
  async function togglePublish(post: BlogPost) {
    const next = !post.publicado;
    await supabase.from("blog_posts").update({ publicado: next, publicado_em: next ? new Date().toISOString() : null }).eq("id", post.id);
    await fetchPosts();
  }

  // ── Deletar ────────────────────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteId) return;
    await supabase.from("blog_posts").delete().eq("id", deleteId);
    setDeleteId(null);
    await fetchPosts();
  }

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">

      {/* ── Topbar ── */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold">Blog CMS</h1>
            <p className="text-sm text-muted-foreground">{posts.length} artigos · {posts.filter(p => p.publicado).length} publicados</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {view === "edit" && (
            <Button variant="outline" size="sm" onClick={() => setView("list")}>
              <ArrowLeft className="mr-1.5 h-4 w-4"/> Voltar
            </Button>
          )}
          {view === "list" && (
            <Button size="sm" onClick={openNew} className="bg-gradient-primary text-primary-foreground font-semibold">
              <PlusCircle className="mr-1.5 h-4 w-4"/> Novo artigo
            </Button>
          )}
          <Button variant="outline" size="sm" asChild><Link to="/admin/leads"><Users className="mr-1.5 h-4 w-4"/>Leads</Link></Button>
          <Button variant="outline" size="sm" asChild><Link to="/admin/configuracoes"><Settings className="mr-1.5 h-4 w-4"/>Config</Link></Button>
          <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="mr-1.5 h-4 w-4"/>Sair</Button>
        </div>
      </div>

      {/* ────────── LISTA ────────── */}
      {view === "list" && (
        <>
          {loadingPosts ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin"/> Carregando artigos...
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border bg-card py-20 text-center text-muted-foreground">
              <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40"/>
              <p className="font-medium">Nenhum artigo ainda</p>
              <Button size="sm" className="mt-4 bg-gradient-primary text-primary-foreground" onClick={openNew}>
                <PlusCircle className="mr-1.5 h-4 w-4"/> Criar primeiro artigo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map(post => (
                <div key={post.id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4 shadow-sm">
                  {/* Thumbnail */}
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {post.og_image ? <img src={post.og_image} alt="" className="h-full w-full object-cover"/> : <div className="h-full w-full flex items-center justify-center text-xl">⚡</div>}
                  </div>
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold truncate">{post.titulo}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${post.publicado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {post.publicado ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      /blog/{post.slug} · {fmtDate(post.publicado_em ?? post.created_at)}
                      {post.tags && post.tags.length > 0 && <span> · {post.tags.slice(0,3).join(", ")}</span>}
                    </div>
                  </div>
                  {/* Ações */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer"
                      className="rounded-md border p-1.5 transition-colors hover:bg-accent" title="Visualizar">
                      <Eye className="h-3.5 w-3.5"/>
                    </a>
                    <button onClick={() => togglePublish(post)}
                      className="rounded-md border p-1.5 transition-colors hover:bg-accent" title={post.publicado ? "Despublicar" : "Publicar"}>
                      {post.publicado ? <EyeOff className="h-3.5 w-3.5"/> : <Eye className="h-3.5 w-3.5 text-green-600"/>}
                    </button>
                    <button onClick={() => openEdit(post)}
                      className="rounded-md border p-1.5 transition-colors hover:bg-accent" title="Editar">
                      <Edit3 className="h-3.5 w-3.5"/>
                    </button>
                    <button onClick={() => setDeleteId(post.id)}
                      className="rounded-md border p-1.5 transition-colors hover:bg-red-50 hover:border-red-300 hover:text-red-600" title="Deletar">
                      <Trash2 className="h-3.5 w-3.5"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ────────── EDITOR ────────── */}
      {view === "edit" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Coluna principal */}
          <div className="space-y-6">

            {/* IA Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-primary mt-0.5"/>
                  <div>
                    <p className="text-sm font-semibold">Geração com IA</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Digite o título, escolha as categorias e clique em "Gerar com IA" para criar o artigo completo automaticamente.</p>
                  </div>
                </div>
                <Button size="sm" onClick={handleGenerateContent} disabled={generatingContent || !form.titulo.trim()}
                  className="bg-gradient-primary text-primary-foreground font-semibold shrink-0">
                  {generatingContent ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin"/>Gerando...</> : <><Sparkles className="mr-1.5 h-4 w-4"/>Gerar com IA</>}
                </Button>
              </div>
            </div>

            {/* Feedback */}
            {saveMsg && (
              <div className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${saveMsg.type === "ok" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                {saveMsg.type === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5"/>}
                {saveMsg.text}
              </div>
            )}

            {/* Título */}
            <div className="space-y-1.5">
              <Label htmlFor="titulo" className="text-sm font-semibold">Título do artigo *</Label>
              <Input id="titulo" value={form.titulo} onChange={e => update("titulo", e.target.value)}
                placeholder="Ex: Como automatizar sua casa em Curitiba em 2025" className="text-base font-medium"/>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="slug" className="text-sm font-semibold">Slug (URL) *</Label>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-muted-foreground shrink-0">/blog/</span>
                <Input id="slug" value={form.slug}
                  onChange={e => { setSlugManual(true); update("slug", slugify(e.target.value)); }}
                  placeholder="como-automatizar-casa-curitiba" className="font-mono text-sm"/>
                <button onClick={() => { setSlugManual(false); update("slug", slugify(form.titulo)); }}
                  className="shrink-0 rounded-md border p-2 hover:bg-accent transition-colors" title="Regerar slug">
                  <RefreshCw className="h-3.5 w-3.5"/>
                </button>
              </div>
            </div>

            {/* Resumo */}
            <div className="space-y-1.5">
              <Label htmlFor="resumo" className="text-sm font-semibold">Resumo / Lead</Label>
              <Textarea id="resumo" rows={3} value={form.resumo} onChange={e => update("resumo", e.target.value)}
                placeholder="Resumo do artigo exibido na listagem e usado como meta description fallback..."/>
              <p className="text-xs text-muted-foreground">{form.resumo.length}/160 chars</p>
            </div>

            {/* Conteúdo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="conteudo" className="text-sm font-semibold">Conteúdo (Markdown)</Label>
                <span className="text-xs text-muted-foreground">{form.conteudo.split(/\s+/).filter(Boolean).length} palavras</span>
              </div>
              <Textarea ref={contentRef} id="conteudo" rows={22} value={form.conteudo}
                onChange={e => update("conteudo", e.target.value)}
                placeholder="## Título da seção&#10;&#10;Escreva o conteúdo em markdown...&#10;&#10;- Item de lista&#10;- Outro item&#10;&#10;**Texto em negrito** para destaques."
                className="font-mono text-sm leading-relaxed resize-y"/>
              <p className="text-xs text-muted-foreground">Use ## para títulos, - para listas, **negrito** para destaques.</p>
            </div>

          </div>

          {/* Sidebar de configurações */}
          <div className="space-y-5">

            {/* Publicar / Salvar */}
            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-sm">Publicação</h3>
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${form.publicado ? "bg-green-500" : "bg-yellow-400"}`}/>
                <span className="text-sm">{form.publicado ? "Publicado" : "Rascunho"}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleSave()} disabled={saving} variant="outline" className="w-full justify-start">
                  {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin"/> : <Save className="mr-1.5 h-4 w-4"/>}
                  Salvar rascunho
                </Button>
                <Button onClick={() => handleSave(true)} disabled={saving || form.publicado}
                  className="w-full justify-start bg-gradient-primary text-primary-foreground font-semibold">
                  {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin"/> : <Eye className="mr-1.5 h-4 w-4"/>}
                  {form.publicado ? "Já publicado" : "Publicar agora"}
                </Button>
                {form.publicado && (
                  <Button onClick={() => handleSave(false)} disabled={saving} variant="outline" className="w-full justify-start text-yellow-700 border-yellow-300">
                    <EyeOff className="mr-1.5 h-4 w-4"/> Despublicar
                  </Button>
                )}
              </div>
            </div>

            {/* Imagem */}
            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-sm">Imagem de capa</h3>
              {form.og_image && (
                <div className="relative rounded-lg overflow-hidden aspect-video">
                  <img src={form.og_image} alt="Capa" className="h-full w-full object-cover"/>
                  <button onClick={() => update("og_image", "")}
                    className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                    <X className="h-3 w-3"/>
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={handleGenerateImage} disabled={generatingImage} variant="outline" className="w-full justify-start">
                  {generatingImage ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin"/> : <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary"/>}
                  Gerar imagem com IA
                </Button>
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground"/>
                  <Input value={form.og_image} onChange={e => update("og_image", e.target.value)}
                    placeholder="https://... URL da imagem" className="text-xs h-8"/>
                </div>
              </div>
            </div>

            {/* Categorias */}
            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-sm">Categorias / Tags</h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-all border ${form.tags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent border-border"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
              <h3 className="font-semibold text-sm">SEO</h3>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Meta title</Label>
                <Input value={form.meta_title} onChange={e => update("meta_title", e.target.value)}
                  placeholder="Título para Google (max 60)" className="text-sm"/>
                <p className="text-xs text-muted-foreground">{form.meta_title.length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Meta description</Label>
                <Textarea rows={3} value={form.meta_description} onChange={e => update("meta_description", e.target.value)}
                  placeholder="Descrição para Google (max 155)" className="text-sm resize-none"/>
                <p className="text-xs text-muted-foreground">{form.meta_description.length}/155</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Autor</Label>
                <Input value={form.autor} onChange={e => update("autor", e.target.value)} className="text-sm"/>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Modal de confirmação de exclusão ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="mx-4 rounded-2xl border bg-card p-6 shadow-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-muted-foreground">Esta ação não pode ser desfeita. O artigo será removido permanentemente.</p>
            <div className="mt-5 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button className="flex-1 bg-destructive text-destructive-foreground hover:opacity-90" onClick={confirmDelete}>
                <Trash2 className="mr-1.5 h-4 w-4"/> Deletar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
