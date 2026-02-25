import { useNavigate } from "react-router-dom";
import VimCursor from "@/components/VimCursor";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SplashPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/editor", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/[0.02]" />

      <div className="relative z-10 flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-primary/10 bg-background/50 px-5 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded border border-primary/40 bg-primary/10 text-sm font-bold text-primary">
              Vp
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">VimPad CLI</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-primary/40">SSH-2.0-VimPad</span>
            <span className="material-symbols-outlined text-xs text-primary">wifi</span>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-start px-6 py-6">
          <div className="space-y-8">
            <div className="space-y-1.5">
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-primary drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]">
                VimPad v1.0.0
              </h1>
              <p className="font-mono text-[10px] tracking-wide text-primary/50">Build: 20260225-stable</p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex flex-col gap-1 pb-1">
                <p className="text-muted-foreground">Last login: Tue Feb 25 on ttys001</p>
                <p className="text-muted-foreground">System architecture: arm64-apple-darwin</p>
              </div>
              <div className="space-y-2.5 pl-1">
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 text-[7px] text-primary">●</span>
                  <p className="text-foreground/80">Ready to optimize your workflow.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 text-[7px] text-primary">●</span>
                  <p className="text-foreground/80">
                    Press <span className="font-bold text-primary">[I]</span> to initialize new buffer
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="mt-1 text-[7px] text-primary">●</span>
                  <p className="text-foreground/80">
                    Type <span className="font-bold text-primary">:help</span> for documentation
                  </p>
                </div>
              </div>
              <div className="flex items-center pt-4">
                <p className="text-base font-bold text-primary">$ root@vimpad ~ % </p>
                <VimCursor />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-auto w-full max-w-xs pb-10">
            <div className="mb-8 text-center">
              <h4 className="mb-5 text-[9px] font-bold uppercase tracking-[0.3em] text-primary/30">
                -- MODE: INITIALIZE --
              </h4>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="group flex h-11 w-full items-center justify-between rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground shadow-[0_4px_6px_-1px_hsl(var(--primary)/0.3)] transition-all active:scale-[0.98] hover:brightness-110"
                >
                  <span className="font-mono tracking-tight">:login</span>
                  <span className="material-symbols-outlined text-base opacity-80 transition-transform group-hover:translate-x-1">login</span>
                </button>
                <button
                  onClick={() => navigate("/editor")}
                  className="group flex h-11 w-full items-center justify-between rounded-md border border-primary/50 bg-transparent px-5 text-sm font-bold text-primary shadow-[0_0_8px_hsl(var(--primary)/0.15)] transition-all active:scale-[0.98] hover:border-primary hover:bg-primary/5"
                >
                  <span className="font-mono tracking-tight">:guest_session</span>
                  <span className="material-symbols-outlined text-base opacity-80 transition-transform group-hover:translate-x-1">person</span>
                </button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[8px] font-medium uppercase italic tracking-[0.2em] text-muted-foreground">
                Execute command to proceed
              </p>
            </div>
          </div>
        </main>

        <footer className="flex items-center justify-between border-t border-primary/10 bg-background px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-primary/40">
          <div className="flex items-center gap-6">
            <span>Ln 1, Col 1</span>
            <div className="h-3 w-px bg-primary/20" />
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-2 text-primary/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.8)]" />
            Connected
          </div>
        </footer>
      </div>
    </div>
  );
}
