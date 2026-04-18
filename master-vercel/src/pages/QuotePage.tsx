import { Link, useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useState } from "react";
import { CheckCircle2, Star, Shield, Clock, Award, Phone, Zap, TrendingDown, Users } from "lucide-react";
import { MultiStepLeadForm } from "@/components/MultiStepLeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";

const TRUST_ITEMS = [
  "Visita técnica gratuita em Curitiba",
  "Projeto personalizado para seu espaço",
  "Equipe certificada e marcas top de mercado",
  "Garantia em todos os serviços",
  "+500 projetos entregues desde 2015",
  "40% de economia de energia comprovada",
];

const SOCIAL_PROOF = [
  { icon: Award,       value: "10+",  label: "Anos de mercado" },
  { icon: Users,       value: "500+", label: "Projetos entregues" },
  { icon: TrendingDown,value: "40%",  label: "Economia de energia" },
  { icon: Shield,      value: "100%", label: "Garantia nos serviços" },
];

function QuotePage() {
  const [formStep, setFormStep] = useState(1);
  const TOTAL_STEPS = 2;
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Orçamento", url: "/orcamento" },
      ])} />

      {/* ── HERO DA LANDING ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 bg-grid opacity-35" />
        <div className="absolute inset-0 bg-radial-glow" />

        <div className="relative mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:gap-14 md:px-6 md:py-20">

          {/* ── Coluna de copy ─────────────────────────────── */}
          <div className="animate-fade-up">
            {/* Urgência */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-energy/40 bg-energy/10 px-4 py-1.5 text-xs font-bold text-energy">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-energy opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-energy" />
              </span>
              <Clock className="h-3.5 w-3.5" /> Resposta em até 2 horas
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.05] text-balance md:text-5xl lg:text-6xl">
              Orçamento{" "}
              <span className="bg-gradient-energy bg-clip-text text-transparent">100% grátis</span>
              {" "}e sem compromisso
            </h1>

            <p className="mt-5 text-base text-white/72 md:text-lg">
              Automação residencial, predial ou industrial em Curitiba — com visita técnica gratuita, projeto personalizado e resposta em até 2 horas.
            </p>

            {/* Checklist */}
            <ul className="mt-7 space-y-2.5">
              {TRUST_ITEMS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-white/85">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/20 text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Avaliação */}
            <div className="mt-7 flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex gap-0.5 text-energy">
                {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4" fill="currentColor" />)}
              </div>
              <div className="text-sm">
                <strong className="text-white">5.0</strong>
                <span className="text-white/55"> · 127 avaliações de clientes em Curitiba</span>
              </div>
            </div>

            {/* Alternativa WhatsApp */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <WhatsAppButton source="orcamento_hero">Prefere WhatsApp?</WhatsAppButton>
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                onClick={() => trackPhone("orcamento")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15"
              >
                <Phone className="h-4 w-4" /> {SITE_CONFIG.contact.phone}
              </a>
            </div>
          </div>

          {/* ── Formulário ─────────────────────────────────── */}
          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl shadow-elegant md:p-8">
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-energy/15 via-transparent to-primary/15" />
              <div className="relative">
                <div className="mb-1 text-[11px] font-bold uppercase tracking-widest text-energy">
                  Solicite agora
                </div>
                <h2 className="font-display text-xl font-bold">Peça seu orçamento</h2>
                <p className="mt-1 text-sm text-white/55">
                  Etapa {formStep} de {TOTAL_STEPS} · Resposta em até 2h
                </p>

                {/* Progress bar dinâmica — reflete o step real do MultiStepLeadForm */}
                <div className="mt-4 flex gap-1.5">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < formStep ? "bg-energy" : "bg-white/15"}`}
                    />
                  ))}
                </div>

                <div className="mt-5">
                  <MultiStepLeadForm
                    source="orcamento_landing"
                    onStepChange={(s) => setFormStep(s)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ────────────────────────────────── */}
      <section className="border-t bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-0 divide-x divide-border px-4 md:grid-cols-4 md:px-6">
          {SOCIAL_PROOF.map((c) => (
            <div key={c.label} className="flex items-center gap-3 px-4 py-7 md:px-6">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-primary">{c.value}</div>
                <div className="text-[11px] text-muted-foreground">{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LGPD micro-copy ─────────────────────────────────── */}
      <div className="bg-surface pb-6 text-center text-[11px] text-muted-foreground">
        <Zap className="mr-1 inline h-3 w-3 text-primary" />
        Seus dados estão protegidos pela LGPD · Nunca compartilhamos suas informações
      </div>
    </>
  );
}

export default QuotePage;
