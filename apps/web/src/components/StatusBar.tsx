import type { VimMode } from "@/lib/store";

interface StatusBarProps {
  mode: VimMode;
  fileName: string;
  extra?: string;
}

const MODE_STYLES: Record<VimMode, { bg: string; badge: string; badgeText: string }> = {
  NORMAL: {
    bg: "bg-primary",
    badge: "bg-primary-foreground text-primary",
    badgeText: "text-primary-foreground",
  },
  INSERT: {
    bg: "bg-syntax-green",
    badge: "bg-background text-syntax-green",
    badgeText: "text-background",
  },
  VISUAL: {
    bg: "bg-primary",
    badge: "bg-primary-foreground text-primary",
    badgeText: "text-primary-foreground",
  },
};

export default function StatusBar({ mode, fileName, extra }: StatusBarProps) {
  const styles = MODE_STYLES[mode];

  return (
    <div
      className={`${styles.bg} px-4 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider ${styles.badgeText}`}
    >
      <div className="flex items-center gap-4">
        <span className={`${styles.badge} px-2 py-0.5 rounded-sm`}>-- {mode} --</span>
        <span>{fileName}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>UTF-8</span>
        <span>{extra || "markdown"}</span>
      </div>
    </div>
  );
}
