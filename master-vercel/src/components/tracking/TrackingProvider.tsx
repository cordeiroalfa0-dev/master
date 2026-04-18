import { useEffect } from "react";
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { trackPageView } from "@/lib/analytics";

/**
 * Inicializa tracking client-side: captura UTMs e envia page_view em mudanças de rota.
 */
export function TrackingProvider({ children }: { children: React.ReactNode }) {
  useUTMTracking();

  useEffect(() => {
    if (typeof window === "undefined") return;
    let last = window.location.pathname;
    trackPageView(last);
    const obs = setInterval(() => {
      const cur = window.location.pathname;
      if (cur !== last) {
        last = cur;
        trackPageView(cur);
      }
    }, 500);
    return () => clearInterval(obs);
  }, []);

  return <>{children}</>;
}
