/**
 * Helpers para enviar eventos para todas as plataformas de tracking ao mesmo tempo.
 * GTM dataLayer é a fonte unificada — você configura tags GA4/Meta/Ads dentro do GTM.
 * Também envia diretamente para gtag/fbq quando carregados (fallback / GTM-less).
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

export function trackEvent(
  event: string,
  params: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;

  // GTM dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  // GA4 direto
  window.gtag?.("event", event, params);

  // Meta Pixel (mapeia eventos comuns)
  if (window.fbq) {
    if (event === "lead_submitted" || event === "form_submit") {
      window.fbq("track", "Lead", params);
    } else if (event === "whatsapp_click" || event === "phone_click") {
      window.fbq("track", "Contact", params);
    } else if (event === "cta_click") {
      window.fbq("trackCustom", "CTAClick", params);
    }
  }

  // TikTok
  if (window.ttq) {
    if (event === "lead_submitted") window.ttq.track("SubmitForm", params);
    else if (event === "whatsapp_click" || event === "phone_click")
      window.ttq.track("Contact", params);
  }
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}

export function trackWhatsApp(source: string) {
  trackEvent("whatsapp_click", { source });
}

export function trackPhone(source: string) {
  trackEvent("phone_click", { source });
}

export function trackCTA(label: string, location: string) {
  trackEvent("cta_click", { label, location });
}

export function trackLead(servico?: string) {
  trackEvent("lead_submitted", { servico, value: 1, currency: "BRL" });
}
