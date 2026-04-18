import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Phone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone, trackCTA } from "@/lib/analytics";
import { TopBar } from "@/components/TopBar";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/projetos", label: "Projetos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-40 w-full">
      <TopBar />
      <header
        className={`w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-border/50 bg-background/95 shadow-[0_2px_24px_-4px_oklch(0.11_0.045_255/0.10)] backdrop-blur-xl"
            : "border-border/30 bg-background/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 font-display font-bold text-foreground"
            onClick={() => setOpen(false)}
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[15px] font-bold tracking-tight">Master Elétrica</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Automatizada
              </span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex md:items-center md:gap-0.5">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent/60 hover:text-foreground ${
                    isActive
                      ? "text-foreground bg-primary/6 after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-gradient-energy"
                      : "text-muted-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* CTAs desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${SITE_CONFIG.contact.phoneE164}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
              onClick={() => trackPhone("header")}
            >
              <Phone className="h-4 w-4 text-primary" />
              <span className="hidden lg:inline">{SITE_CONFIG.contact.phone}</span>
            </a>
            <Button
              asChild
              size="sm"
              className="btn-shimmer bg-gradient-energy font-semibold text-energy-foreground shadow-energy transition-all duration-300 hover:scale-[1.04] hover:shadow-cta"
            >
              <Link to="/orcamento" onClick={() => trackCTA("orcamento", "header")}>
                Orçamento Grátis
              </Link>
            </Button>
          </div>

          {/* Hamburger mobile */}
          <button
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="border-t bg-background/98 backdrop-blur-xl md:hidden animate-fade-in">
            <nav className="mx-auto flex max-w-7xl flex-col gap-0.5 px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={`tel:${SITE_CONFIG.contact.phoneE164}`}
                className="mt-1.5 inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
                onClick={() => { trackPhone("header_mobile"); setOpen(false); }}
              >
                <Phone className="h-4 w-4 text-primary" />
                {SITE_CONFIG.contact.phone}
              </a>
              <Button
                asChild
                className="mt-2 bg-gradient-energy font-semibold text-energy-foreground shadow-energy"
              >
                <Link to="/orcamento" onClick={() => setOpen(false)}>
                  Orçamento Grátis
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
