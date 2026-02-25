import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import type { Provider } from "@supabase/supabase-js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<"email" | "pass" | null>("email");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/editor", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged in successfully");
    navigate("/editor");
  };

  const handleOAuth = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/editor`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="fixed right-3 top-2 z-20 flex gap-1.5 opacity-30">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
      </div>

      <header className="p-5 pt-10">
        <div className="inline-block bg-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-background">
          LOGIN_PROMPT
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 py-3">
        <div className="space-y-5">
          <div className="text-xs font-light tracking-wide text-muted-foreground opacity-60">
            <p>system: initialization sequence complete</p>
            <p>system: awaiting credentials...</p>
          </div>
          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-3 text-sm">
              <span className="w-14 font-bold text-foreground">email:</span>
              <div className="flex items-center whitespace-nowrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFocused("email");
                  }}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className="bg-transparent text-base font-mono text-foreground/70 outline-none placeholder:text-foreground/30 vim-caret-bold"
                  autoComplete="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="email"
                  aria-label="Email"
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-14 font-bold text-foreground">pass:</span>
              <div className="flex items-center whitespace-nowrap">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFocused("pass");
                  }}
                  onFocus={() => setFocused("pass")}
                  onBlur={() => setFocused(null)}
                  className="bg-transparent text-base font-mono text-foreground/70 outline-none placeholder:text-muted-foreground vim-caret-bold"
                  autoComplete="current-password"
                  spellCheck={false}
                  autoCapitalize="none"
                  autoCorrect="off"
                  aria-label="Password"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate("/register")}
                className="text-sm font-medium text-primary transition-all duration-200 hover:text-primary/80"
              >
                :register
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">QUICK_AUTH</span>
            <div className="h-px flex-1 bg-foreground/10" />
          </div>
          <div className="flex flex-col items-start gap-3">
            {["github", "google", "gitlab"].map((provider) => (
              <button
                key={provider}
                onClick={() => handleOAuth(provider as Provider)}
                className="group flex w-full items-center justify-start gap-2 rounded border border-transparent px-3 py-2 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <span className="opacity-50 transition-opacity group-hover:opacity-100">[</span>
                {provider}
                <span className="opacity-50 transition-opacity group-hover:opacity-100">]</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 mt-auto pt-8">
          <button
            onClick={handleLogin}
            disabled={submitting}
            className="group flex w-full items-center justify-between border border-foreground/20 px-5 py-3 text-left font-mono text-sm font-bold text-foreground/80 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-foreground hover:shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
          >
            <span>
              {submitting ? ":login --authenticating" : ":login --authenticate"}
            </span>
            <span className="material-symbols-outlined -translate-x-2 text-sm text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              terminal
            </span>
          </button>
        </div>
      </main>

      <nav className="border-t border-foreground/5 bg-background pb-6 pt-1">
        <div className="flex items-center justify-around p-3">
          {["cable", "key", "apps"].map((icon) => (
            <button key={icon} className="group p-1.5">
              <span className="material-symbols-outlined text-[22px] text-muted-foreground transition-all duration-300 group-hover:text-primary group-active:scale-90">
                {icon}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
