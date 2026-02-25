import AppLayout from "@/components/AppLayout";
import StatusBar from "@/components/StatusBar";
import { useStore } from "../lib/store";
import { useMemo } from "react";

const toLocalDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
    const dailyCompletions = new Map<string, number>();

    for (const task of tasks) {
      if (!task.completedAt) continue;
      const done = new Date(task.completedAt);
      done.setHours(0, 0, 0, 0);
      const key = toLocalDateKey(done);
      dailyCompletions.set(key, (dailyCompletions.get(key) ?? 0) + 1);
    }

    const maxDailyCompletions = Math.max(0, ...dailyCompletions.values());

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (totalDays - 1));

    const grid: { dateKey: string; count: number; level: number }[] = [];
    for (let i = 0; i < totalDays; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = toLocalDateKey(day);
      const count = dailyCompletions.get(key) ?? 0;

      const level =
        count === 0
          ? 0
          : maxDailyCompletions <= 4
            ? Math.min(4, count)
            : Math.min(4, Math.ceil((count / maxDailyCompletions) * 4));

      grid.push({ dateKey: key, count, level });
    }

    const monthLabels: string[] = [];
    for (let week = 0; week < totalDays / 7; week++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + week * 7);
      if (weekStart.getDate() <= 7) {
        monthLabels.push(
          weekStart.toLocaleString("default", {
            month: "short",
          }),
        );
      }
    }

    const end = new Date(start);
    end.setDate(start.getDate() + totalDays - 1);
    const yearLabel =
      start.getFullYear() === end.getFullYear()
        ? String(end.getFullYear())
        : `${start.getFullYear()}-${end.getFullYear()}`;

    const totalCompletedInGrid = grid.reduce((sum, cell) => sum + cell.count, 0);

    return {
      cells: grid,
      monthLabels,
      yearLabel,
      totalCompletedInGrid,
    };
  }, [tasks]);

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
          <div className="flex items-center justify-between mb-2.5 text-[11px] text-muted-foreground">
            <span>{habitGrid.totalCompletedInGrid} completed tasks in last 52 weeks</span>
            <span>{habitGrid.yearLabel}</span>
          </div>

          <div className="flex gap-2.5">
            <div className="pt-5 text-[10px] text-muted-foreground min-w-8 space-y-[15px]">
              <div>Mon</div>
              <div>Wed</div>
              <div>Fri</div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex justify-between mb-2 text-[11px] text-muted-foreground">
                {habitGrid.monthLabels.map((month, index) => (
                  <span key={`${month}-${index}`}>{month}</span>
                ))}
              </div>

              <div className="ascii-grid">
                {habitGrid.cells.map((cell, index) => {
                  const colors = ["bg-habit-0", "bg-habit-1", "bg-habit-2", "bg-habit-3", "bg-habit-4"];
                  return (
                    <div
                      key={`${cell.dateKey}-${index}`}
                      className={`w-[10px] h-[10px] rounded-sm ${colors[cell.level]}`}
                      title={`${cell.count} task${cell.count === 1 ? "" : "s"} completed on ${cell.dateKey}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-2.5 text-[11px] text-muted-foreground">
            <span>Last 52 weeks</span>
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
