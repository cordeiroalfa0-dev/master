import { Link, useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useState, useEffect } from "react";
import { Save, Zap, Settings, LogOut, Users, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminLoggedIn, adminLogout } from "@/lib/admin-auth";
import { supabase } from "@/integrations/supabase/client";
import { invalidateSiteSettingsCache } from "@/hooks/useSiteSettings";

const FIELDS: Array<{
  key: string;
  label: string;
  placeholder: string;
  help: string;
  link?: string;
}> = [
  {
    key: "gtm_id",
    label: "Google Tag Manager ID",
    placeholder: "GTM-XXXXXXX",
    help: "Cole o ID do seu container GTM.",
    link: "https://tagmanager.google.com/",
  },
  {
    key: "ga4_id",
    label: "Google Analytics 4 — Measurement ID",
    placeholder: "G-XXXXXXXXXX",
    help: "Usado para fallback direto caso o GTM não esteja configurado.",
    link: "https://analytics.google.com/",
  },
  {
    key: "google_ads_id",
    label: "Google Ads — Conversion ID",
    placeholder: "AW-XXXXXXXXX",
    help: "ID de conversão do Google Ads.",
    link: "https://ads.google.com/",
  },
  {
    key: "google_ads_conversion_label",
    label: "Google Ads — Conversion Label",
    placeholder: "AbCdEfGhIjK",
    help: "Label da conversão específica.",
  },
  {
    key: "meta_pixel_id",
    label: "Meta Pixel ID (Facebook/Instagram)",
    placeholder: "123456789012345",
    help: "ID do pixel do Meta Business Suite.",
    link: "https://business.facebook.com/events_manager",
  },
  {
    key: "tiktok_pixel_id",
    label: "TikTok Pixel ID",
    placeholder: "CXXXXXXXXXXXXXXXXX",
    help: "ID do pixel do TikTok Ads Manager.",
    link: "https://ads.tiktok.com/",
  },
  {
    key: "clarity_id",
    label: "Microsoft Clarity — Project ID",
    placeholder: "xxxxxxxxxx",
    help: "Grava sessões e mapas de calor gratuitamente.",
    link: "https://clarity.microsoft.com/",
  },
  {
    key: "whatsapp_number",
    label: "Número de WhatsApp",
    placeholder: "5541997539084",
    help: "Formato internacional sem + nem espaços.",
  },
  {
    key: "whatsapp_message",
    label: "Mensagem padrão do WhatsApp",
    placeholder: "Olá! Gostaria de solicitar um orçamento.",
    help: "Texto pré-preenchido ao clicar no botão.",
  },
  {
    key: "contact_email",
    label: "Email de contato",
    placeholder: "contato@mastereletrica.com.br",
    help: "Email exibido no rodapé e na página de contato.",
  },
  {
    key: "contact_phone",
    label: "Telefone de contato",
    placeholder: "(41) 99753-9084",
    help: "Número exibido no site.",
  },
];

const GROUPS = [
  {
    title: "Rastreamento de Tráfego",
    keys: [
      "gtm_id",
      "ga4_id",
      "google_ads_id",
      "google_ads_conversion_label",
      "meta_pixel_id",
      "tiktok_pixel_id",
      "clarity_id",
    ],
  },
  {
    title: "Contato e WhatsApp",
    keys: ["whatsapp_number", "whatsapp_message", "contact_email", "contact_phone"],
  },
];

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .then(({ data }) => {
        if (data) {
          setSettings(Object.fromEntries(data.map((r) => [r.key, r.value ?? ""])));
        }
        setLoadingData(false);
      });
  }, []);

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setSaveError(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);

    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("site_settings").upsert(upserts, { onConflict: "key" });

    setSaving(false);

    if (error) {
      setSaveError("Erro ao salvar. Verifique sua conexão e tente novamente.");
      return;
    }

    invalidateSiteSettingsCache();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleLogout() {
    adminLogout();
    navigate("/admin/login");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Configurações</h1>
            <p className="text-sm text-muted-foreground">IDs de rastreamento e dados de contato</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/blog">
              <BookOpen className="mr-1.5 h-4 w-4" /> Blog
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/leads">
              <Users className="mr-1.5 h-4 w-4" /> Leads
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 h-4 w-4" /> Sair
          </Button>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-foreground">
          Cole os IDs abaixo e clique em <strong>Salvar</strong>. Os pixels são ativados
          automaticamente quando o visitante aceitar os cookies. Campos em branco são ignorados.
        </p>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Carregando configurações...
        </div>
      ) : (
        <div className="space-y-10">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h2 className="mb-4 font-display text-lg font-semibold">{group.title}</h2>
              <div className="space-y-4">
                {group.keys.map((key) => {
                  const field = FIELDS.find((f) => f.key === key);
                  if (!field) return null;
                  return (
                    <div key={key} className="rounded-xl border bg-card p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <Label htmlFor={key} className="text-sm font-semibold">
                          {field.label}
                        </Label>
                        {field.link && (
                          <a
                            href={field.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Abrir painel ↗
                          </a>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
                      <Input
                        id={key}
                        placeholder={field.placeholder}
                        value={settings[key] ?? ""}
                        onChange={(e) => update(key, e.target.value)}
                        className="mt-3 font-mono text-sm"
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <div className="flex items-center gap-4 border-t pt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="bg-gradient-primary font-semibold shadow-elegant hover:opacity-90 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar configurações
                </>
              )}
            </Button>
            {saved && (
              <span className="text-sm font-medium text-success">✓ Salvo com sucesso!</span>
            )}
            {saveError && <span className="text-sm font-medium text-destructive">{saveError}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
