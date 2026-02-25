import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import type { Provider } from "@supabase/supabase-js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>("user");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/editor", { replace: true });
    }
  }, [user, navigate]);

  const handleRegister = async () => {
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split("@")[0],
        },
      },
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created. Check your email if confirmation is enabled.");
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
      <div className="fixed right-3 top-3 z-20 flex gap-1.5 opacity-50">
        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
        <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
      </div>

      <header className="p-5 pt-10">
        <div className="inline-block bg-foreground px-3 py-1.5 text-xs font-bold tracking-[0.15em] text-background">
          ACCOUNT_INITIALIZATION
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 py-3">
        <div className="mb-6 space-y-1.5">
          <div className="text-xs font-light text-muted-foreground opacity-60">
            <p>system: ready for user configuration</p>
            <p>system: await input...</p>
          </div>
        </div>

        <div className="mt-3 space-y-5">
          <div
            className={`group flex items-baseline gap-3 border-b pb-1 transition-all duration-300 ${
              focused === "user" ? "border-primary/50" : "border-transparent hover:border-primary/30"
            }`}
          >
            <span className="w-24 shrink-0 text-sm font-bold text-foreground">set_user:</span>
            <div className="flex items-center">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setFocused("user");
                }}
                onFocus={() => setFocused("user")}
                onBlur={() => setFocused(null)}
                className="bg-transparent text-sm font-mono text-foreground/70 outline-none placeholder:text-foreground/30 vim-caret-bold"
                placeholder="dev_null"
                autoFocus
              />
            </div>
          </div>
          <div
            className={`group flex items-baseline gap-3 border-b pb-1 transition-all duration-300 ${
              focused === "email" ? "border-primary/50" : "border-transparent hover:border-primary/30"
            }`}
          >
            <span className="w-24 shrink-0 text-sm font-bold text-foreground">set_email:</span>
            <div className="flex items-center">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFocused("email");
                }}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="bg-transparent text-sm font-mono text-foreground/70 outline-none placeholder:text-foreground/30 vim-caret-bold"
                placeholder="root@localhost"
              />
            </div>
          </div>
          <div
            className={`group flex items-baseline gap-3 border-b pb-1 transition-all duration-300 ${
              focused === "pass" ? "border-primary/50" : "border-transparent hover:border-primary/30"
            }`}
          >
            <span className="w-24 shrink-0 text-sm font-bold text-foreground">set_pass:</span>
            <div className="flex items-center">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFocused("pass");
                }}
                onFocus={() => setFocused("pass")}
                onBlur={() => setFocused(null)}
                className="bg-transparent text-sm font-mono text-foreground outline-none placeholder:text-foreground/30 vim-caret-bold"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 opacity-50">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">QUICK_AUTH</span>
            <div className="h-px flex-1 bg-muted-foreground/30" />
          </div>
          <div className="flex flex-col items-start gap-3">
            {["github", "google", "gitlab"].map((provider) => (
              <button
                key={provider}
                onClick={() => handleOAuth(provider as Provider)}
                className="w-full rounded py-1.5 text-left text-xs text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-primary"
              >
                [ {provider} ]
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 mt-auto space-y-4">
          <button
            onClick={handleRegister}
            disabled={submitting}
            className="group relative w-full overflow-hidden border border-border bg-transparent px-5 py-3 text-left transition-all hover:border-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.12)]"
          >
            <div className="absolute inset-0 -z-10 bg-secondary/50 transition-colors group-hover:bg-secondary/80" />
            <span className="text-sm font-bold tracking-wide text-foreground transition-colors group-hover:text-primary">
              {submitting ? ":register --creating" : ":register --confirm"}
            </span>
          </button>
          <div className="pt-1 text-center">
            <button
              onClick={() => navigate("/login")}
              className="group inline-flex items-center gap-1.5 text-xs text-primary tracking-tight transition-all hover:text-primary/80"
            >
              <span className="font-bold">:login</span>
              <span className="text-[10px] opacity-40 transition-opacity group-hover:opacity-70">--back-to-login</span>
            </button>
          </div>
        </div>
      </main>

      <nav className="border-t border-border/60 bg-background/95 pb-6 pt-1 backdrop-blur-sm">
        <div className="flex items-center justify-around px-5 py-3">
          {["cable", "key", "apps"].map((icon) => (
            <button key={icon} className="group flex w-14 flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[22px] text-muted-foreground transition-all group-hover:text-primary group-active:scale-90">
                {icon}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
