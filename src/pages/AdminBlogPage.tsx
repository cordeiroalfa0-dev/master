import { Link, useNavigate } from "react-router-dom";
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
import type { BlogPost } from "./BlogPage";
import { getLocalPosts, saveLocalPosts } from "@/lib/blog-storage";

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

export default function AdminBlogPage() {
  usePageSeo({ title: "Admin — Blog | Master Elétrica", description: "", path: "/admin/blog", noindex: true });

  if (!isAdminLoggedIn()) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Acesso negado</h1>
        <p className="mt-2 text-muted-foreground">Você precisa estar autenticado para acessar esta página.</p>
        <Link to="/admin/login" className="mt-4 inline-block text-primary hover:underline">Ir para login</Link>
      </div>
    );
  }

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [view, setView] = useState<"list" | "edit">("list");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [slugManual, setSlugManual] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  function handleLogout() { adminLogout(); navigate("/admin/login"); }

  function fetchPosts() {
    setLoadingPosts(true);
    const localPosts = getLocalPosts();
    setPosts(localPosts);
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

  async function handleGenerateImage() {
    setGeneratingImage(true);
    const url = await generateImage(form.titulo, form.tags);
    setForm(f => ({ ...f, og_image: url }));
    setGeneratingImage(false);
  }

  async function handleSave(publish?: boolean) {
    if (!form.titulo.trim() || !form.slug.trim()) {
      setSaveMsg({ type:"err", text:"Título e slug são obrigatórios." }); return;
    }
    setSaving(true);
    setSaveMsg(null);

    const isPublished = publish !== undefined ? publish : form.publicado;
    const now = new Date().toISOString();

    const payload: BlogPost = {
      id: form.id || Math.random().toString(36).substr(2, 9),
      titulo: form.titulo.trim(),
      slug: form.slug.trim(),
      resumo: form.resumo || null,
      conteudo: form.conteudo || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      og_image: form.og_image || null,
      tags: form.tags.length > 0 ? form.tags : null,
      autor: form.autor || "Master Elétrica",
      publicado: isPublished,
      publicado_em: isPublished ? (form.id ? (posts.find(p => p.id === form.id)?.publicado_em || now) : now) : null,
      created_at: form.id ? (posts.find(p => p.id === form.id)?.created_at || now) : now,
      updated_at: now,
    };

    let updatedPosts;
    if (form.id) {
      updatedPosts = posts.map(p => p.id === form.id ? payload : p);
    } else {
      updatedPosts = [payload, ...posts];
    }

    saveLocalPosts(updatedPosts);
    setPosts(updatedPosts);
    setForm(f => ({ ...f, id: payload.id, publicado: payload.publicado }));
    setSaving(false);
    setSaveMsg({ type:"ok", text: publish ? "Artigo publicado!" : "Rascunho salvo." });
  }

  function togglePublish(post: BlogPost) {
    const next = !post.publicado;
    const updated = posts.map(p => p.id === post.id ? { 
      ...p, 
      publicado: next, 
      publicado_em: next ? new Date().toISOString() : null 
    } : p);
    saveLocalPosts(updated);
    setPosts(updated);
  }

  function confirmDelete() {
    if (!deleteId) return;
    const updated = posts.filter(p => p.id !== deleteId);
    saveLocalPosts(updated);
    setPosts(updated);
    setDeleteId(null);
    setSaveMsg({ type:"ok", text: "Artigo deletado com sucesso." });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold">Blog CMS (Local)</h1>
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
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {post.og_image ? <img src={post.og_image} alt="" className="h-full w-full object-cover"/> : <div className="h-full w-full flex items-center justify-center text-xl">⚡</div>}
                  </div>
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
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link to={`/blog/${post.slug}`} target="_blank"
                      className="rounded-md border p-1.5 transition-colors hover:bg-accent" title="Visualizar">
                      <Eye className="h-3.5 w-3.5"/>
                    </Link>
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

      {view === "edit" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Artigo</Label>
                  <Input id="titulo" value={form.titulo} onChange={e => update("titulo", e.target.value)} placeholder="Ex: Como automatizar sua iluminação" className="text-lg font-semibold"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL amigável (slug)</Label>
                  <div className="flex gap-2">
                    <Input id="slug" value={form.slug} onChange={e => { setSlugManual(true); update("slug", e.target.value); }} placeholder="como-automatizar-iluminacao"/>
                    <Button variant="outline" size="icon" onClick={() => { setSlugManual(false); update("slug", slugify(form.titulo)); }} title="Gerar automático"><RefreshCw className="h-4 w-4"/></Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resumo">Resumo / Lead</Label>
                  <Textarea id="resumo" value={form.resumo} onChange={e => update("resumo", e.target.value)} placeholder="Breve introdução que aparece na listagem..." rows={3} className="resize-none"/>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="conteudo">Conteúdo (Markdown)</Label>
                    <span className="text-[10px] text-muted-foreground">Suporta ## Títulos, **Negrito**, - Listas</span>
                  </div>
                  <Textarea id="conteudo" ref={contentRef} value={form.conteudo} onChange={e => update("conteudo", e.target.value)} placeholder="Escreva seu artigo aqui..." className="min-h-[400px] font-mono text-sm leading-relaxed"/>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Ações</h3>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-primary font-bold text-primary-foreground" onClick={() => handleSave()} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                  Salvar Rascunho
                </Button>
                <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5" onClick={() => handleSave(true)} disabled={saving}>
                  <CheckCircle2 className="mr-2 h-4 w-4"/> Publicar Agora
                </Button>
                {saveMsg && (
                  <div className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${saveMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {saveMsg.type === "ok" ? <CheckCircle2 className="h-4 w-4 shrink-0"/> : <AlertCircle className="h-4 w-4 shrink-0"/>}
                    {saveMsg.text}
                    <button className="ml-auto" onClick={() => setSaveMsg(null)}><X className="h-3 w-3"/></button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Imagem de Capa</h3>
              <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted mb-3">
                {form.og_image ? <img src={form.og_image} alt="Preview" className="h-full w-full object-cover"/> : <div className="flex h-full flex-col items-center justify-center text-muted-foreground"><ImageIcon className="mb-2 h-8 w-8 opacity-20"/><span className="text-[10px]">Sem imagem</span></div>}
              </div>
              <div className="space-y-2">
                <Input value={form.og_image} onChange={e => update("og_image", e.target.value)} placeholder="URL da imagem..." className="text-xs"/>
                <Button variant="secondary" size="sm" className="w-full text-xs" onClick={handleGenerateImage} disabled={generatingImage}>
                  {generatingImage ? <Loader2 className="mr-2 h-3 w-3 animate-spin"/> : <Sparkles className="mr-2 h-3 w-3"/>}
                  Sugerir Imagem
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${form.tags.includes(tag) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 shadow-sm space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">SEO</h3>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Meta Title</Label>
                <Input value={form.meta_title} onChange={e => update("meta_title", e.target.value)} placeholder="Título para Google (max 60)"/>
                <p className="text-xs text-muted-foreground">{form.meta_title.length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Meta description</Label>
                <Textarea rows={3} value={form.meta_description} onChange={e => update("meta_description", e.target.value)} placeholder="Descrição para Google (max 155)" className="text-sm resize-none"/>
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
