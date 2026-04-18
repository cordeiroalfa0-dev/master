import { Link, useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { SITE_CONFIG } from "@/lib/site-config";

function TermsPage() {
  usePageSeo({
    title: "Termos de Uso — Master Elétrica",
    description: "Termos de uso da Master Elétrica Automatizada.",
    path: "/termos",
  });
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Termos de Uso</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold">1. Aceitação</h2>
          <p>Ao utilizar este site, você concorda com estes termos. Caso não concorde, por favor não utilize nossos serviços online.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">2. Conteúdo</h2>
          <p>Todo conteúdo (textos, imagens, projetos) é de propriedade da {SITE_CONFIG.name} e protegido por direitos autorais.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">3. Orçamentos</h2>
          <p>Orçamentos solicitados pelo site são preliminares e sujeitos a confirmação após visita técnica. Valores podem variar conforme escopo.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">4. Limitação de responsabilidade</h2>
          <p>Não nos responsabilizamos por uso indevido das informações deste site. Garantias específicas dos nossos serviços constam em contrato individual.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">5. Contato</h2>
          <p>Dúvidas? Fale conosco em <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-primary underline">{SITE_CONFIG.contact.email}</a>.</p>
        </section>
      </div>
    </article>
  );
}

export default TermsPage;
