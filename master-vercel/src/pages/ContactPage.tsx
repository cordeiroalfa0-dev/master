import { useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";

function ContactPage() {
  usePageSeo({
    title: "Contato — Master Elétrica Automatizada | Curitiba",
    description: "Fale com a Master Elétrica Automatizada. Atendimento em Curitiba e região. Orçamento grátis em até 2h.",
    path: "/contato",
  });

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Contato", url: "/contato" },
      ])} />

      <section className="bg-gradient-hero py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="font-display text-4xl font-bold text-balance md:text-6xl">Fale Conosco</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Entre em contato e transforme seu espaço com automação inteligente. Orçamento sem compromisso em até 2h.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Coluna esquerda — info + mapa */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl font-bold">Canais de atendimento</h2>

            <div className="space-y-3">
              {[
                { icon: Phone, label: "Telefone", value: SITE_CONFIG.contact.phone, href: `tel:${SITE_CONFIG.contact.phoneE164}`, onClick: () => trackPhone("contato") },
                { icon: Mail, label: "Email", value: SITE_CONFIG.contact.email, href: `mailto:${SITE_CONFIG.contact.email}` },
                { icon: MapPin, label: "Localização", value: SITE_CONFIG.contact.address },
                { icon: Clock, label: "Horário", value: SITE_CONFIG.contact.hours },
              ].map((c) => (
                <div key={c.label} className="flex gap-4 rounded-xl border bg-card p-4 shadow-card">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold uppercase text-muted-foreground">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} onClick={c.onClick} className="block break-words text-sm font-medium hover:text-primary">
                        {c.value}
                      </a>
                    ) : (
                      <div className="text-sm font-medium">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <WhatsAppButton source="contato_page" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-elegant transition-all hover:opacity-90 md:w-auto">
              Conversar no WhatsApp
            </WhatsAppButton>

            {/* Google Maps embed — Curitiba */}
            <div className="overflow-hidden rounded-2xl border shadow-card">
              <iframe
                title="Master Elétrica Automatizada — Curitiba"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115669.23795774792!2d-49.3522878!3d-25.4295963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce3dc3b66817b%3A0xa1dcee3f5af9f5f0!2sCuritiba%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="280"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Coluna direita — formulário */}
          <div className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
            <h2 className="font-display text-xl font-bold">Envie sua mensagem</h2>
            <p className="mt-1 text-sm text-muted-foreground">Resposta em até 2h em horário comercial.</p>
            <div className="mt-5">
              <LeadForm source="contato_form" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
