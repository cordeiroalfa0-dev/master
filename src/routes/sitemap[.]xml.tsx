import { createFileRoute } from "@tanstack/react-router";
import { SITE_CONFIG } from "@/lib/site-config";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/servicos", priority: "0.9", changefreq: "monthly" },
  { path: "/servicos/automacao-residencial", priority: "0.9", changefreq: "monthly" },
  { path: "/servicos/automacao-predial", priority: "0.9", changefreq: "monthly" },
  { path: "/servicos/automacao-industrial", priority: "0.9", changefreq: "monthly" },
  { path: "/servicos/seguranca-eletronica", priority: "0.9", changefreq: "monthly" },
  { path: "/projetos", priority: "0.8", changefreq: "monthly" },
  { path: "/sobre", priority: "0.7", changefreq: "monthly" },
  { path: "/contato", priority: "0.8", changefreq: "monthly" },
  { path: "/orcamento", priority: "0.9", changefreq: "monthly" },
  { path: "/politica-privacidade", priority: "0.3", changefreq: "yearly" },
  { path: "/termos", priority: "0.3", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const urls = STATIC_ROUTES.map(
          (r) => `  <url>
    <loc>${SITE_CONFIG.url}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
        ).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
