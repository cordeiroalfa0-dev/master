import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";

export const Route = createFileRoute("/projetos")({
  head: () =>
    buildSeo({
      title: "Projetos de Automação em Curitiba — Portfólio Master Elétrica",
      description:
        "Veja nossos projetos entregues em Batel, Ecoville, Champagnat, CIC, Bigorrilho e outros bairros de Curitiba. Automação residencial, predial e industrial.",
      path: "/projetos",
      image: "/og-projetos.jpg",
    }),
  component: ProjectsPage,
});

// Fotos do Unsplash — URLs diretas, sem API key, sem custo
// Formato: https://images.unsplash.com/photo-{ID}?w=800&h=600&fit=crop&auto=format&q=80
const PROJECTS = [
  {
    tag: "Residencial",
    local: "Batel, Curitiba",
    title: "Cobertura Smart Home",
    desc: "Automação completa: iluminação cênica, áudio multi-room, climatização e cortinas motorizadas controladas por app e voz.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Predial",
    local: "Ecoville, Curitiba",
    title: "Edifício Residencial Premium",
    desc: "Iluminação inteligente da fachada, controle de acesso veicular automatizado e gestão de áreas comuns.",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Industrial",
    local: "CIC, Curitiba",
    title: "Indústria Metalúrgica",
    desc: "Programação de CLPs Siemens, painéis de comando e supervisão SCADA da linha de produção.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Residencial",
    local: "Champagnat, Curitiba",
    title: "Home Theater Premium",
    desc: "Sala de cinema com automação total: cortinas blackout, projeção 4K, áudio 7.1 e iluminação cênica programável.",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Segurança",
    local: "Água Verde, Curitiba",
    title: "Condomínio Vertical",
    desc: "CFTV com 64 câmeras IP, alarme perimetral, controle de acesso biométrico e portaria remota 24h.",
    img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Predial",
    local: "Centro Cívico, Curitiba",
    title: "Edifício Corporativo",
    desc: "Catracas com biometria facial, iluminação automatizada e integração com sistema de gestão predial.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Residencial",
    local: "Bigorrilho, Curitiba",
    title: "Cozinha Inteligente",
    desc: "Iluminação sob bancada, controle por voz, eletrodomésticos integrados e cenas personalizadas.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Comercial",
    local: "Juvevê, Curitiba",
    title: "Restaurante Boutique",
    desc: "Cenas de iluminação por horário, controle de climatização e som ambiente integrado.",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Residencial",
    local: "Cabral, Curitiba",
    title: "Residência de Alto Padrão",
    desc: "Domótica completa com sensores de presença, automação de portões e integração com assistente virtual.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Predial",
    local: "Centro, Curitiba",
    title: "Shopping Comercial",
    desc: "Sistema integrado de iluminação, ar-condicionado e segurança eletrônica para múltiplas lojas.",
    img: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop&auto=format&q=80",
  },
  {
    tag: "Industrial",
    local: "Boqueirão, Curitiba",
    title: "Galpão Logístico",
    desc: "Painéis de força, automação de portões industriais e sistema de monitoramento energético.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&auto=format&q=80",
  },
];

const TAG_COLORS: Record<string, string> = {
  Residencial: "bg-blue-500/10 text-blue-600",
  Predial:     "bg-violet-500/10 text-violet-600",
  Industrial:  "bg-orange-500/10 text-orange-600",
  Segurança:   "bg-red-500/10 text-red-600",
  Comercial:   "bg-emerald-500/10 text-emerald-600",
};

function ProjectsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Projetos", url: "/projetos" },
      ])} />

      <section className="bg-gradient-hero py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-energy">Portfólio</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-balance md:text-6xl">
            Obras Entregues em Curitiba
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Projetos executados com excelência nos principais bairros de Curitiba e região metropolitana.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl border bg-card transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              {/* Imagem com fallback para gradiente se não carregar */}
              <div className="aspect-[4/3] overflow-hidden bg-gradient-primary">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback: esconde img e mostra inicial via CSS
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TAG_COLORS[p.tag] ?? "bg-primary/10 text-primary"}`}>
                    {p.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {p.local}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <WhatsAppButton message="Olá! Gostaria de ver mais projetos da Master Elétrica." source="projetos">
            Solicitar projeto personalizado
          </WhatsAppButton>
        </div>
      </section>
    </>
  );
}
