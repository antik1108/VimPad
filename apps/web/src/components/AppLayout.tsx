import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/editor", icon: "terminal", label: "Editor" },
  { path: "/notes", icon: "description", label: "Notes" },
  { path: "/stats", icon: "analytics", label: "Stats" },
  { path: "/history", icon: "history", label: "History" },
  { path: "/config", icon: "settings", label: "Config" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  statusBar?: React.ReactNode;
}

export default function AppLayout({ children, statusBar }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {children}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        {statusBar}
        <nav className="flex border-t border-border bg-background px-4 pb-6 pt-3">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-1 flex-col items-center justify-center gap-1.5 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${active ? "fill-1" : ""}`}>
                  {item.icon}
                </span>
                <p className="font-display text-[11px] font-medium uppercase tracking-widest">
                  {item.label}
                </p>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
