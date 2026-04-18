import { SITE_CONFIG } from "./site-config";

interface SeoMetaInput {
  title: string;
  description: string;
  path: string;
  /** Caminho relativo (ex: "/og-home.jpg") OU URL absoluta. Se omitido, usa OG default. */
  image?: string;
  /** "website" (default) ou "article" para posts de blog */
  type?: "website" | "article";
  /** Bloqueia indexação (ex: páginas de obrigado, admin) */
  noindex?: boolean;
}

const DEFAULT_OG_IMAGE = `${SITE_CONFIG.url}/og-default.jpg`;

/**
 * Gera o array de meta tags + links canônicos para uma rota.
 * Centraliza title/description/og/twitter/canonical/hreflang em um único helper.
 *
 * Uso:
 *   head: () => ({ ...buildSeo({ title, description, path: "/sobre" }) })
 */
export function buildSeo(input: SeoMetaInput) {
  const url = `${SITE_CONFIG.url}${input.path}`;
  const image = input.image
    ? input.image.startsWith("http")
      ? input.image
      : `${SITE_CONFIG.url}${input.image}`
    : DEFAULT_OG_IMAGE;
  const type = input.type ?? "website";

  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      ...(input.noindex
        ? [{ name: "robots", content: "noindex, follow" }]
        : [{ name: "robots", content: "index, follow" }]),

      // Open Graph (Facebook, LinkedIn, WhatsApp)
      { property: "og:title", content: input.title },
      { property: "og:description", content: input.description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: input.title },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: SITE_CONFIG.name },

      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: input.title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: input.title },
    ],
    links: [
      { rel: "canonical", href: url },
      // hreflang — pt-BR como única variante (pode expandir para pt-PT/es no futuro)
      { rel: "alternate", hrefLang: "pt-BR", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
}
