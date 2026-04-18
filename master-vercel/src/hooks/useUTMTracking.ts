import { useEffect } from "react";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "ttclid",
] as const;

export type UTMData = Partial<Record<(typeof UTM_KEYS)[number], string>> & {
  pagina_origem?: string;
  referrer?: string;
};

const STORAGE_KEY = "me_utm_attribution";

/**
 * Captura UTMs e cliques de Ads na primeira chegada à sessão e persiste em sessionStorage.
 * Mantém atribuição mesmo quando o usuário navega entre páginas antes de converter.
 */
export function useUTMTracking() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const captured: UTMData = {};
      let hasNew = false;

      for (const key of UTM_KEYS) {
        const v = params.get(key);
        if (v) {
          captured[key] = v;
          hasNew = true;
        }
      }

      if (hasNew) {
        captured.pagina_origem = window.location.pathname;
        captured.referrer = document.referrer || "";
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
      } else if (!sessionStorage.getItem(STORAGE_KEY)) {
        // Primeira visita sem UTMs — guarda referrer/pagina mesmo assim
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            pagina_origem: window.location.pathname,
            referrer: document.referrer || "",
          }),
        );
      }
    } catch {
      // sessionStorage indisponível
    }
  }, []);
}

export function getUTMData(): UTMData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
