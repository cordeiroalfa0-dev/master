interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Injeta JSON-LD structured data para SEO (Schema.org).
 * Use em rotas para descrever LocalBusiness, Service, BreadcrumbList, FAQPage etc.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
