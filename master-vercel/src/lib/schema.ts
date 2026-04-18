import { SITE_CONFIG } from "./site-config";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  name: SITE_CONFIG.name,
  image: `${SITE_CONFIG.url}/og-image.jpg`,
  "@id": SITE_CONFIG.url,
  url: SITE_CONFIG.url,
  telephone: SITE_CONFIG.contact.phoneE164,
  email: SITE_CONFIG.contact.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    addressCountry: "BR",
  },
  areaServed: [
    { "@type": "City", name: "Curitiba" },
    ...SITE_CONFIG.bairros.map((b) => ({
      "@type": "Place",
      name: `${b}, Curitiba`,
    })),
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "12:00",
    },
  ],
  sameAs: [SITE_CONFIG.social.instagram, SITE_CONFIG.social.facebook],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "127",
  },
};

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    provider: {
      "@type": "ElectricalContractor",
      name: SITE_CONFIG.name,
      telephone: SITE_CONFIG.contact.phoneE164,
    },
    areaServed: { "@type": "City", name: "Curitiba" },
    url: `${SITE_CONFIG.url}/servicos/${opts.slug}`,
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * Schema de avaliação individual (Review) — usado em depoimentos.
 * Combinado com aggregateRating no LocalBusiness, melhora rich snippets.
 */
export function reviewSchema(items: Array<{ author: string; rating: number; text: string; date?: string }>) {
  return items.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.name,
    },
    author: { "@type": "Person", name: r.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
    },
    reviewBody: r.text,
    ...(r.date ? { datePublished: r.date } : {}),
  }));
}
