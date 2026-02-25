import AppLayout from "@/components/AppLayout";
import StatusBar from "@/components/StatusBar";
import { useStore } from "@/lib/store";
import { useMemo } from "react";

export default function StatsPage() {
  const { tasks } = useStore();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const high = tasks.filter((t) => t.priority === "H").length;
    const med = tasks.filter((t) => t.priority === "M").length;
    const low = tasks.filter((t) => t.priority === "L").length;

    const barFilled = Math.round(rate / 5);
    const barEmpty = 20 - barFilled;
    const progressBar = "#".repeat(barFilled) + "-".repeat(barEmpty);

    return { total, completed, rate, high, med, low, progressBar };
  }, [tasks]);

  const habitGrid = useMemo(() => {
    const totalDays = 52 * 7;
    const grid: number[] = [];
    for (let i = 0; i < totalDays; i++) {
      grid.push(Math.floor(Math.random() * 5));
    }
    const recentRate = stats.rate / 25;
    for (let i = totalDays - 7; i < totalDays; i++) {
      grid[i] = Math.min(4, Math.floor(recentRate + Math.random() * 2));
    }
    return grid;
  }, [stats.rate]);

  const categoryDist = useMemo(() => {
    const total = stats.high + stats.med + stats.low;
    if (total === 0) return [];
    return [
      { label: "HIGH", count: stats.high, pct: Math.round((stats.high / total) * 100), color: "text-syntax-red" },
      { label: "MED", count: stats.med, pct: Math.round((stats.med / total) * 100), color: "text-syntax-yellow" },
      { label: "LOW", count: stats.low, pct: Math.round((stats.low / total) * 100), color: "text-syntax-green" },
    ];
  }, [stats]);

  return (
    <AppLayout statusBar={<StatusBar mode="VISUAL" fileName="stats.log" extra="log" />}>
      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">analytics</span>
          <h1 className="font-display font-bold text-base tracking-tight">stats.log</h1>
        </div>
        <div className="flex items-center gap-5">
          <span className="material-symbols-outlined text-muted-foreground text-xl">refresh</span>
          <span className="material-symbols-outlined text-muted-foreground text-xl">share</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-5 pb-36 scrollbar-hide px-5">
        {/* Completion Rate */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-syntax-yellow font-bold text-sm">#</span>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">COMPLETION_RATE</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-mono tracking-tighter overflow-hidden whitespace-nowrap">
              <span className="text-primary">[{stats.progressBar}]</span>
              <span className="ml-2 text-syntax-green font-bold">{stats.rate}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.completed}/{stats.total} tasks completed
            </div>
          </div>
        </section>

        {/* Habit Streaks */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-syntax-yellow font-bold text-sm">#</span>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">HABIT_STREAKS</h2>
          </div>
          <div className="ascii-grid">
            {habitGrid.map((level, i) => {
              const colors = ["bg-habit-0", "bg-habit-1", "bg-habit-2", "bg-habit-3", "bg-habit-4"];
              return <div key={i} className={`w-[10px] h-[10px] rounded-sm ${colors[level]}`} />;
            })}
          </div>
          <div className="flex justify-between mt-2.5 text-[11px] text-muted-foreground">
            <span>Recent</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm bg-habit-0" />
              <div className="w-2.5 h-2.5 rounded-sm bg-habit-1" />
              <div className="w-2.5 h-2.5 rounded-sm bg-habit-2" />
              <div className="w-2.5 h-2.5 rounded-sm bg-habit-3" />
              <div className="w-2.5 h-2.5 rounded-sm bg-habit-4" />
              <span>More</span>
            </div>
          </div>
        </section>

        {/* Category Distribution */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-syntax-yellow font-bold text-sm">#</span>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">CATEGORY_DIST</h2>
          </div>
          <div className="space-y-3 text-[13px] font-mono">
            {categoryDist.map((cat) => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="w-12 text-xs text-muted-foreground">{cat.label}</span>
                <span className={`${cat.color} tracking-tight`}>{"#".repeat(Math.max(1, Math.round(cat.pct / 5)))}</span>
                <span className="text-muted-foreground text-xs">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="mt-10 p-4 border border-dashed border-border/60 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-syntax-green text-base mt-0.5">commit</span>
            <div>
              <p className="text-xs text-syntax-green font-bold mb-1.5">feat: improve mental performance</p>
              <p className="text-[13px] italic text-muted-foreground leading-relaxed">
                "The secret of getting ahead is getting started. Keep the streak alive, developer."
              </p>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
