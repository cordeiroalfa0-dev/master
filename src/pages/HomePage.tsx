import { Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import {
  Zap, Home, Building2, Factory, Shield, ArrowRight,
  CheckCircle2, Star, Award, Users, Phone,
  ClipboardList, Pencil, Wrench, HeadphonesIcon, TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, reviewSchema } from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackCTA, trackPhone } from "@/lib/analytics";
import heroImg from "@/assets/hero-automation.jpg";
import resImg from "@/assets/service-residential.jpg";
import comImg from "@/assets/service-commercial.jpg";
import indImg from "@/assets/service-industrial.jpg";
import secImg from "@/assets/service-security.jpg";

const SERVICES = [
  { slug: "automacao-residencial", icon: Home,      title: "Automação Residencial", desc: "Iluminação, climatização, cortinas, áudio e segurança integrados via app e voz.", img: resImg },
  { slug: "automacao-predial",     icon: Building2, title: "Automação Predial",     desc: "Gestão inteligente de edifícios: acessos, CFTV, iluminação e eficiência energética.", img: comImg },
  { slug: "automacao-industrial",  icon: Factory,   title: "Automação Industrial",  desc: "CLPs, painéis elétricos, SCADA, inversores de frequência e controle de processos.", img: indImg },
  { slug: "seguranca-eletronica",  icon: Shield,    title: "Segurança Eletrônica",  desc: "Alarmes, CFTV IP e controle de acesso biométrico para residências e empresas.", img: secImg },
];

const STATS = [
  { value: "500+", label: "Projetos Entregues" },
  { value: "10+",  label: "Anos de Experiência" },
  { value: "30+",  label: "Bairros Atendidos" },
  { value: "98%",  label: "Clientes Satisfeitos" },
];

const PROCESS = [
  { icon: ClipboardList,  step: "01", title: "Diagnóstico", desc: "Visita técnica gratuita para entender suas necessidades e mapear o ambiente." },
  { icon: Pencil,         step: "02", title: "Projeto",     desc: "Elaboração do projeto técnico personalizado com escopo, prazo e orçamento detalhado." },
  { icon: Wrench,         step: "03", title: "Execução",    desc: "Instalação por equipe certificada, com materiais de marcas líderes e padrão NBR." },
  { icon: HeadphonesIcon, step: "04", title: "Suporte",     desc: "Garantia em todos os serviços e suporte técnico contínuo pós-instalação." },
];

const BRANDS = ["Schneider", "Siemens", "ABB", "WEG", "Legrand", "Hikvision", "Intelbras", "Steck"];

const TESTIMONIALS = [
  { name: "Carlos H.",    role: "Proprietário · Batel",    text: "Transformaram minha cobertura com automação completa. Controlo iluminação, áudio e cortinas pelo celular. Serviço impecável!" },
  { name: "Ana Paula M.", role: "Síndica · Ecoville",      text: "Automatizaram iluminação e controle de acesso do condomínio. Reduzimos 40% no consumo de energia em 6 meses!" },
  { name: "Roberto A.",   role: "Diretor Industrial · CIC", text: "Profissionais extremamente competentes. Implementaram automação da nossa linha de produção com CLPs Siemens — superou expectativas." },
];

const FAQ = [
  { question: "Quanto custa um projeto de automação residencial?", answer: "O valor varia conforme escopo e tamanho do imóvel. Projetos compactos começam em torno de R$ 5.000 e podem chegar a R$ 100.000+ em residências de alto padrão. Fazemos orçamento gratuito após visita técnica." },
  { question: "Quanto tempo leva para automatizar minha casa?",    answer: "Projetos residenciais típicos são executados entre 5 e 20 dias úteis, dependendo da complexidade. Em obras novas, integramos a automação durante a fase elétrica para zero retrabalho." },
  { question: "Vocês atendem em toda Curitiba e região metropolitana?", answer: "Sim. Atendemos Curitiba inteira (Batel, Ecoville, Champagnat, Bigorrilho, Água Verde, Cabral, Juvevê e mais) e cidades vizinhas como São José dos Pinhais, Pinhais, Colombo e Araucária." },
  { question: "Posso integrar com Alexa, Google Home e Apple HomeKit?", answer: "Sim. Trabalhamos com plataformas abertas (KNX, Zigbee, Z-Wave, Matter) e proprietárias (Sonoff, Tuya, Lifx) compatíveis com os principais assistentes de voz do mercado." },
  { question: "Existe garantia nos serviços?", answer: "Sim. Garantia mínima de 12 meses sobre instalação e seguimos as garantias dos fabricantes para os equipamentos. Oferecemos também planos de manutenção preventiva." },
];

function HomePage() {
  usePageSeo({
    title: "Master Elétrica Automatizada — Automação Residencial, Predial e Industrial em Curitiba",
    description: "Especialistas em automação residencial, predial e industrial em Curitiba. +500 projetos entregues. Orçamento grátis em 2h. Atendimento Batel, Ecoville, Champagnat e toda região.",
    path: "/",
    image: "/og-home.jpg",
  });
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Início", url: "/" }])} />
      <JsonLd data={faqSchema(FAQ)} />
      <JsonLd data={reviewSchema(TESTIMONIALS.map((t) => ({ author: t.name, rating: 5, text: t.text })))} />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] overflow-hidden bg-gradient-hero flex items-center text-white">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Sala de estar com automação inteligente em Curitiba"
            className="h-full w-full object-cover opacity-30 mix-blend-luminosity"
          />
          {/* Overlay duplo para mais profundidade */}
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.09_0.055_258)] via-[oklch(0.15_0.11_256/0.85)] to-[oklch(0.25_0.18_252/0.70)]" />
        </div>
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-glow" />
        {/* Acento de cor âmbar no canto */}
        <div className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-energy/8 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-6 lg:py-28">
          {/* Copy */}
          <div className="animate-fade-up">
            {/* Badge urgência */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-energy/35 bg-energy/10 px-4 py-1.5 text-xs font-semibold text-energy backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-energy opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-energy" />
              </span>
              Visita técnica GRATUITA em Curitiba
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.0] text-balance md:text-6xl lg:text-7xl">
              Automatize seu{" "}
              <span className="relative">
                <span className="bg-gradient-energy bg-clip-text text-transparent">espaço</span>
              </span>
              <br />e economize até{" "}
              <span className="bg-gradient-energy bg-clip-text text-transparent">40%</span>
              {" "}de energia
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
              Automação <strong className="font-semibold text-white">residencial, predial e industrial</strong> em Curitiba.
              Mais de 500 projetos entregues. Equipe certificada. Resposta em até 2 horas.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/orcamento"
                onClick={() => trackCTA("orcamento_hero", "hero")}
                className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-gradient-energy px-7 py-3.5 text-sm font-bold text-energy-foreground shadow-cta transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_20px_60px_oklch(0.80_0.20_66/0.80)]"
              >
                Solicitar Orçamento Grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("hero")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/14"
              >
                <Phone className="h-4 w-4" />
                {SITE_CONFIG.contact.phone}
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-7 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-energy">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}
                </div>
                <span className="font-bold">5.0</span>
                <span className="text-white/50">· 127 avaliações</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-white/70">Orçamento em até <strong className="text-white">2 horas</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-energy" />
                <span className="text-white/70"><strong className="text-white">40%</strong> economia de energia</span>
              </div>
            </div>
          </div>

          {/* Card formulário */}
          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_80px_-16px_oklch(0.09_0.055_258/0.80)] backdrop-blur-xl md:p-7">
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-energy/15 via-transparent to-primary/15" />
              <div className="relative">
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-energy">
                  Orçamento Grátis
                </div>
                <h2 className="font-display text-xl font-bold text-white md:text-2xl">
                  Fale com um especialista
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  Resposta garantida em até 2h.
                </p>
                <div className="mt-5">
                  <LeadForm source="home_hero_form" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARCAS ──────────────────────────────────────────── */}
      <section className="border-y bg-background">
        <div className="mx-auto max-w-7xl px-4 py-7 md:px-6">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Trabalhamos com as principais marcas do mercado
          </p>
          <div className="mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee gap-14">
              {[...BRANDS, ...BRANDS].map((brand, i) => (
                <span
                  key={`${brand}-${i}`}
                  className="font-display text-xl font-bold uppercase tracking-tight text-muted-foreground/45 transition-colors hover:text-primary"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4 md:px-6">
          {STATS.map((s) => (
            <div key={s.label} className="py-10 text-center">
              <div className="stat-number text-4xl md:text-5xl">{s.value}</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVIÇOS ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            <Zap className="h-3 w-3" /> Serviços
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-balance md:text-5xl">
            Soluções completas em automação
          </h2>
          <p className="mt-4 text-muted-foreground">
            Projetos personalizados com tecnologia de ponta e suporte técnico especializado.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Link
              key={s.slug}
              to={`/servicos/${s.slug}`}
              className="service-card group block"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="service-card-overlay" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-energy shadow-energy">
                  <s.icon className="h-5 w-5 text-energy-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{s.desc}</p>
                <div className="mt-3 inline-flex items-center text-xs font-bold text-energy">
                  Saiba mais <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROCESSO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface py-16 md:py-24">
        <div className="absolute inset-0 bg-mesh opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              Como trabalhamos
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-balance md:text-5xl">
              Do diagnóstico à entrega
            </h2>
            <p className="mt-4 text-muted-foreground">
              Metodologia testada em +500 projetos. Previsibilidade de prazo, custo e resultado.
            </p>
          </div>

          <div className="relative mt-14 grid gap-8 md:grid-cols-4">
            {/* Linha conectora */}
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent md:block" />
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex justify-center">
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant ring-8 ring-surface">
                    <p.icon className="h-6 w-6" />
                    <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-gradient-energy text-[10px] font-black text-energy-foreground shadow-energy">
                      {p.step}
                    </span>
                  </div>
                </div>
                <h3 className="mt-5 font-display text-base font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUE NÓS ─────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 md:grid-cols-2 md:px-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              Por que escolher
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
              Tecnologia, eficiência e conforto em um só lugar
            </h2>
            <p className="mt-4 text-muted-foreground">
              Mais de 10 anos transformando residências, edifícios e indústrias em Curitiba.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Equipe técnica certificada e em constante atualização",
                "Orçamento detalhado e sem compromisso em até 2h",
                "Garantia em todos os serviços executados",
                "Suporte técnico pós-instalação dedicado",
                "Atendimento em toda Curitiba e região metropolitana",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary font-semibold shadow-elegant transition-all duration-300 hover:opacity-90 hover:shadow-glow">
                <Link to="/sobre">Conheça nossa história</Link>
              </Button>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("home_why")}
                className="inline-flex h-11 items-center gap-2 rounded-xl border bg-background px-6 text-sm font-semibold transition-all duration-300 hover:bg-accent hover:border-primary/30"
              >
                <Phone className="h-4 w-4 text-primary" />
                {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </div>

          {/* Grid de cards offset */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Award,  title: "10+ anos",     desc: "de experiência no mercado" },
              { icon: Users,  title: "500+ clientes", desc: "satisfeitos em Curitiba" },
              { icon: Zap,    title: "Marcas top",    desc: "Schneider, Siemens, ABB, WEG" },
              { icon: Shield, title: "Garantia",      desc: "em todos os serviços" },
            ].map((c, i) => (
              <div
                key={c.title}
                className={`group rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-primary/20 ${i % 2 === 1 ? "sm:translate-y-6" : ""}`}
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-gradient-primary group-hover:text-primary-foreground group-hover:shadow-elegant">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-base font-bold">{c.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ─────────────────────────────────────── */}
      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              Clientes
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">O que dizem sobre nós</h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className="relative rounded-2xl border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover hover:border-primary/15"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Stars badge */}
                <div className="absolute -top-3 left-6 inline-flex items-center gap-0.5 rounded-full bg-gradient-energy px-3 py-1 shadow-energy">
                  {[1,2,3,4,5].map((j) => <Star key={j} className="h-3 w-3 text-energy-foreground" fill="currentColor" />)}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.text}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t pt-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary font-display text-base font-bold text-primary-foreground shadow-elegant">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            Dúvidas frequentes
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-5xl">Perguntas comuns</h2>
          <p className="mt-4 text-muted-foreground">
            Não encontrou sua resposta?{" "}
            <Link to="/contato" className="font-semibold text-primary hover:underline">
              Fale com nosso time
            </Link>
            .
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b">
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline hover:text-primary transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-hero py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-energy/8 blur-[100px]" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-4 md:grid-cols-2 md:px-6">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-energy/35 bg-energy/10 px-4 py-1.5 text-xs font-semibold text-energy">
              <Zap className="h-3.5 w-3.5" />
              Vamos começar
            </div>
            <h2 className="font-display text-3xl font-bold text-balance md:text-5xl">
              Pronto para automatizar seu espaço?
            </h2>
            <p className="mt-4 max-w-md text-white/65">
              Solicite um orçamento sem compromisso. Resposta em até{" "}
              <strong className="text-white">2h em horário comercial</strong>.
            </p>
            <div className="mt-8 space-y-3">
              <WhatsAppButton source="home_cta">Falar com especialista agora</WhatsAppButton>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("home_cta")}
                className="block text-sm text-white/55 transition-colors hover:text-white/90"
              >
                ou ligue: <strong>{SITE_CONFIG.contact.phone}</strong>
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { v: "2h",   l: "Resposta" },
                { v: "100%", l: "Garantia" },
                { v: "5.0★", l: "Avaliação" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-bold text-energy">{s.v}</div>
                  <div className="text-xs text-white/45">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_80px_-16px_oklch(0.09_0.055_258/0.80)] backdrop-blur-xl md:p-8">
            <h3 className="font-display text-xl font-bold">Solicite seu orçamento</h3>
            <p className="mt-1 text-sm text-white/50">Preencha e retornamos rapidamente.</p>
            <div className="mt-5">
              <LeadForm source="home_cta_form" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
