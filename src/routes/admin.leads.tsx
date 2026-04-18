import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Phone, Mail, Calendar, Tag, Globe, ArrowUpRight, Settings, LogOut, Filter, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdminLoggedIn, adminLogout } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/leads")({
  beforeLoad: () => {
    if (!isAdminLoggedIn()) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Leads — Admin Master Elétrica" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLeadsPage,
});

type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  servico: string | null;
  mensagem: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  fbclid: string | null;
  ttclid: string | null;
  pagina_origem: string | null;
  referrer: string | null;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  novo:       "bg-blue-100 text-blue-800",
  em_contato: "bg-yellow-100 text-yellow-800",
  convertido: "bg-green-100 text-green-800",
  perdido:    "bg-red-100 text-red-800",
};

const LEADS_KEY = "master_leads";

function loadLeads(): Lead[] {
  try { return JSON.parse(localStorage.getItem(LEADS_KEY) ?? "[]"); }
  catch { return []; }
}

function saveLeads(leads: Lead[]) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

function sourceIcon(lead: Lead) {
  if (lead.gclid)      return "🔍 Google Ads";
  if (lead.fbclid)     return "📘 Meta Ads";
  if (lead.ttclid)     return "🎵 TikTok Ads";
  if (lead.utm_source) return `🔗 ${lead.utm_source}`;
  if (lead.referrer) {
    try { return `↩ ${new URL(lead.referrer).hostname}`; } catch {}
  }
  return "🌐 Direto";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function AdminLeadsPage() {
  const [leads, setLeads]     = useState<Lead[]>([]);
  const [filter, setFilter]   = useState("todos");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setLeads(loadLeads()); }, []);

  function updateStatus(id: string, status: string) {
    const updated = leads.map((l) => l.id === id ? { ...l, status } : l);
    setLeads(updated);
    saveLeads(updated);
  }

  function handleLogout() {
    adminLogout();
    window.location.href = "/admin/login";
  }

  function exportCSV() {
    const headers = ["nome","telefone","email","servico","utm_source","utm_medium","utm_campaign","pagina_origem","status","data"];
    const rows = leads.map((l) =>
      [l.nome, l.telefone, l.email ?? "", l.servico ?? "",
       l.utm_source ?? "", l.utm_medium ?? "", l.utm_campaign ?? "",
       l.pagina_origem ?? "", l.status, fmtDate(l.created_at)]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
    );
    const csv  = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered   = filter === "todos" ? leads : leads.filter((l) => l.status === filter);
  const counts     = {
    total:      leads.length,
    novo:       leads.filter((l) => l.status === "novo").length,
    convertido: leads.filter((l) => l.status === "convertido").length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      {/* Topbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold">Leads</h1>
            <p className="text-sm text-muted-foreground">
              {counts.total} total · {counts.novo} novos · {counts.convertido} convertidos
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-1.5 h-4 w-4" /> Exportar CSV
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/configuracoes">
              <Settings className="mr-1.5 h-4 w-4" /> Configurações
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sair
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total",       value: counts.total,       color: "bg-primary/10 text-primary" },
          { label: "Novos",       value: counts.novo,        color: "bg-blue-100 text-blue-700" },
          { label: "Convertidos", value: counts.convertido,  color: "bg-green-100 text-green-700" },
          { label: "Taxa",        value: counts.total ? `${Math.round(counts.convertido / counts.total * 100)}%` : "0%", color: "bg-energy/10 text-yellow-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <div className="font-display text-2xl font-bold">{s.value}</div>
            <div className="mt-0.5 text-xs font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {["todos","novo","em_contato","convertido","perdido"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              filter === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {s === "todos" ? "Todos" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card py-16 text-center text-muted-foreground">
          <Users className="mx-auto mb-3 h-8 w-8 opacity-40" />
          <p className="font-medium">Nenhum lead encontrado</p>
          <p className="mt-1 text-sm">Leads enviados pelo site aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
              {/* Cabeçalho do lead */}
              <div
                className="flex cursor-pointer flex-wrap items-center gap-3 p-4 transition-colors hover:bg-muted/30"
                onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-base font-bold text-primary">
                  {lead.nome.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{lead.nome}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {lead.status}
                    </span>
                    {lead.servico && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {lead.servico}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.telefone}</span>
                    {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                    <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{sourceIcon(lead)}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmtDate(lead.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${lead.telefone}`}
                    className="rounded-md border p-1.5 transition-colors hover:bg-accent"
                    title="Ligar"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${lead.telefone.replace(/\D/g,"")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border p-1.5 transition-colors hover:bg-accent"
                    title="WhatsApp"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Detalhe expandido */}
              {expanded === lead.id && (
                <div className="space-y-4 border-t bg-muted/20 px-4 py-4">
                  {lead.mensagem && (
                    <div>
                      <p className="mb-1 text-xs font-semibold text-muted-foreground">Mensagem</p>
                      <p className="rounded-lg border bg-card p-3 text-sm">{lead.mensagem}</p>
                    </div>
                  )}

                  <div>
                    <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Tag className="h-3 w-3" /> Atribuição de marketing
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
                      {[
                        { label: "Fonte",          value: lead.utm_source },
                        { label: "Mídia",          value: lead.utm_medium },
                        { label: "Campanha",       value: lead.utm_campaign },
                        { label: "Conteúdo",       value: lead.utm_content },
                        { label: "Termo",          value: lead.utm_term },
                        { label: "Página entrada", value: lead.pagina_origem },
                        { label: "Referrer",       value: lead.referrer },
                        { label: "Google CID",     value: lead.gclid },
                        { label: "Meta CID",       value: lead.fbclid },
                        { label: "TikTok CID",     value: lead.ttclid },
                      ].filter((r) => r.value).map((row) => (
                        <div key={row.label} className="rounded-md border bg-card px-3 py-2">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</div>
                          <div className="mt-0.5 truncate font-medium">{row.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">Atualizar status</p>
                    <div className="flex flex-wrap gap-2">
                      {["novo","em_contato","convertido","perdido"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(lead.id, s)}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                            lead.status === s
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:bg-accent"
                          }`}
                        >
                          {s.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
