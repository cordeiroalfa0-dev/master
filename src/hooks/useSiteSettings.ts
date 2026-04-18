/**
 * Hook que busca as configurações dinâmicas do site (site_settings) do Supabase.
 * Usa os valores do SITE_CONFIG como fallback enquanto carrega ou em caso de erro.
 *
 * Isso unifica a fonte de verdade: o admin configura uma vez em /admin/configuracoes
 * e todos os componentes recebem o valor atualizado — sem precisar de redeploy.
 *
 * Uso:
 *   const { phone, email, whatsappLink } = useSiteSettings();
 */

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_CONFIG } from "@/lib/site-config";

interface SiteSettings {
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappLink: string;
  /** true enquanto a query ainda não terminou */
  loading: boolean;
}

// Cache em módulo — evita refetch a cada remount durante a sessão
let _cache: SiteSettings | null = null;
let _promise: Promise<SiteSettings> | null = null;

function buildWhatsappLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function fallback(): SiteSettings {
  return {
    phone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    whatsappNumber: SITE_CONFIG.contact.whatsappNumber,
    whatsappMessage: "Olá! Gostaria de solicitar um orçamento.",
    whatsappLink: buildWhatsappLink(
      SITE_CONFIG.contact.whatsappNumber,
      "Olá! Gostaria de solicitar um orçamento.",
    ),
    loading: false,
  };
}

async function fetchSettings(): Promise<SiteSettings> {
  if (_cache) return _cache;

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["contact_phone", "contact_email", "whatsapp_number", "whatsapp_message"]);

  if (error || !data?.length) return fallback();

  const map = Object.fromEntries(data.map((r) => [r.key, r.value ?? ""]));

  const phone           = map["contact_phone"]    || SITE_CONFIG.contact.phone;
  const email           = map["contact_email"]    || SITE_CONFIG.contact.email;
  const whatsappNumber  = map["whatsapp_number"]  || SITE_CONFIG.contact.whatsappNumber;
  const whatsappMessage = map["whatsapp_message"] || "Olá! Gostaria de solicitar um orçamento.";

  const settings: SiteSettings = {
    phone,
    email,
    whatsappNumber,
    whatsappMessage,
    whatsappLink: buildWhatsappLink(whatsappNumber, whatsappMessage),
    loading: false,
  };

  _cache = settings;
  return settings;
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(
    _cache ?? { ...fallback(), loading: true },
  );

  useEffect(() => {
    if (_cache) {
      setSettings(_cache);
      return;
    }
    if (!_promise) _promise = fetchSettings();
    _promise.then(setSettings);
  }, []);

  return settings;
}

/** Invalidar cache manualmente (ex: após salvar em /admin/configuracoes) */
export function invalidateSiteSettingsCache() {
  _cache = null;
  _promise = null;
}
