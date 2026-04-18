import { Link } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Home, Building2, Factory, Shield, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import resImg from "@/assets/service-residential.jpg";
import comImg from "@/assets/service-commercial.jpg";
import indImg from "@/assets/service-industrial.jpg";
import secImg from "@/assets/service-security.jpg";

const SERVICES = [
  { slug: "automacao-residencial", icon: Home, title: "Automação Residencial", desc: "Casa inteligente: iluminação, climatização, cortinas motorizadas, áudio multi-room e segurança integrados.", img: resImg, items: ["Iluminação cênica", "Cortinas motorizadas", "Áudio multi-room", "Climatização inteligente"] },
  { slug: "automacao-predial", icon: Building2, title: "Automação Predial", desc: "Gestão inteligente de edifícios comerciais e residenciais com eficiência energética.", img: comImg, items: ["Controle de acessos", "CFTV integrado", "Iluminação automatizada", "Gestão de áreas comuns"] },
  { slug: "automacao-industrial", icon: Factory, title: "Automação Industrial", desc: "Programação de CLPs, painéis elétricos, SCADA e sistemas de controle de processos.", img: indImg, items: ["CLPs Siemens & Allen-Bradley", "Painéis elétricos", "Supervisão SCADA", "Inversores de frequência"] },
  { slug: "seguranca-eletronica", icon: Shield, title: "Segurança Eletrônica", desc: "Alarmes, CFTV IP e controle de acesso biométrico para residências, condomínios e empresas.", img: secImg, items: ["CFTV IP HD/4K", "Controle de acesso biométrico", "Alarme perimetral", "Portaria remota 24h"] },
];

function ServicesIndex() {
  usePageSeo({ title: "Nossos Serviços — Master Elétrica", description: "Serviços de automação residencial, predial e industrial em Curitiba.", path: "/servicos" });
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Início", url: "/" },
        { name: "Serviços", url: "/servicos" },
      ])} />

      <section className="bg-gradient-hero py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="font-display text-4xl font-bold text-balance md:text-6xl">Nossos Serviços</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Soluções completas em automação para residências, edifícios e indústrias em Curitiba.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="space-y-12 md:space-y-16">
          {SERVICES.map((s, idx) => (
            <article
              key={s.slug}
              className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${idx % 2 ? "md:[&>*:first-child]:order-last" : ""}`}
            >
              <div className="overflow-hidden rounded-2xl shadow-card transition-all duration-300 group-hover:shadow-card-hover">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-gradient-primary group-hover:text-primary-foreground group-hover:shadow-elegant">
                  <s.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">{s.title}</h2>
                <p className="mt-3 text-muted-foreground">{s.desc}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {it}
                    </li>
                  ))}
                </ul>
                <Link to={`/servicos/${s.slug}`}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                >
                  Saiba mais <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default ServicesIndex;
