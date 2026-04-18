import { Link, useParams, Navigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { CheckCircle2, ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { WhatsAppButton } from "@/components/WhatsAppFloat";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, serviceSchema, faqSchema } from "@/lib/schema";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";
import resImg from "@/assets/service-residential.jpg";
import comImg from "@/assets/service-commercial.jpg";
import indImg from "@/assets/service-industrial.jpg";
import secImg from "@/assets/service-security.jpg";

interface ServiceData {
  title: string;
  shortDesc: string;
  longDesc: string;
  img: string;
  features: string[];
  benefits: string[];
  faq: Array<{ question: string; answer: string }>;
}

const SERVICES: Record<string, ServiceData> = {
  "automacao-residencial": {
    title: "Automação Residencial em Curitiba",
    shortDesc: "Casa inteligente com controle total via app e voz",
    longDesc: "Transforme sua residência em uma casa inteligente. Controle iluminação cênica, cortinas motorizadas, áudio multi-room, climatização e segurança através do celular ou comandos de voz. Integração com Alexa, Google Home e Apple HomeKit.",
    img: resImg,
    features: ["Iluminação cênica programável", "Cortinas e persianas motorizadas", "Áudio multi-room (Sonos, B&O)", "Climatização inteligente", "Cenas personalizadas (Bom dia, Cinema, Boa noite)", "Integração com assistentes de voz", "Controle por aplicativo dedicado", "Sensores de presença e luminosidade"],
    benefits: ["Conforto e praticidade no dia a dia", "Economia de energia até 30%", "Valorização do imóvel", "Maior segurança com simulação de presença"],
    faq: [
      { question: "Quanto custa automatizar uma casa em Curitiba?", answer: "O investimento varia conforme o tamanho do imóvel e o nível de automação desejado. Projetos partem de R$ 8.000 para apartamentos compactos. Solicite um orçamento gratuito para sua casa." },
      { question: "Posso automatizar apenas alguns ambientes?", answer: "Sim. Iniciamos por projetos modulares — sala, quarto principal ou cozinha — e expandimos conforme sua necessidade." },
      { question: "Funciona com Alexa e Google Home?", answer: "Sim. Trabalhamos com plataformas compatíveis com Alexa, Google Home e Apple HomeKit." },
    ],
  },
  "automacao-predial": {
    title: "Automação Predial em Curitiba",
    shortDesc: "Gestão inteligente de edifícios e condomínios",
    longDesc: "Sistemas integrados de automação para edifícios residenciais, comerciais e condomínios. Reduza custos operacionais com gestão energética inteligente, controle de acessos automatizado e monitoramento centralizado.",
    img: comImg,
    features: ["Controle de acesso veicular automatizado", "Catracas com biometria facial", "CFTV IP integrado", "Iluminação automatizada de áreas comuns", "Gestão de elevadores e bombas", "Sistema de incêndio integrado", "Portaria remota 24h", "Dashboard de monitoramento centralizado"],
    benefits: ["Redução de até 40% no consumo energético", "Maior segurança para moradores", "Eficiência operacional", "Valorização do empreendimento"],
    faq: [
      { question: "Atendem condomínios em Curitiba?", answer: "Sim. Atendemos condomínios em Batel, Ecoville, Champagnat, Centro Cívico e toda Curitiba. Apresentamos projeto técnico para assembleia." },
      { question: "Quanto tempo leva a implantação?", answer: "Projetos de pequeno porte: 2-4 semanas. Edifícios de grande porte: 2-4 meses, com fases de instalação que não interrompem operação." },
    ],
  },
  "automacao-industrial": {
    title: "Automação Industrial em Curitiba",
    shortDesc: "CLPs, SCADA, painéis elétricos e controle de processos",
    longDesc: "Soluções de automação industrial completas para indústrias em Curitiba e região. Programação de CLPs Siemens, Allen-Bradley e Omron. Painéis elétricos sob medida, supervisão SCADA, inversores de frequência e integração com ERPs.",
    img: indImg,
    features: ["Programação de CLPs (Siemens, Allen-Bradley, Omron)", "Supervisão SCADA personalizada", "Painéis elétricos sob medida", "Inversores de frequência (WEG, ABB)", "Sistemas de partida suave", "Integração com ERPs e MES", "Manutenção preventiva e corretiva", "Retrofit de máquinas antigas"],
    benefits: ["Aumento de produtividade", "Redução de paradas não planejadas", "Rastreabilidade da produção", "Eficiência energética industrial"],
    faq: [
      { question: "Trabalham com qual marca de CLP?", answer: "Programamos CLPs Siemens (S7-1200, S7-1500), Allen-Bradley (Micro & ControlLogix), Omron e Mitsubishi. Atendemos legados também." },
      { question: "Fazem manutenção preventiva?", answer: "Sim. Oferecemos planos de manutenção preventiva mensal, trimestral ou semestral com SLA de atendimento." },
    ],
  },
  "seguranca-eletronica": {
    title: "Segurança Eletrônica em Curitiba",
    shortDesc: "CFTV, alarmes e controle de acesso biométrico",
    longDesc: "Proteção completa para sua residência, condomínio ou empresa. Câmeras IP HD/4K, alarmes monitorados, controle de acesso biométrico e cercas elétricas. Trabalhamos com Intelbras, Hikvision e Dahua.",
    img: secImg,
    features: ["Câmeras IP HD e 4K (Intelbras, Hikvision, Dahua)", "Gravação em nuvem e local", "Alarme perimetral monitorado", "Sensores de movimento e abertura", "Controle de acesso biométrico (digital e facial)", "Interfones IP", "Cerca elétrica", "Visualização remota pelo celular"],
    benefits: ["Tranquilidade 24h", "Redução de risco de invasão", "Imagens em alta definição", "Acesso remoto pelo app"],
    faq: [
      { question: "Quantas câmeras minha casa precisa?", answer: "Depende do imóvel. Casas térreas geralmente usam 4-8 câmeras, sobrados 8-12. Fazemos visita técnica gratuita para projeto personalizado." },
      { question: "As gravações ficam onde?", answer: "Em DVR/NVR local com HDs de até 8TB e/ou em nuvem (mensalidade opcional). Você acessa de qualquer lugar pelo celular." },
    ],
  },
};


function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? SERVICES[slug] : undefined;

  usePageSeo({
    title: service ? `${service.title} — Master Elétrica` : "Serviço — Master Elétrica",
    description: service ? service.longDesc.slice(0, 158) : "",
    path: `/servicos/${slug}`,
  });

  if (!service) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Serviço não encontrado</h1>
        <Link to="/servicos" className="mt-4 inline-block text-primary hover:underline">
          Ver todos os serviços
        </Link>
      </div>
    );
  }

  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Serviços", url: "/servicos" },
          { name: service.title, url: `/servicos/${slug}` },
        ]),
        serviceSchema({ name: service.title, description: service.longDesc, slug }),
        faqSchema(service.faq),
      ]} />

      <section className="bg-gradient-hero py-12 text-white md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Link to="/servicos" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Todos os serviços
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-balance md:text-5xl">{service.title}</h1>
          <p className="mt-3 max-w-2xl text-white/80">{service.shortDesc}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <img
              src={service.img}
              alt={service.title}
              loading="eager"
              width={1024}
              height={768}
              className="aspect-[16/10] w-full rounded-2xl object-cover shadow-card"
            />
            <div className="prose prose-slate mt-8 max-w-none">
              <p className="text-lg text-muted-foreground">{service.longDesc}</p>
            </div>

            <h2 className="mt-10 font-display text-2xl font-bold">O que inclui</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl font-bold">Benefícios</h2>
            <ul className="mt-4 space-y-2">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-energy" />
                  {b}
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl font-bold">Perguntas frequentes</h2>
            <div className="mt-4 space-y-4">
              {service.faq.map((q) => (
                <details key={q.question} className="rounded-lg border bg-card p-4">
                  <summary className="cursor-pointer font-semibold">{q.question}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{q.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-bold">Solicite um orçamento</h3>
              <p className="mt-1 text-sm text-muted-foreground">Resposta em até 2h.</p>
              <div className="mt-4">
                <LeadForm defaultServico={service.title} source={`servico_${slug}`} />
              </div>
              <div className="mt-4 space-y-2 border-t pt-4">
                <WhatsAppButton source={`servico_${slug}`} className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white">
                  Falar no WhatsApp
                </WhatsAppButton>
                <Button asChild variant="outline" className="w-full">
                  <a href={`tel:${SITE_CONFIG.contact.phoneE164}`} onClick={() => trackPhone(`servico_${slug}`)}>
                    <Phone className="mr-2 h-4 w-4" /> {SITE_CONFIG.contact.phone}
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default ServiceDetail;
