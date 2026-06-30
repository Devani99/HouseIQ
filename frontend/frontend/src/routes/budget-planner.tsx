import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { IndianRupee, Percent, Calendar, Wallet } from "lucide-react";

export const Route = createFileRoute("/budget-planner")({
  head: () => ({ meta: [{ title: "Budget Planner — HouseIQ" }, { name: "description", content: "EMI, stamp duty, registration, and affordability scoring in one elegant calculator." }] }),
  component: BudgetPlanner,
});

function fmtINR(n: number) {
  if (n >= 1e7) return `₹${(n/1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n/1e5).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function Slider({label, value, min, max, step, onChange, format}: {label: string; value: number; min: number; max: number; step: number; onChange: (v:number)=>void; format: (v:number)=>string}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)} className="mt-2 w-full accent-[color:var(--color-brand)]"/>
    </div>
  );
}

const colors = ["var(--color-chart-1)","var(--color-chart-2)","var(--color-chart-3)","var(--color-chart-4)"];

function BudgetPlanner() {
  const [price, setPrice] = useState(15000000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    const down = price * (downPct/100);
    const loan = price - down;
    const r = rate/12/100;
    const n = years*12;
    const emi = loan === 0 ? 0 : loan * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);
    const stamp = price * 0.05;
    const reg = price * 0.01;
    const maintenance = price * 0.005;
    const total = price + stamp + reg + maintenance;
    const totalInterest = emi*n - loan;
    const afford = Math.max(0, Math.min(100, 100 - ((emi*12)/(price*0.12))*100 + 40));
    return { down, loan, emi, stamp, reg, maintenance, total, totalInterest, afford };
  }, [price, downPct, rate, years]);

  const composition = [
    { name: "Principal (loan)", value: data.loan },
    { name: "Down payment", value: data.down },
    { name: "Total interest", value: data.totalInterest },
    { name: "Taxes & fees", value: data.stamp + data.reg + data.maintenance },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Budget Planner"
        title={<>Plan your <span className="text-gradient">home loan</span> with confidence</>}
        description="Tune sliders to see EMI, stamp duty, registration, total investment and an affordability score in real time."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft animate-fade-up">
          <h2 className="text-lg font-semibold">Loan parameters</h2>
          <div className="mt-6 grid gap-6">
            <Slider label="Property price" value={price} min={2000000} max={50000000} step={100000} onChange={setPrice} format={fmtINR}/>
            <Slider label="Down payment" value={downPct} min={10} max={60} step={1} onChange={setDownPct} format={v=>`${v}%`}/>
            <Slider label="Interest rate" value={rate} min={6} max={14} step={0.1} onChange={setRate} format={v=>`${v.toFixed(1)}%`}/>
            <Slider label="Loan tenure" value={years} min={5} max={30} step={1} onChange={setYears} format={v=>`${v} years`}/>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-background/40 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Loan amount</div>
                <div className="text-lg font-semibold">{fmtINR(data.loan)}</div>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-3">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Down payment</div>
                <div className="text-lg font-semibold">{fmtINR(data.down)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="relative animate-fade-up">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl"/>
            <div className="relative glass rounded-[2rem] p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Monthly EMI</div>
              <div className="mt-2 text-5xl font-bold text-gradient">{fmtINR(data.emi)}</div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { l:"Stamp duty", v:fmtINR(data.stamp), i:Percent },
                  { l:"Registration", v:fmtINR(data.reg), i:IndianRupee },
                  { l:"Maintenance", v:fmtINR(data.maintenance), i:Wallet },
                  { l:"Total investment", v:fmtINR(data.total), i:Calendar },
                ].map(s => (
                  <div key={s.l} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><s.i className="h-3.5 w-3.5"/>{s.l}</div>
                    <div className="mt-1 text-lg font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Affordability score</span>
                  <span className="text-gradient text-lg font-bold">{Math.round(data.afford)}/100</span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-brand transition-all" style={{width:`${data.afford}%`}}/>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Based on EMI-to-budget ratio and tenure.</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft animate-fade-up">
            <h3 className="mb-3 text-sm font-semibold">Loan composition</h3>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={composition} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {composition.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}
                  </Pie>
                  <Tooltip formatter={(v:number)=>fmtINR(v)} contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {composition.map((c,i)=>(
                <div key={c.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{background: colors[i%colors.length]}}/>
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
