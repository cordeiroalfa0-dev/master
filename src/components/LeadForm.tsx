import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SITE_CONFIG } from "@/lib/site-config";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  email: z.string().trim().email("Email inválido").max(255).optional().or(z.literal("")),
  telefone: z
    .string()
    .trim()
    .min(8, "Informe um telefone válido")
    .max(20)
    .regex(/^[0-9()+\-\s]+$/, "Telefone inválido"),
  servico: z.string().max(100).optional(),
  mensagem: z.string().trim().max(1000).optional(),
});

interface Props {
  defaultServico?: string;
  source?: string;
  redirectOnSuccess?: boolean;
}

export function LeadForm({
  defaultServico,
  source = "form",
  redirectOnSuccess = true,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const { submit, loading, serverError } = useLeadSubmit({
    source,
    redirectOnSuccess,
    onSuccess: () => setSuccess(true),
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);

    // Honeypot anti-bot: bots preenchem campos ocultos, humanos não
    if (fd.get("website")) return;

    const raw = {
      nome: String(fd.get("nome") || ""),
      email: String(fd.get("email") || ""),
      telefone: String(fd.get("telefone") || ""),
      servico: String(fd.get("servico") || defaultServico || ""),
      mensagem: String(fd.get("mensagem") || ""),
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      return;
    }

    await submit({
      nome: parsed.data.nome,
      telefone: parsed.data.telefone,
      email: parsed.data.email || null,
      servico: parsed.data.servico || null,
      mensagem: parsed.data.mensagem || null,
    });
  }

  if (success && !redirectOnSuccess) {
    return (
      <div className="rounded-2xl border border-success/25 bg-success/8 p-7 text-center animate-scale-in">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <p className="mt-3 font-display text-base font-bold text-foreground">Mensagem recebida!</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Entraremos em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-form-source={source}>
      {/* Honeypot anti-bot: deve permanecer invisível para usuários reais */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
      />

      <div>
        <Label htmlFor="nome" className="text-sm font-medium">Nome *</Label>
        <Input
          id="nome"
          name="nome"
          required
          maxLength={100}
          className="mt-1.5 transition-shadow focus-visible:shadow-[0_0_0_3px_oklch(0.36_0.22_258/0.18)]"
          placeholder="Seu nome completo"
        />
        {errors.nome && <p className="mt-1 text-xs text-destructive">{errors.nome}</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="telefone" className="text-sm font-medium">WhatsApp / Telefone *</Label>
          <Input
            id="telefone"
            name="telefone"
            required
            placeholder="(41) 9 9999-9999"
            maxLength={20}
            className="mt-1.5 transition-shadow focus-visible:shadow-[0_0_0_3px_oklch(0.36_0.22_258/0.18)]"
          />
          {errors.telefone && (
            <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            maxLength={255}
            className="mt-1.5 transition-shadow focus-visible:shadow-[0_0_0_3px_oklch(0.36_0.22_258/0.18)]"
            placeholder="seu@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="servico" className="text-sm font-medium">Tipo de serviço</Label>
        <Select name="servico" defaultValue={defaultServico}>
          <SelectTrigger id="servico" className="mt-1.5">
            <SelectValue placeholder="Selecione o serviço" />
          </SelectTrigger>
          <SelectContent>
            {SITE_CONFIG.services.map((s) => (
              <SelectItem key={s.slug} value={s.title}>
                {s.title}
              </SelectItem>
            ))}
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="mensagem" className="text-sm font-medium">Conte-nos sobre seu projeto</Label>
        <Textarea
          id="mensagem"
          name="mensagem"
          rows={3}
          maxLength={1000}
          className="mt-1.5 resize-none transition-shadow focus-visible:shadow-[0_0_0_3px_oklch(0.36_0.22_258/0.18)]"
          placeholder="Tipo de imóvel, área aproximada, prazo desejado..."
        />
      </div>

      {serverError && (
        <p className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="btn-shimmer w-full bg-gradient-energy font-semibold text-energy-foreground shadow-energy transition-all duration-300 hover:scale-[1.02] hover:shadow-cta disabled:opacity-70 disabled:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Solicitar Orçamento Grátis"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        🔒 Resposta em até 2h · Seus dados estão protegidos.
      </p>
    </form>
  );
}
