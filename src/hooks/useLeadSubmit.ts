/**
 * Hook centralizado para submissão de leads ao Supabase.
 * Elimina duplicação entre LeadForm e MultiStepLeadForm.
 * Inclui: captura de UTM, tracking de analytics, redirect para /obrigado.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getUTMData } from "@/hooks/useUTMTracking";
import { trackLead } from "@/lib/analytics";

export interface LeadPayload {
  nome: string;
  telefone: string;
  email?: string | null;
  servico?: string | null;
  mensagem?: string | null;
}

interface Options {
  source?: string;
  redirectOnSuccess?: boolean;
  onSuccess?: () => void;
}

export function useLeadSubmit({ source = "form", redirectOnSuccess = true, onSuccess }: Options = {}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function submit(payload: LeadPayload): Promise<boolean> {
    setServerError(null);
    setLoading(true);

    const utm = getUTMData();
    const { error } = await supabase.from("leads").insert({
      nome: payload.nome,
      telefone: payload.telefone,
      email: payload.email ?? null,
      servico: payload.servico ?? null,
      mensagem: payload.mensagem ?? null,
      utm_source:   utm.utm_source   ?? null,
      utm_medium:   utm.utm_medium   ?? null,
      utm_campaign: utm.utm_campaign ?? null,
      utm_content:  utm.utm_content  ?? null,
      utm_term:     utm.utm_term     ?? null,
      gclid:   utm.gclid  ?? null,
      fbclid:  utm.fbclid ?? null,
      ttclid:  utm.ttclid ?? null,
      pagina_origem: typeof window !== "undefined" ? window.location.pathname : null,
      referrer: utm.referrer ?? (typeof document !== "undefined" ? document.referrer : null),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      _form_source: source,
    });

    setLoading(false);

    if (error) {
      setServerError("Não foi possível enviar agora. Tente pelo WhatsApp.");
      return false;
    }

    trackLead(payload.servico ?? undefined);
    onSuccess?.();

    if (redirectOnSuccess) {
      navigate("/obrigado");
    }

    return true;
  }

  return { submit, loading, serverError, setServerError };
}
