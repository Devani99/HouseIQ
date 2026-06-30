import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter, CartesianGrid, Treemap } from "recharts";
import { TrendingUp, IndianRupee, Award, Building2 } from "lucide-react";

export const Route = createFileRoute("/market-analysis")({
  head: () => ({
    meta: [{ title: "Market Analysis — HouseIQ" }, { name: "description", content: "Explore price trends, premium societies, and distributions across Indian cities." }],
  }),
  component: MarketAnalysis,
});

const avgByCity = [
  { city: "Mumbai", value: 2.4 }, { city: "Delhi", value: 1.9 }, { city: "Bangalore", value: 1.6 },
  { city: "Pune", value: 1.3 }, { city: "Hyderabad", value: 1.2 }, { city: "Chennai", value: 1.15 },
  { city: "Ahmedabad", value: 0.95 }, { city: "Kolkata", value: 0.85 }, { city: "Rajkot", value: 0.55 },
];
const medianByCity = avgByCity.map(d => ({ ...d, value: +(d.value * 0.85).toFixed(2) }));
const distribution = [
  { range: "0–50L", count: 6200 }, { range: "50L–1Cr", count: 11800 }, { range: "1–1.5Cr", count: 9700 },
  { range: "1.5–2Cr", count: 7100 }, { range: "2–3Cr", count: 5200 }, { range: "3–5Cr", count: 3400 }, { range: "5Cr+", count: 1900 },
];
const psqft = avgByCity.map(d => ({ city: d.city, value: Math.round(d.value * 7800) }));
const luxury = [
  { name: "Bandra West", size: 4200 }, { name: "Juhu", size: 3800 }, { name: "Worli", size: 3500 },
  { name: "Jubilee Hills", size: 3100 }, { name: "Indiranagar", size: 2800 }, { name: "Koregaon Park", size: 2500 },
];
const affordable = [
  { name: "Nikol", size: 2200 }, { name: "Naroda", size: 2000 }, { name: "Hadapsar", size: 1800 },
  { name: "Whitefield", size: 1700 }, { name: "Madhapur", size: 1500 }, { name: "Vastral", size: 1300 },
];
const facilities = [
  { name: "Gym", value: 32 }, { name: "Pool", value: 24 }, { name: "Club", value: 18 }, { name: "Security", value: 16 }, { name: "Garden", value: 10 },
];
const scatter = Array.from({length: 40}, (_,i)=>({ area: 600+i*40+Math.random()*150, price: (0.4+i*0.07+Math.random()*0.4) }));
const colors = ["var(--color-chart-1)","var(--color-chart-2)","var(--color-chart-3)","var(--color-chart-4)","var(--color-chart-5)"];

const inputCls = "rounded-xl border border-input bg-card/60 backdrop-blur px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

function ChartCard({ title, children, className="" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:shadow-glow animate-fade-up ${className}`}>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

function MarketAnalysis() {
  return (
    <div>
      <PageHeader
        eyebrow="Market Analysis"
        title={<>The <span className="text-gradient">Indian real estate market</span>, decoded</>}
        description="Interactive charts powered by 47,000+ residential listings across 9 cities."
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Filters */}
        <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4 animate-fade-up">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filters</span>
          <select className={inputCls}><option>All cities</option>{avgByCity.map(c=><option key={c.city}>{c.city}</option>)}</select>
          <select className={inputCls}><option>All localities</option><option>Shela</option><option>Gota</option><option>Bandra</option></select>
          <select className={inputCls}><option>All types</option><option>Apartment</option><option>Villa</option></select>
          <select className={inputCls}><option>Any budget</option><option>Under ₹1 Cr</option><option>₹1–2 Cr</option><option>₹2 Cr+</option></select>
          <select className={inputCls}><option>Any BHK</option><option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4+ BHK</option></select>
        </div>

        {/* Summary cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { l: "Avg property price", v: "₹1.32 Cr", i: IndianRupee },
            { l: "Median property price", v: "₹1.08 Cr", i: TrendingUp },
            { l: "Most expensive locality", v: "Bandra West", i: Award },
            { l: "Top performing society", v: "Lodha Park", i: Building2 },
          ].map((s, i) => (
            <div key={s.l} className="glass rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-glow animate-fade-up" style={{animationDelay:`${i*60}ms`}}>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</span>
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-brand text-white"><s.i className="h-4 w-4"/></div>
              </div>
              <div className="mt-3 text-2xl font-bold text-gradient">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ChartCard title="Average price by city (₹ Cr)">
            <ResponsiveContainer><BarChart data={avgByCity}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
              <XAxis dataKey="city" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/><YAxis tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
              <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
              <Bar dataKey="value" radius={[8,8,0,0]} fill="var(--color-chart-1)"/>
            </BarChart></ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Median price by city (₹ Cr)">
            <ResponsiveContainer><LineChart data={medianByCity}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
              <XAxis dataKey="city" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/><YAxis tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
              <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
              <Line type="monotone" dataKey="value" stroke="var(--color-chart-3)" strokeWidth={3} dot={{ r: 4 }}/>
            </LineChart></ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Price distribution histogram">
            <ResponsiveContainer><BarChart data={distribution}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
              <XAxis dataKey="range" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/><YAxis tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
              <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
              <Bar dataKey="count" radius={[8,8,0,0]} fill="var(--color-chart-2)"/>
            </BarChart></ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Average price per sqft (₹)">
            <ResponsiveContainer><BarChart data={psqft}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
              <XAxis dataKey="city" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/><YAxis tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
              <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
              <Bar dataKey="value" radius={[8,8,0,0]} fill="var(--color-chart-4)"/>
            </BarChart></ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Luxury localities treemap">
            <ResponsiveContainer>
              <Treemap data={luxury} dataKey="size" stroke="var(--color-background)" fill="var(--color-chart-1)">
                {luxury.map((_,i)=><Cell key={i} fill={colors[i % colors.length]} />)}
              </Treemap>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Affordable localities treemap">
            <ResponsiveContainer>
              <Treemap data={affordable} dataKey="size" stroke="var(--color-background)" fill="var(--color-chart-4)">
                {affordable.map((_,i)=><Cell key={i} fill={colors[(i+2) % colors.length]} />)}
              </Treemap>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Premium facilities share">
            <ResponsiveContainer><PieChart>
              <Pie data={facilities} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={3}>
                {facilities.map((_,i)=><Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
            </PieChart></ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Area vs price scatter">
            <ResponsiveContainer><ScatterChart>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
              <XAxis dataKey="area" name="Area" unit=" sqft" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
              <YAxis dataKey="price" name="Price" unit=" Cr" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
              <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
              <Scatter data={scatter} fill="var(--color-chart-3)"/>
            </ScatterChart></ResponsiveContainer>
          </ChartCard>
        </div>
      </section>
    </div>
  );
}
