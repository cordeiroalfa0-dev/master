import { Link, useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useEffect } from "react";
import { CheckCircle2, MessageCircle, Phone, Star, ArrowRight } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { trackEvent, trackPhone } from "@/lib/analytics";
import { SITE_CONFIG } from "@/lib/site-config";

function ThankYouPage() {
  useEffect(() => {
    // GA4 / GTM
    trackEvent("conversion", {
      send_to: "lead_form_complete",
      value: 1,
      currency: "BRL",
      event_category: "lead",
    });

    // Meta Pixel — Purchase event com valor simbólico (melhora ROAS reporting)
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", { value: 1, currency: "BRL" });
    }

    // Google Ads gtag conversion — IDs configurados via site_settings no Supabase
    if (typeof window !== "undefined" && window.gtag) {
      const adsId = (window as any).__GADS_ID__ as string | undefined;
      const adsLabel = (window as any).__GADS_LABEL__ as string | undefined;
      if (adsId && adsLabel) {
        window.gtag("event", "conversion", {
          send_to: `${adsId}/${adsLabel}`,
          value: 1.0,
          currency: "BRL",
        });
      }
    }

    // TikTok
    if (typeof window !== "undefined" && window.ttq) {
      window.ttq.track("SubmitForm", { value: 1, currency: "BRL" });
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[80vh] flex items-center text-white">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        {/* Ícone animado */}
        <div className="relative">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-success/15 text-success ring-1 ring-success/30">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="absolute -inset-3 rounded-full bg-success/10 animate-ping-slow" />
        </div>

        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-success">
          {[1,2,3,4,5].map((i) => <Star key={i} className="h-3 w-3" fill="currentColor" />)}
          <span className="ml-1 text-white/60">5.0 · 127 avaliações</span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-balance md:text-5xl">
          Mensagem recebida!
        </h1>
        <p className="mt-4 max-w-md text-base text-white/70">
          Nossa equipe técnica vai analisar seu pedido e entrar em contato em até{" "}
          <strong className="text-white">2 horas</strong> em horário comercial.
        </p>
        <p className="mt-2 text-sm text-white/50">
          Prefere agilizar? Fale direto pelo WhatsApp:
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppButton source="obrigado" message="Oi! Acabei de enviar um orçamento pelo site e queria confirmar o recebimento.">
            <MessageCircle className="h-4 w-4" fill="currentColor" />
            Falar no WhatsApp
          </WhatsAppButton>
          <a
            href={`tel:${SITE_CONFIG.contact.phoneE164}`}
            onClick={() => trackPhone("obrigado")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/15"
          >
            <Phone className="h-4 w-4" />
            {SITE_CONFIG.contact.phone}
          </a>
        </div>

        {/* Stats de credibilidade */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3 w-full max-w-lg">
          {[
            { t: "+500", d: "projetos entregues" },
            { t: "10+",  d: "anos de experiência" },
            { t: "5.0★", d: "avaliação clientes" },
          ].map((s) => (
            <div key={s.d} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="font-display text-2xl font-bold text-energy">{s.t}</div>
              <div className="mt-1 text-xs text-white/50">{s.d}</div>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}

export default ThankYouPage;
