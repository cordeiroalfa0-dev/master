import { MessageCircle } from "lucide-react";
import { trackWhatsApp } from "@/lib/analytics";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface Props {
  message?: string;
  source?: string;
}

export function WhatsAppFloat({ source = "floating" }: Props) {
  const { whatsappLink, phone } = useSiteSettings();

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(source)}
      aria-label={`Falar no WhatsApp ${phone}`}
      className="group fixed bottom-20 right-5 z-40 flex items-center gap-3 md:bottom-8 md:right-6"
    >
      {/* Tooltip — aparece ao hover */}
      <span className="pointer-events-none whitespace-nowrap rounded-xl border border-white/10 bg-[oklch(0.09_0.05_258)/0.96] px-3.5 py-2 text-xs font-semibold text-white shadow-elegant backdrop-blur opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block">
        Falar agora no WhatsApp
      </span>

      {/* Botão circular */}
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_32px_-4px_rgba(37,211,102,0.55)] transition-all duration-300 animate-pulse-glow hover:scale-110 hover:shadow-[0_12px_48px_-4px_rgba(37,211,102,0.80)]">
        <MessageCircle className="h-7 w-7" fill="currentColor" />
      </span>
    </a>
  );
}

export function WhatsAppButton({
  message,
  source = "page",
  className,
  children,
}: Props & { className?: string; children?: React.ReactNode }) {
  const { whatsappLink, whatsappMessage } = useSiteSettings();
  // Se vier message prop, sobrescreve o padrão do banco
  const href = message
    ? `https://wa.me/${whatsappLink.split("/")[3]?.split("?")[0]}?text=${encodeURIComponent(message)}`
    : whatsappLink;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsApp(source)}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_28px_-6px_rgba(37,211,102,0.50)] transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_40px_-6px_rgba(37,211,102,0.70)] hover:scale-[1.02]"
      }
    >
      <MessageCircle className="h-4 w-4" fill="currentColor" />
      {children ?? "Falar no WhatsApp"}
    </a>
  );
}
