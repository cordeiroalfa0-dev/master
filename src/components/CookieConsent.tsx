import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("me_cookie_consent");
    if (!status) setShow(true);
  }, []);

  function setStatus(value: "accepted" | "declined") {
    localStorage.setItem("me_cookie_consent", value);
    window.dispatchEvent(new Event("me:consent-changed"));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border bg-card p-4 shadow-elegant md:bottom-6 md:left-6 md:right-auto md:p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            Usamos cookies para melhorar sua experiência
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Utilizamos cookies de análise e marketing para entender como você
            usa nosso site e personalizar anúncios. Veja nossa{" "}
            <Link
              to="/politica-privacidade"
              className="underline hover:text-primary"
            >
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setStatus("accepted")}>
              Aceitar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatus("declined")}
            >
              Recusar
            </Button>
          </div>
        </div>
        <button
          onClick={() => setStatus("declined")}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
