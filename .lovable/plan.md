# Plano Master Elétrica Automatizada — Site de Gestão de Tráfego

## Status: Fase 1 + Fase 2 (admin) ✅ CONCLUÍDAS

---

## O que está implementado

### Rotas públicas
- `/` — Home com hero, marcas, stats, serviços, processo, depoimentos, FAQ, CTA
- `/servicos` — Hub de serviços
- `/servicos/automacao-residencial` — Página individual com FAQ e formulário lateral
- `/servicos/automacao-predial`
- `/servicos/automacao-industrial`
- `/servicos/seguranca-eletronica`
- `/sobre` — Timeline da empresa + bairros atendidos
- `/projetos` — Portfólio com 11 projetos
- `/contato` — Canais de atendimento + formulário
- `/orcamento` — Landing page para campanhas pagas (multi-step form)
- `/obrigado` — Thank-you page com conversão GA4/Meta/TikTok
- `/politica-privacidade` — LGPD compliant
- `/termos` — Termos de uso
- `/sitemap.xml` — Gerado dinamicamente por SSR
- `/robots.txt` — Bloqueia /obrigado e /admin

### Rotas admin (autenticadas, role: admin)
- `/admin/login` — Login com Supabase Auth
- `/admin/leads` — Painel de leads: filtro por status, atribuição UTM, exportação CSV, atualização de status
- `/admin/configuracoes` — UI para colar IDs de tracking sem precisar de código

### SEO
- buildSeo() centralizado: title, description, og:*, twitter:*, canonical, hreflang pt-BR
- Schema.org JSON-LD: LocalBusiness, Service, BreadcrumbList, FAQPage, Review
- Geo meta tags: geo.region=BR-PR, geo.placename=Curitiba
- sitemap.xml com todas as rotas, prioridades e changefreq
- noindex em /obrigado e /admin/*

### Assets públicos (/public)
- favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
- OG images 1200x630 para todas as rotas (og-home.jpg, og-servicos.jpg, og-orcamento.jpg, og-sobre.jpg, og-contato.jpg, og-projetos.jpg, og-default.jpg, og-image.jpg, og-obrigado.jpg)
- OG images por serviço (og-servico-*.jpg para cada slug)

### Rastreamento
- GTM, GA4, Meta Pixel, TikTok Pixel, Clarity — via site_settings no banco
- Google Ads conversion via __GADS_ID__/__GADS_LABEL__ expostos pelo TrackingScripts
- Cookie consent bloqueia todos os scripts até aceite (LGPD compliant)
- Eventos: page_view, scroll_depth, whatsapp_click, phone_click, cta_click, form_step_advance, lead_submitted, conversion

### UTM Attribution
- Hook useUTMTracking: captura utm_*, gclid, fbclid, ttclid
- sessionStorage: mantém atribuição entre navegações
- Todos os campos salvos no banco junto com cada lead

### Backend Supabase
- leads: todos os campos de atribuição + status + ip_address (RLS: anon insere, admin lê)
- site_settings: IDs configuráveis via admin UI (RLS: público lê, admin escreve)
- user_roles: sistema de roles (RLS: admin gerencia)
- blog_posts: schema pronto para Fase 3

### Componentes CRO
- WhatsAppFloat fixo, MultiStepLeadForm com barra de progresso dinâmica real
- LeadForm completo, CookieConsent, TopBar com horário em tempo real, ScrollDepthTracker

---

## Fase 3 — Pendente
- /blog + /blog/$slug (listagem e posts individuais)
- /admin/blog (CMS — schema já criado no banco)
- Edge function submit-lead (email + Meta CAPI server-side)

---

## Checklist antes de ir ao ar
- [ ] Configurar domínio real em SITE_CONFIG.url (src/lib/site-config.ts)
- [ ] Colar IDs reais em /admin/configuracoes após deploy
- [ ] Criar usuário admin no Supabase Auth + inserir na tabela user_roles com role='admin'
- [ ] Substituir número de WhatsApp e email de contato reais
- [ ] Testar formulário → lead chegando no Supabase → /admin/leads
- [ ] Testar /obrigado → pixels disparando no GTM Preview
- [ ] Submeter sitemap.xml no Google Search Console
