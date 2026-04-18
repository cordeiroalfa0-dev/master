/**
 * Configurações estáticas do site Master Elétrica Automatizada.
 * IDs de tracking dinâmicos vêm de site_settings (DB).
 */
export const SITE_CONFIG = {
  name: "Master Elétrica Automatizada",
  shortName: "Master Elétrica",
  tagline: "Automação que transforma seu espaço",
  description:
    "Soluções completas em automação residencial, predial e industrial em Curitiba e região metropolitana. Mais de 500 projetos entregues.",
  // ⚠️  ANTES DE IR AO AR: substitua pelo domínio real (afeta canonical tags e sitemap)
  url: "https://mastereletrica.com.br",
  locale: "pt-BR",
  region: "Curitiba, PR",

  contact: {
    phone: "(41) 99753-9084",
    phoneE164: "+5541997539084",
    whatsappNumber: "5541997539084",
    email: "contato@mastereletrica.com.br",
    address: "Curitiba e Região Metropolitana - PR",
    hours: "Seg a Sex: 8h às 18h | Sáb: 8h às 12h",
  },

  social: {
    instagram: "https://instagram.com/mastereletrica",
    facebook: "https://facebook.com/mastereletrica",
  },

  bairros: [
    "Batel", "Ecoville", "Champagnat", "Bigorrilho", "Água Verde",
    "Cabral", "Juvevê", "Centro Cívico", "Mercês", "Alto da XV",
    "CIC", "Centro", "Boqueirão",
  ],

  services: [
    { slug: "automacao-residencial", title: "Automação Residencial" },
    { slug: "automacao-predial", title: "Automação Predial" },
    { slug: "automacao-industrial", title: "Automação Industrial" },
    { slug: "seguranca-eletronica", title: "Segurança Eletrônica" },
  ],
} as const;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message || "Olá! Gostaria de solicitar um orçamento.",
  );
  return `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${text}`;
}
