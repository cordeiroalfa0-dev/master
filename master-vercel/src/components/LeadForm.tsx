import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Telefone inválido"),
});

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2)  return `(${d}`;
  if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  return v;
}

interface Props {
  defaultServico?: string;
  source?: string;
  redirectOnSuccess?: boolean;
}

export function LeadForm({ defaultServico, source = "form", redirectOnSuccess = true }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [telefone, setTelefone] = useState("");
  const [success, setSuccess] = useState(false);
  const [hp, setHp] = useState("");

  const { submit, loading, serverError } = useLeadSubmit({
    source,
    redirectOnSuccess,
    onSuccess: () => setSuccess(true),
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (hp) return;
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      nome: String(fd.get("nome") || ""),
      telefone: String(fd.get("telefone") || ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    await submit({ nome: parsed.data.nome, telefone: parsed.data.telefone, servico: defaultServico ?? null, email: null, mensagem: null });
  }

  if (success && !redirectOnSuccess) {
    return (
      <div className="rounded-2xl border border-success/25 bg-success/8 p-7 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <p className="mt-3 font-display text-base font-bold">Mensagem recebida!</p>
        <p className="mt-1.5 text-sm text-muted-foreground">Entraremos em contato em breve.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-form-source={source}>
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp}
        onChange={(e) => setHp(e.target.value)}
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

      <div>
        <Label htmlFor="nome" className="text-sm font-medium">Nome *</Label>
        <Input id="nome" name="nome" required maxLength={100} className="mt-1.5" placeholder="Seu nome completo" />
        {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome}</p>}
      </div>

      <div>
        <Label htmlFor="telefone" className="text-sm font-medium">WhatsApp / Telefone *</Label>
        <Input id="telefone" name="telefone" required inputMode="numeric" maxLength={20}
          className="mt-1.5" placeholder="(41) 9 9999-9999"
          value={telefone} onChange={(e) => setTelefone(maskPhone(e.target.value))} />
        {errors.telefone && <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>}
      </div>

      {serverError && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" size="lg" disabled={loading}
        className="btn-shimmer w-full bg-gradient-energy font-semibold text-energy-foreground shadow-energy transition-all duration-300 hover:scale-[1.02] hover:shadow-cta disabled:opacity-70 disabled:scale-100">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</> : "Solicitar Orçamento Grátis"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">🔒 Resposta em até 2h · Seus dados estão protegidos.</p>
    </form>
  );
}
