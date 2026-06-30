import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Search, MapPin } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, ComposedChart, Line, Area } from "recharts";

export const Route = createFileRoute("/locality-insights")({
  head: () => ({ meta: [{ title: "Locality Insights — HouseIQ" }, { name: "description", content: "Deep statistics on amenities, premium scores, and growth potential by neighborhood." }] }),
  component: LocalityInsights,
});

const stats = [
  { l: "Avg price", v: "₹1.22 Cr" },{ l: "Median price", v: "₹1.18 Cr" },{ l: "Properties", v: "2,148" },{ l: "Avg ₹/sqft", v: "₹8,420" },
  { l: "Most common BHK", v: "3 BHK" },{ l: "Premium index", v: "8.6 / 10" },{ l: "Growth potential", v: "A+" },{ l: "Popular societies", v: "12" },
];
const facilities = [
  { name: "Gym", value: 28 },{ name: "Pool", value: 22 },{ name: "Club", value: 18 },{ name: "Garden", value: 16 },{ name: "Security", value: 16 },
];
const societies = [
  { name: "Godrej GC", value: 94 },{ name: "Shaligram", value: 91 },{ name: "Sun Optima", value: 88 },{ name: "Goyal Orchid", value: 85 },{ name: "Safal Parisar", value: 82 },
];
const compare = ["Shela","Gota","Bopal","Bodakdev","Vastrapur"].map(n => ({
  name: n,
  price: 80 + Math.round(Math.random()*60),
  psqft: 60 + Math.round(Math.random()*40),
  premium: 50 + Math.round(Math.random()*50),
}));
const box = Array.from({length: 9}, (_,i)=>({ city: ["AHM","MUM","BLR","HYD","PUN","CHN","DEL","KOL","RJK"][i], q1: 60+Math.random()*30, median: 90+Math.random()*40, q3: 130+Math.random()*60 }));
const colors = ["var(--color-chart-1)","var(--color-chart-2)","var(--color-chart-3)","var(--color-chart-4)","var(--color-chart-5)"];

function Card({title, children, h=64}: {title: string; children: React.ReactNode; h?: number}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-soft animate-fade-up">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div style={{height: h*4}}>{children}</div>
    </div>
  );
}

function LocalityInsights() {
  return (
    <div>
      <PageHeader
        eyebrow="Locality Insights"
        title={<>Know every <span className="text-gradient">neighborhood</span> before you buy</>}
        description="Search any Indian locality to see prices, amenities, top societies, and growth potential."
      >
        <div className="glass flex max-w-2xl items-center gap-3 rounded-2xl p-2.5">
          <Search className="ml-2 h-4 w-4 text-muted-foreground"/>
          <input defaultValue="Shela" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search localities (e.g. Shela, Bandra, Indiranagar)"/>
          <button className="rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow">Search</button>
        </div>
      </PageHeader>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-brand"/> Shela, Ahmedabad</div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s,i)=>(
            <div key={s.l} className="glass rounded-2xl p-4 animate-fade-up" style={{animationDelay:`${i*40}ms`}}>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              <div className="mt-1 text-xl font-bold text-gradient">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card title="Price boxplot by city">
            <ResponsiveContainer>
              <ComposedChart data={box}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
                <XAxis dataKey="city" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/><YAxis tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
                <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
                <Area type="monotone" dataKey="q3" stroke="none" fill="var(--color-chart-1)" fillOpacity={0.15}/>
                <Area type="monotone" dataKey="q1" stroke="none" fill="var(--color-background)"/>
                <Line type="monotone" dataKey="median" stroke="var(--color-chart-1)" strokeWidth={3} dot={{r:4}}/>
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Facility distribution">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={facilities} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {facilities.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Society ranking">
            <ResponsiveContainer>
              <BarChart data={societies} layout="vertical">
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
                <XAxis type="number" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
                <YAxis dataKey="name" type="category" width={90} tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
                <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
                <Bar dataKey="value" radius={[8,8,8,8]} fill="var(--color-chart-3)"/>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Locality comparison heatmap">
            <div className="grid h-full grid-cols-4 gap-1.5 overflow-hidden rounded-2xl">
              <div className="grid place-items-center text-[11px] font-semibold text-muted-foreground">Locality</div>
              <div className="grid place-items-center text-[11px] font-semibold text-muted-foreground">Price</div>
              <div className="grid place-items-center text-[11px] font-semibold text-muted-foreground">₹/sqft</div>
              <div className="grid place-items-center text-[11px] font-semibold text-muted-foreground">Premium</div>
              {compare.map(c => (
                <Fragment key={c.name}>
                  <div className="grid place-items-center rounded-lg bg-accent/40 text-xs font-medium">{c.name}</div>
                  <div className="grid place-items-center rounded-lg text-xs text-white" style={{background:`oklch(0.55 0.2 ${200 + c.price})`}}>{c.price}</div>
                  <div className="grid place-items-center rounded-lg text-xs text-white" style={{background:`oklch(0.55 0.2 ${220 + c.psqft})`}}>{c.psqft}</div>
                  <div className="grid place-items-center rounded-lg text-xs text-white" style={{background:`oklch(0.55 0.2 ${260 + c.premium})`}}>{c.premium}</div>
                </Fragment>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
