import AppLayout from "@/components/AppLayout";
import { useStore } from "@/lib/store";

export default function HistoryPage() {
  const { history } = useStore();

  return (
    <AppLayout
      statusBar={
        <div className="bg-syntax-yellow px-4 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-background">
          <div className="flex items-center gap-4">
            <span className="bg-background text-syntax-yellow px-2 py-0.5 rounded-sm">-- GIT --</span>
            <span>history.log</span>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>log</span>
            <span>1:1</span>
          </div>
        </div>
      }
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-syntax-yellow text-xl">history</span>
          <h1 className="font-display font-bold text-base tracking-tight">history.log</h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="material-symbols-outlined text-muted-foreground text-xl">search</span>
          <span className="material-symbols-outlined text-muted-foreground text-xl">filter_list</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-5 pb-36 px-5 scrollbar-hide space-y-6">
        {history.map((entry, i) => {
          const opacity = Math.max(0.5, 1 - i * 0.1);
          const dateStr = entry.date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={entry.id} className="space-y-1.5" style={{ opacity }}>
              <div className="flex items-center gap-2">
                <span className="text-syntax-yellow font-bold text-[13px]">commit {entry.hash}</span>
                {i === 0 && <span className="text-muted-foreground text-xs">(HEAD → main)</span>}
              </div>
              <div className="text-muted-foreground text-xs">Date: {dateStr}</div>
              <div className="pt-1.5 pl-4 text-[13px] text-foreground leading-relaxed">{entry.message}</div>
            </div>
          );
        })}

        {history.length === 0 && (
          <div className="text-muted-foreground italic text-xs pt-4">No commits yet. Complete a task to create history.</div>
        )}

        <div className="text-muted-foreground italic text-xs pt-4">(END)</div>
      </main>
    </AppLayout>
  );
}
