import { Link } from "@tanstack/react-router";
import { Home, Github, Twitter, Linkedin } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: [
      { to: "/predictor", label: "Predictor" },
      { to: "/market-analysis", label: "Market Analysis" },
      { to: "/recommendations", label: "Recommendations" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="absolute inset-0 bg-gradient-hero opacity-40 pointer-events-none" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand shadow-glow">
              <Home className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold">HouseIQ</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Real Estate Intelligence</span>
            </div>
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Fair property prices across India powered by machine learning, analytics, and natural language understanding.
          </p>
          <div className="mt-5 flex gap-2">
            {[Github, Twitter, Linkedin].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 hover:shadow-soft transition" aria-label="social">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        {cols.map(c => (
          <div key={c.title}>
            <h4 className="mb-3 text-sm font-semibold">{c.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.links.map(l => (
                <li key={l.to}><Link to={l.to} className="hover:text-foreground transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} HouseIQ. All rights reserved.</p>
          <p>Built using Machine Learning, CatBoost, FastAPI and Next.js</p>
        </div>
      </div>
    </footer>
  );
}
