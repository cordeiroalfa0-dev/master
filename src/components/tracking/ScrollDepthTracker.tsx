import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";

const THRESHOLDS = [25, 50, 75, 100] as const;

/**
 * Dispara evento `scroll_depth` quando o usuário cruza 25 / 50 / 75 / 100% da página.
 * Reseta a cada mudança de rota para medir engajamento por página.
 */
export function ScrollDepthTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fired = new Set<number>();

    const handler = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const winHeight = window.innerHeight || doc.clientHeight;
      const docHeight = doc.scrollHeight - winHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));

      for (const t of THRESHOLDS) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t);
          trackEvent("scroll_depth", {
            percent: t,
            page_path: location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [location.pathname]);

  return null;
}
