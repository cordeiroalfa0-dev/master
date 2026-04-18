import { Phone, Clock, MapPin, Zap } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site-config";
import { trackPhone } from "@/lib/analytics";
import { useEffect, useState } from "react";

function useIsBusinessHours() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const day = now.getDay();
      const h = now.getHours();
      const isWeekday = day >= 1 && day <= 5 && h >= 8 && h < 18;
      const isSat = day === 6 && h >= 8 && h < 12;
      setOpen(isWeekday || isSat);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}

export function TopBar() {
  const isOpen = useIsBusinessHours();

  return (
    <div className="hidden border-b border-white/8 bg-[oklch(0.09_0.05_258)] text-white/80 lg:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-1.5 text-white/65">
            <MapPin className="h-3 w-3 text-energy/80" />
            {SITE_CONFIG.contact.address}
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/65">
            <Clock className="h-3 w-3 text-energy/80" />
            {SITE_CONFIG.contact.hours}
          </span>
        </div>

        <div className="flex items-center gap-5">
          {/* Status online/offline */}
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="relative flex h-1.5 w-1.5">
              {isOpen ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </>
              ) : (
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/25" />
              )}
            </span>
            {isOpen ? (
              <span className="text-success/90">Atendendo agora · resposta em até 2h</span>
            ) : (
              <span className="text-white/40">Fora do horário · deixe sua mensagem</span>
            )}
          </span>

          {/* Badge visita grátis */}
          <span className="inline-flex items-center gap-1 rounded-full border border-energy/25 bg-energy/12 px-2.5 py-0.5 text-[11px] font-semibold text-energy">
            <Zap className="h-2.5 w-2.5" strokeWidth={2.5} />
            Visita técnica grátis
          </span>

          {/* Telefone */}
          <a
            href={`tel:${SITE_CONFIG.contact.phoneE164}`}
            onClick={() => trackPhone("topbar")}
            className="inline-flex items-center gap-1.5 font-bold text-white/90 transition-colors hover:text-energy"
          >
            <Phone className="h-3 w-3" />
            {SITE_CONFIG.contact.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
