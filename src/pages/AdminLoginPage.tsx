import { Link, useNavigate } from "react-router-dom";
import { usePageSeo } from "@/hooks/usePageSeo";
import { useState } from "react";
import { Loader2, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminLogin } from "@/lib/admin-auth";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simula delay de rede
    await new Promise((r) => setTimeout(r, 600));

    const ok = adminLogin(email, password);
    setLoading(false);

    if (!ok) {
      setError("Email ou senha incorretos.");
      return;
    }

    navigate("/admin/blog");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
            <Zap className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold">Área Administrativa</h1>
          <p className="mt-1 text-sm text-muted-foreground">Master Elétrica Automatizada</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              placeholder="admin@mastereletrica.com.br"
            />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
            />
          </div>
          {error && (
            <p className="rounded-xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary font-semibold shadow-elegant hover:opacity-90"
          >
            {loading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...</>
              : <><Lock className="mr-2 h-4 w-4" /> Entrar</>
            }
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Acesso restrito a administradores autorizados.
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
