import { useState } from "react";
import { z } from "zod";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Lock, Home, Building2, Factory, Shield, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import resImg from "@/assets/service-residential.jpg";
import comImg from "@/assets/service-commercial.jpg";
import indImg from "@/assets/service-industrial.jpg";
import secImg from "@/assets/service-security.jpg";

const schema = z.object({
  servico: z.string().min(2).max(100),
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  telefone: z.string().trim().min(8, "Telefone inválido").max(20).regex(/^[\d()\-\s+]+$/, "Use apenas números"),
});

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2)  return `(${d}`;
  if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
  if (d.length <= 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  return v;
}

const SERVICES_OPTIONS = [
  { label: "Automação Residencial", value: "Automação Residencial", icon: Home, img: resImg, desc: "Casa inteligente, iluminação e conforto" },
  { label: "Automação Predial", value: "Automação Predial", icon: Building2, img: comImg, desc: "Condomínios e edifícios comerciais" },
  { label: "Automação Industrial", value: "Automação Industrial", icon: Factory, img: indImg, desc: "CLPs, SCADA e painéis elétricos" },
  { label: "Segurança Eletrônica", value: "Segurança Eletrônica", icon: Shield, img: secImg, desc: "CFTV, alarmes e controle de acesso" },
  { label: "Outro / Não tenho certeza", value: "Outro", icon: HelpCircle, img: null, desc: "Vamos entender sua necessidade" },
];

interface Props { source?: string; onStepChange?: (step: number, total: number) => void; }

export function MultiStepLeadForm({ source = "multistep", onStepChange }: Props) {
  const totalSteps = 2;
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ servico: "", nome: "", telefone: "", _hp: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submit, loading, serverError } = useLeadSubmit({ source });

  function update<K extends keyof typeof data>(key: K, value: string) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function next() {
    if (!data.servico) { setErrors({ servico: "Escolha uma opção para continuar" }); return; }
    trackEvent("form_step_advance", { source, from: step, to: 2 });
    setStep(2);
    onStepChange?.(2, totalSteps);
  }

  async function handleSubmit() {
    if (data._hp) return;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    await submit({ nome: parsed.data.nome, telefone: parsed.data.telefone, servico: parsed.data.servico, email: null, mensagem: null });
  }

  const selected = SERVICES_OPTIONS.find((s) => s.value === data.servico);

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-500", i < step ? "bg-energy" : "bg-white/15")} />
        ))}
      </div>
      <p className="text-[11px] font-medium text-white/50">Etapa {step} de {totalSteps}</p>

      {/* ── Step 1: Serviço com imagens ── */}
      {step === 1 && (
        <div className="space-y-3 animate-fade-up">
          <h3 className="font-display text-base font-bold text-white">Qual serviço você precisa?</h3>
          <div className="grid gap-2">
            {SERVICES_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = data.servico === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("servico", opt.value)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200",
                    isSelected ? "border-energy bg-energy/15" : "border-white/15 hover:border-white/35"
                  )}
                >
                  {/* Miniatura da imagem */}
                  {opt.img ? (
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                      <img src={opt.img} alt={opt.label} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Icon className="h-6 w-6 text-white/60" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold leading-tight", isSelected ? "text-energy" : "text-white/90")}>{opt.label}</p>
                    <p className="mt-0.5 text-xs text-white/45 leading-tight">{opt.desc}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 shrink-0 text-energy" />}
                </button>
              );
            })}
          </div>
          {errors.servico && <p className="text-xs text-red-400">{errors.servico}</p>}

          <button
            type="button" onClick={next} disabled={!data.servico}
            className="btn-shimmer w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-energy px-6 py-3.5 text-sm font-bold text-energy-foreground shadow-energy transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Step 2: Contato ── */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-up">
          {/* Serviço selecionado */}
          {selected && (
            <div className="flex items-center gap-2 rounded-xl border border-energy/30 bg-energy/10 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-energy shrink-0" />
              <span className="text-sm font-semibold text-energy">{selected.label}</span>
            </div>
          )}

          <h3 className="font-display text-base font-bold text-white">Quase lá! Como te encontramos?</h3>

          {/* Honeypot */}
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={data._hp}
            onChange={(e) => setData((d) => ({ ...d, _hp: e.target.value }))}
            style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

          <div>
            <Label htmlFor="ms-nome" className="text-white/70 text-xs">Seu nome *</Label>
            <Input id="ms-nome" autoFocus placeholder="João Silva" required maxLength={100}
              className="mt-1.5 border-white/20 bg-white/8 text-white placeholder:text-white/30 focus:border-energy"
              value={data.nome} onChange={(e) => update("nome", e.target.value)} />
            {errors.nome && <p className="mt-1 text-xs text-red-400">{errors.nome}</p>}
          </div>

          <div>
            <Label htmlFor="ms-telefone" className="text-white/70 text-xs">WhatsApp / Telefone *</Label>
            <Input id="ms-telefone" placeholder="(41) 9 9999-9999" inputMode="numeric" required maxLength={20}
              className="mt-1.5 border-white/20 bg-white/8 text-white placeholder:text-white/30 focus:border-energy"
              value={data.telefone} onChange={(e) => update("telefone", maskPhone(e.target.value))} />
            {errors.telefone && <p className="mt-1 text-xs text-red-400">{errors.telefone}</p>}
          </div>

          {serverError && (
            <div className="flex items-start gap-2.5 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />{serverError}
            </div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={() => { setStep(1); onStepChange?.(1, totalSteps); }} disabled={loading}
              className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-white/20 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading}
              className="btn-shimmer flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-energy px-6 py-3.5 text-sm font-bold text-energy-foreground shadow-energy transition-all hover:scale-[1.02] disabled:opacity-60">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : <>Receber Orçamento Grátis</>}
            </button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-white/40">
            <Lock className="h-3 w-3" />
            Dados protegidos pela LGPD · Resposta em até 2h
          </p>
        </div>
      )}
    </div>
  );
}
