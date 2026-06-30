import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BarChart3, Sparkles, TrendingUp, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/predictor", label: "Predictor", icon: TrendingUp },
  { to: "/market-analysis", label: "Market Analysis", icon: BarChart3 },
  { to: "/recommendations", label: "Recommendations", icon: Sparkles },
] as const;

export function Navbar() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 glass border-b border-border/60" />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand shadow-glow">
            <Home className="h-5 w-5 text-white" strokeWidth={2.5} />
            <div className="absolute -inset-1 rounded-2xl bg-gradient-brand opacity-0 blur-lg transition-opacity group-hover:opacity-50" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight">HouseIQ</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Real Estate Intelligence</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(l => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                  active
                    ? "bg-accent text-accent-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 backdrop-blur transition-all hover:shadow-soft hover:scale-105"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen(o => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="relative border-t border-border/60 bg-background/80 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            {links.map(l => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/60"
                  )}
                >
                  <l.icon className="h-4 w-4" /> {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
