import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Zap, Instagram, Facebook, ShieldCheck, Award, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone, trackWhatsApp } from "@/lib/analytics";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const TRUST = [
  { icon: ShieldCheck, label: "Equipe certificada" },
  { icon: Award,       label: "+10 anos de mercado" },
  { icon: Zap,         label: "Garantia em todos os serviços" },
];

export function Footer() {
  // Dados dinâmicos do banco; fallback automático para SITE_CONFIG enquanto carrega
  const { phone, email, whatsappLink } = useSiteSettings();

  return (
    <footer className="relative border-t bg-surface">
      {/* Faixa de credibilidade */}
      <div className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:grid-cols-3 md:px-6">
          {TRUST.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-center gap-3 text-sm font-medium text-foreground sm:justify-start"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <t.icon className="h-4 w-4" />
              </span>
              {t.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 font-display font-bold">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
                <Zap className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold">Master Elétrica</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Automatizada
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Automação residencial, predial e industrial em Curitiba. Mais de 500 projetos
              entregues com excelência técnica e suporte dedicado.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                onClick={() => trackWhatsApp("footer_social")}
                className="grid h-9 w-9 place-items-center rounded-xl bg-[#25D366] text-white shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_20px_-4px_rgba(37,211,102,0.55)]"
              >
                <MessageCircle className="h-4 w-4" fill="currentColor" />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-xl border bg-card text-muted-foreground transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:text-primary"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-xl border bg-card text-muted-foreground transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Serviços */}
          <div className="md:col-span-2">
            <h3 className="font-display text-sm font-semibold text-foreground">Serviços</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {SITE_CONFIG.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/servicos/$slug"
                    params={{ slug: s.slug }}
                    className="transition-colors hover:text-primary"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div className="md:col-span-2">
            <h3 className="font-display text-sm font-semibold text-foreground">Empresa</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/sobre" className="transition-colors hover:text-primary">Sobre nós</Link></li>
              <li><Link to="/projetos" className="transition-colors hover:text-primary">Projetos</Link></li>
              <li><Link to="/contato" className="transition-colors hover:text-primary">Contato</Link></li>
              <li><Link to="/orcamento" className="transition-colors hover:text-primary">Orçamento</Link></li>
              <li><Link to="/politica-privacidade" className="transition-colors hover:text-primary">Privacidade</Link></li>
              <li><Link to="/termos" className="transition-colors hover:text-primary">Termos</Link></li>
            </ul>
          </div>

          {/* Contato — dados dinâmicos do banco via useSiteSettings */}
          <div className="md:col-span-4">
            <h3 className="font-display text-sm font-semibold text-foreground">Contato</h3>
            <ul className="mt-4 space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="font-medium text-foreground transition-colors hover:text-primary"
                  onClick={() => trackPhone("footer")}
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${email}`} className="break-all transition-colors hover:text-primary">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{SITE_CONFIG.contact.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{SITE_CONFIG.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bairros atendidos — SEO local */}
        <div className="mt-12 border-t pt-8">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Atendemos em Curitiba
          </h4>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SITE_CONFIG.bairros.map((b) => (
              <span
                key={b}
                className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. Todos os direitos reservados.
          </div>
          <Link
            to="/admin/login"
            className="text-[11px] text-muted-foreground/35 transition-colors hover:text-muted-foreground"
          >
            Admin
          </Link>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            CNPJ ativo · Curitiba/PR
          </div>
        </div>
      </div>
    </footer>
  );
}
