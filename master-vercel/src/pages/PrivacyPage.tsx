import { Link, useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { SITE_CONFIG } from "@/lib/site-config";

function PrivacyPage() {
  usePageSeo({
    title: "Política de Privacidade — Master Elétrica",
    description: "Política de privacidade da Master Elétrica Automatizada.",
    path: "/politica-privacidade",
  });
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold">1. Quem somos</h2>
          <p>{SITE_CONFIG.name}, sediada em {SITE_CONFIG.contact.address}, é responsável pelos dados pessoais coletados neste site.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">2. Dados que coletamos</h2>
          <ul className="ml-6 list-disc space-y-1">
            <li>Dados de contato fornecidos voluntariamente em formulários (nome, telefone, email, mensagem)</li>
            <li>Dados de navegação e marketing (UTMs, página de origem, referrer, navegador)</li>
            <li>Endereço IP — coletado automaticamente para fins de segurança e prevenção de spam, com base no legítimo interesse (art. 7º, IX, LGPD). Os dados são armazenados apenas enquanto necessários para essa finalidade.</li>
            <li>Cookies de análise (Google Analytics) e marketing (Meta, Google Ads, TikTok), apenas com seu consentimento</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">3. Finalidade</h2>
          <p>Utilizamos seus dados para responder a solicitações de orçamento, melhorar nosso site e mensurar campanhas de marketing.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">4. Compartilhamento</h2>
          <p>Não vendemos seus dados. Compartilhamos apenas com provedores essenciais (Google, Meta) para análise de marketing, conforme suas próprias políticas.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">5. Seus direitos (LGPD)</h2>
          <p>Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pelo email <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-primary underline">{SITE_CONFIG.contact.email}</a>.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">6. Cookies</h2>
          <p>Você pode aceitar ou recusar cookies de análise/marketing pelo banner exibido na sua primeira visita. Cookies essenciais ao funcionamento do site são sempre utilizados.</p>
        </section>
      </div>
    </article>
  );
}

export default PrivacyPage;
