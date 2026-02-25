import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import VimCursor from "@/components/VimCursor";
import { useStore, type Priority } from "@/lib/store";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const HELP_CONTENT = [
  { cmd: "set theme", desc: "Change color scheme: dark, light, or system" },
  { cmd: "set number", desc: "Toggle line numbers on/off in the editor" },
  { cmd: "set sortorder", desc: "Sort tasks by: priority, date, or alpha" },
  { cmd: "set confirmdelete", desc: "Ask before deleting tasks: on/off" },
  { cmd: "let g:reminder_time", desc: "Set daily reminder time (24h format)" },
  { cmd: "let g:high_priority_color", desc: "Hex color for high priority tags" },
  { cmd: "let g:default_priority", desc: "Default priority for new tasks: H, M, or L" },
  { cmd: "set autosave", desc: "Auto-save changes: on/off" },
  { cmd: ":logout --confirm", desc: "Log out and return to splash screen" },
  { cmd: "i", desc: "Click a setting value to edit it inline" },
  { cmd: ":w", desc: "Save all configuration changes" },
];

type ToggleKey = "showLineNumbers" | "confirmDelete" | "autoSave";

export default function ConfigPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { config, updateConfig } = useStore();
  const [selectedLine, setSelectedLine] = useState(1);
  const [showHelp, setShowHelp] = useState(false);

  const cycleTheme = () => {
    const order = ["dark", "light", "system"] as const;
    const idx = order.indexOf(config.theme);
    updateConfig({ theme: order[(idx + 1) % 3] });
  };

  const cycleSortOrder = () => {
    const order = ["priority", "date", "alpha"] as const;
    const idx = order.indexOf(config.sortOrder);
    updateConfig({ sortOrder: order[(idx + 1) % 3] });
  };

  const toggleBool = (key: ToggleKey) => {
    updateConfig({ [key]: !config[key] });
  };

  const cycleDefaultPriority = () => {
    const order: Priority[] = ["H", "M", "L"];
    const idx = order.indexOf(config.defaultPriority);
    updateConfig({ defaultPriority: order[(idx + 1) % 3] });
  };

  const handleSave = () => {
    toast.success(":w — Configuration saved", {
      description: "All settings written to ~/.vimrc",
    });
  };

  const boolToVim = (val: boolean) => (val ? "on" : "off");

  interface ConfigLineData {
    num: string;
    content: React.ReactNode;
    onClick?: () => void;
  }

  const lines: ConfigLineData[] = [
    {
      num: "01",
      content: <span className="text-muted-foreground italic">" Configuration for Vim-Todo v1.4.2</span>,
    },
    {
      num: "02",
      content: <span className="text-muted-foreground italic">" Maintainer: Developer &lt;dev@terminal.local&gt;</span>,
    },
    { num: "03", content: null },
    {
      num: "04",
      content: <span className="text-muted-foreground italic">" Display Settings</span>,
    },
    {
      num: "05",
      content: (
        <>
          <span className="text-syntax-purple">set</span>{" "}
          <span className="text-syntax-cyan">theme</span>=
          <span className="text-syntax-yellow">{config.theme}</span>
        </>
      ),
      onClick: cycleTheme,
    },
    {
      num: "06",
      content: (
        <>
          <span className="text-syntax-purple">set</span>{" "}
          <span className="text-syntax-cyan">number</span>=
          <span className="text-syntax-yellow">{boolToVim(config.showLineNumbers)}</span>
        </>
      ),
      onClick: () => toggleBool("showLineNumbers"),
    },
    {
      num: "07",
      content: (
        <>
          <span className="text-syntax-purple">set</span>{" "}
          <span className="text-syntax-cyan">background</span>=
          <span className="text-syntax-yellow">dark</span>
        </>
      ),
    },
    {
      num: "08",
      content: (
        <>
          <span className="text-syntax-purple">syntax</span>{" "}
          <span className="text-syntax-cyan">on</span>
        </>
      ),
    },
    { num: "09", content: null },
    {
      num: "10",
      content: <span className="text-muted-foreground italic">" Behavior Settings</span>,
    },
    {
      num: "11",
      content: (
        <>
          <span className="text-syntax-purple">set</span>{" "}
          <span className="text-syntax-cyan">sortorder</span>=
          <span className="text-syntax-yellow">{config.sortOrder}</span>
        </>
      ),
      onClick: cycleSortOrder,
    },
    {
      num: "12",
      content: (
        <>
          <span className="text-syntax-purple">set</span>{" "}
          <span className="text-syntax-cyan">confirmdelete</span>=
          <span className="text-syntax-yellow">{boolToVim(config.confirmDelete)}</span>
        </>
      ),
      onClick: () => toggleBool("confirmDelete"),
    },
    {
      num: "13",
      content: (
        <>
          <span className="text-syntax-purple">set</span>{" "}
          <span className="text-syntax-cyan">autosave</span>=
          <span className="text-syntax-yellow">{boolToVim(config.autoSave)}</span>
        </>
      ),
      onClick: () => toggleBool("autoSave"),
    },
    { num: "14", content: null },
    {
      num: "15",
      content: <span className="text-muted-foreground italic">" Custom Variables</span>,
    },
    {
      num: "16",
      content: (
        <>
          <span className="text-syntax-purple">let</span>{" "}
          <span className="text-foreground">g:reminder_time</span>=
          <span className="text-syntax-yellow">"{config.reminderTime}"</span>
        </>
      ),
    },
    {
      num: "17",
      content: (
        <>
          <span className="text-syntax-purple">let</span>{" "}
          <span className="text-foreground">g:high_priority_color</span>=
          <span className="text-syntax-red">"{config.highPriorityColor}"</span>
        </>
      ),
    },
    {
      num: "18",
      content: (
        <>
          <span className="text-syntax-purple">let</span>{" "}
          <span className="text-foreground">g:default_priority</span>=
          <span className="text-syntax-yellow">"{config.defaultPriority}"</span>
        </>
      ),
      onClick: cycleDefaultPriority,
    },
    { num: "19", content: null },
    { num: "20", content: <span className="text-muted-foreground/40">~</span> },
    { num: "21", content: <span className="text-muted-foreground/40">~</span> },
    { num: "22", content: <span className="text-muted-foreground/40">~</span> },
  ];

  return (
    <AppLayout
      statusBar={
        <div className="bg-muted/60 px-4 py-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-sm">-- CONFIG --</span>
            <span>~/.vimrc</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{selectedLine},1</span>
            <span>ALL</span>
          </div>
        </div>
      }
    >
      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-xl">settings_applications</span>
          <h1 className="font-display font-bold text-base tracking-tight">.vimrc</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelp(true)}
            className="material-symbols-outlined text-muted-foreground hover:text-syntax-yellow transition-colors text-xl"
            title=":help"
          >
            help
          </button>
          <button
            onClick={handleSave}
            className="material-symbols-outlined text-muted-foreground hover:text-syntax-green transition-colors text-xl"
            title=":w (save)"
          >
            save
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-2 pb-36 scrollbar-hide">
        {lines.map((line, i) => {
          const lineIdx = i + 1;
          const isSelected = selectedLine === lineIdx;
          const isClickable = !!line.onClick;
          return (
            <div
              key={line.num}
              onClick={() => {
                setSelectedLine(lineIdx);
                if (line.onClick) line.onClick();
              }}
              className={`flex items-center py-1.5 transition-colors ${
                isClickable ? "cursor-pointer" : "cursor-default"
              } ${
                isSelected
                  ? "bg-primary/10 border-l-2 border-primary"
                  : isClickable
                  ? "hover:bg-muted/30"
                  : ""
              }`}
            >
              <div className={`line-number font-mono text-xs ${isSelected ? "text-primary" : ""}`}>
                {line.num}
              </div>
              <div className="flex-1 text-[13px] flex items-center leading-relaxed gap-2">
                {line.content}
                {isSelected && isClickable && <VimCursor />}
                {isSelected && isClickable && (
                  <span className="text-[10px] text-muted-foreground/50 ml-2 uppercase tracking-wider">
                    click to change
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div className="px-5 mt-10 mb-4">
          <button
            onClick={async () => {
              await signOut();
              navigate("/login", { replace: true });
            }}
            className="w-full text-left py-3.5 px-4 border border-destructive/40 text-destructive font-bold hover:bg-destructive hover:text-destructive-foreground transition-all rounded text-sm"
          >
            :logout --confirm
          </button>
        </div>
      </main>

      {/* Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div
            className="bg-secondary border border-border rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-syntax-yellow text-lg">help</span>
                <span className="font-display font-bold text-sm">:help config</span>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="material-symbols-outlined text-muted-foreground hover:text-foreground text-lg"
              >
                close
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-1 scrollbar-hide">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-3">
                Available Commands & Settings
              </p>
              {HELP_CONTENT.map((item, i) => (
                <div key={i} className="flex items-start py-1.5 gap-4 text-xs">
                  <div className="line-number font-mono text-muted-foreground/50 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className="text-syntax-cyan font-bold shrink-0 min-w-[180px]">{item.cmd}</span>
                  <span className="text-muted-foreground">{item.desc}</span>
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground italic">
                  " Click on any setting with a <span className="text-syntax-yellow">value</span> to cycle through options.
                  Press the save icon or <span className="text-syntax-green">:w</span> to persist changes.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 border-t border-border bg-muted/40">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                Press Esc or click outside to close
              </span>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
