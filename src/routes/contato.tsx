import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildSeo } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";

export const Route = createFileRoute("/contato")({
  head: () =>
    buildSeo({
      title: "Contato — Master Elétrica Automatizada Curitiba",
      description:
        "Fale com a Master Elétrica: (41) 99753-9084. Atendimento em Curitiba e região metropolitana. Orçamento gratuito em até 2h.",
      path: "/contato",
      image: "/og-contato.jpg",
    }),
  component: ContactPage,
});

function ContactPage() {
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
            Entre em contato e transforme seu espaço com automação inteligente. Orçamento sem compromisso.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">Canais de atendimento</h2>
            <div className="mt-6 space-y-4">
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

            <div className="mt-6">
              <WhatsAppButton source="contato_page" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-elegant md:w-auto">
                Conversar no WhatsApp
              </WhatsAppButton>
            </div>
          </div>

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
