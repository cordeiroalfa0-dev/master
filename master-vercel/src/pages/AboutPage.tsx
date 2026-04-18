import { Link, useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Award, Target, Eye, Heart, MapPin } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/site-config";

const TIMELINE = [
  { year: "2015", text: "Fundação da Master Elétrica Automatizada em Curitiba" },
  { year: "2017", text: "Primeiros grandes projetos de automação predial" },
  { year: "2019", text: "Expansão para automação industrial e parcerias com indústrias" },
  { year: "2021", text: "Marco de 300+ projetos entregues com excelência" },
  { year: "2023", text: "Referência em automação inteligente no Paraná" },
  { year: "2025", text: "Inovação contínua com IoT e inteligência artificial" },
];

function AboutPage() {
  usePageSeo({
    title: "Sobre — Master Elétrica Automatizada",
    description: "Conheça a Master Elétrica Automatizada, especialistas em automação em Curitiba.",
    path: "/sobre",
  });
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Sobre", url: "/sobre" },
      ])} />

      <section className="bg-gradient-hero py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-energy">Sobre nós</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-balance md:text-6xl">
            Master Elétrica Automatizada
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Com vasta experiência em projetos residenciais, prediais e industriais, somos referência em automação inteligente em <strong>Curitiba e região metropolitana</strong>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { icon: Target, title: "Missão", text: "Transformar ambientes através da automação inteligente, oferecendo soluções que unem tecnologia, segurança e eficiência." },
            { icon: Eye, title: "Visão", text: "Ser referência em automação no Paraná, reconhecida pela excelência técnica e inovação constante." },
            { icon: Heart, title: "Valores", text: "Compromisso, qualidade, inovação, transparência e respeito. Cada projeto é tratado com dedicação." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/15">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Nossa trajetória</span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Nossa História</h2>
            <p className="mt-4 text-muted-foreground">
              Uma jornada de dedicação, crescimento e inovação no mercado de automação.
            </p>
          </div>
          <div className="mt-12 space-y-6">
            {TIMELINE.map((t, i) => (
              <div key={t.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-primary font-display font-bold text-primary-foreground shadow-elegant ring-4 ring-surface">
                    <Award className="h-5 w-5" />
                  </div>
                  {i < TIMELINE.length - 1 && <div className="mt-2 h-full min-h-[40px] w-px bg-border" />}
                </div>
                <div className="pb-6">
                  <div className="font-display text-2xl font-bold text-primary tracking-tight">{t.year}</div>
                  <p className="mt-1 text-sm text-foreground">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="rounded-2xl border bg-card p-8 md:p-12">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold">Bairros que atendemos em Curitiba</h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {SITE_CONFIG.bairros.map((b) => (
              <span key={b} className="rounded-full border bg-surface px-3.5 py-1.5 text-sm font-medium">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
