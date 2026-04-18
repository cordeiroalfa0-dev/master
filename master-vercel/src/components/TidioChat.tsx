import { useEffect } from "react";

/**
 * Carrega o widget de chat ao vivo do Tidio.
 * Para ativar: crie uma conta em tidio.com, pegue seu Public Key
 * e substitua "SEU_PUBLIC_KEY" abaixo (ou configure via variável de ambiente).
 *
 * VITE_TIDIO_KEY=xxxxxxxxxxxxxxxxxxxx (no .env da Vercel)
 */
export function TidioChat() {
  const key = import.meta.env.VITE_TIDIO_KEY as string | undefined;

  useEffect(() => {
    if (!key) return;
    // Evita carregar duas vezes
    if (document.getElementById("tidio-script")) return;

    const script = document.createElement("script");
    script.id = "tidio-script";
    script.src = `//code.tidio.co/${key}.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup ao desmontar (SPA navigation)
      document.getElementById("tidio-script")?.remove();
    };
  }, [key]);

  return null;
}
