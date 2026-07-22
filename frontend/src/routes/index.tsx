import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp, BarChart3, Sparkles, Building2, CheckCircle2, Activity, Layers } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HouseIQ — Find Fair Property Prices Across India" },
      { name: "description", content: "AI powered property valuation, market analysis, recommendations and financial planning across 9 Indian cities." },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "47,442+", label: "Properties", sub: "Residential listings analyzed" },
  { value: "9", label: "Cities", sub: "Across India" },
  { value: "90.2%", label: "Prediction Accuracy", sub: "Validated on holdout" },
  { value: "₹14L", label: "Median Error", sub: "Across all predictions" },
];

const features = [
  { icon: TrendingUp, title: "Price Predictor", desc: "Instant property valuation powered by CatBoost machine learning trained on 47K+ listings.", to: "/predictor", color: "from-blue-500 to-indigo-500" },
  { icon: BarChart3, title: "Market Analysis", desc: "Discover price trends, premium societies, and distributions across every locality.", to: "/market-analysis", color: "from-indigo-500 to-violet-500" },
  { icon: Sparkles, title: "Recommendations", desc: "Personalized property suggestions based on your budget, BHK, and amenity preferences.", to: "/recommendations", color: "from-violet-500 to-fuchsia-500" },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-brand/30 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-brand-3/30 blur-3xl animate-pulse-glow" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-gradient-brand"><Activity className="h-2.5 w-2.5 text-white" /></span>
              90.2% accuracy on 47K+ Indian properties
            </div>
            <h1 className="mt-5 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Find <span className="text-gradient">Fair Property Prices</span> Across India
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              AI powered platform for property valuation, market analysis, recommendations, locality insights and financial planning. Analyze more than 47,000 residential properties collected from 9 Indian cities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/predictor" className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.03]">
                Predict Price <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link to="/market-analysis" className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-6 py-3 text-sm font-semibold transition hover:bg-accent hover:scale-[1.03]">
                Explore Market <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["CatBoost ML", "9 Indian cities", "Real listings", "Live insights"].map(t => (
                <div key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand" />{t}</div>
              ))}
            </div>
          </div>

          {/* Floating illustration */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative h-[28rem] w-[28rem]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-brand opacity-20 blur-3xl" />
                <div className="absolute left-6 top-6 h-72 w-72 glass rounded-3xl p-6 animate-float">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Price prediction</span>
                    <span className="rounded-full bg-success/20 px-2 py-0.5 text-success">+91% conf</span>
                  </div>
                  <div className="mt-3 text-3xl font-bold">₹1.38 Cr</div>
                  <div className="text-xs text-muted-foreground">Shela, Ahmedabad · 3 BHK</div>
                  <div className="mt-5 grid grid-cols-7 items-end gap-1.5 h-24">
                    {[40, 55, 48, 72, 60, 88, 76].map((h,i) => (
                      <div key={i} className="rounded-md bg-gradient-brand opacity-80" style={{height: `${h}%`}} />
                    ))}
                  </div>
                </div>
                <div className="absolute right-0 top-44 h-44 w-64 glass rounded-3xl p-5 animate-float" style={{animationDelay: "1s"}}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Layers className="h-3.5 w-3.5"/> Locality score</div>
                  <div className="mt-2 text-2xl font-bold text-gradient">Premium 8.6 / 10</div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[86%] bg-gradient-brand" />
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">Gym · Pool · Security · Garden</div>
                </div>
                <div className="absolute bottom-2 left-10 h-32 w-56 glass rounded-3xl p-4 animate-float" style={{animationDelay: "2s"}}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Building2 className="h-3.5 w-3.5"/> Top society</div>
                  <div className="mt-1 text-lg font-semibold">Godrej Garden City</div>
                  <div className="text-xs text-muted-foreground">₹12,400 / sqft · 4.8★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative mx-auto -mt-8 max-w-7xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="group glass relative overflow-hidden rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-glow animate-fade-up" style={{animationDelay: `${i*80}ms`}}>
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-brand opacity-10 blur-2xl transition group-hover:opacity-30" />
              <div className="text-3xl font-bold text-gradient">{s.value}</div>
              <div className="mt-1 font-medium">{s.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium">
            Everything you need
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">A complete real estate intelligence stack</h2>
          <p className="mt-3 text-muted-foreground">From the first valuation to the final EMI — every step covered by AI.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Link key={f.title} to={f.to} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-glow animate-fade-up" style={{animationDelay: `${i*70}ms`}}>
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.color} opacity-10 blur-2xl transition group-hover:opacity-30`} />
              <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-glow`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-brand p-10 text-white shadow-glow md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-bold md:text-4xl">Make confident property decisions in minutes.</h2>
            <p className="mt-3 text-white/85">Predict prices, plan budgets, explore localities and chat with your data — all from one beautifully designed platform.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/predictor" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-soft hover:scale-[1.03] transition">Try Predictor <ArrowRight className="h-4 w-4"/></Link>
              <Link to="/market-analysis" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur hover:bg-white/20 transition">Explore Market <BarChart3 className="h-4 w-4"/></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
