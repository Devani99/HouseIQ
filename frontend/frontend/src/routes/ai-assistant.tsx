import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — HouseIQ" }, { name: "description", content: "Chat naturally with your real estate data." }] }),
  component: Assistant,
});

const suggestions = [
  "Find me a 3 BHK in Ahmedabad under ₹1.5 Cr",
  "Best societies in Shela",
  "Compare Gota and South Bopal",
  "Budget required for a 2 BHK in Rajkot",
];

type Msg = { role: "user" | "ai"; content: React.ReactNode };

const initial: Msg[] = [
  { role: "ai", content: <>Hi! I'm <b>HouseIQ</b> — ask me anything about properties, localities, or budgets across India.</> },
];

function AiResponse({ prompt }: { prompt: string }) {
  // pick a response shape based on keywords
  const lower = prompt.toLowerCase();
  if (lower.includes("compare")) {
    const data = [
      { name: "Gota", price: 78, psqft: 6200, premium: 72 },
      { name: "South Bopal", price: 96, psqft: 7400, premium: 84 },
    ];
    return (
      <div>
        <p className="text-sm">Here's a quick comparison between <b>Gota</b> and <b>South Bopal</b>:</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {data.map(d => (
            <div key={d.name} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{d.name}</div>
              <div className="mt-1 text-2xl font-bold text-gradient">₹{d.price}L avg</div>
              <div className="mt-2 text-xs text-muted-foreground">₹{d.psqft}/sqft · Premium {d.premium}/100</div>
            </div>
          ))}
        </div>
        <div className="mt-3 h-48 rounded-2xl border border-border bg-card/60 p-3 backdrop-blur">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3"/>
              <XAxis dataKey="name" tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/><YAxis tick={{fill:"var(--color-muted-foreground)", fontSize: 11}}/>
              <Tooltip contentStyle={{background:"var(--color-popover)",border:"1px solid var(--color-border)",borderRadius:12}}/>
              <Bar dataKey="psqft" radius={[8,8,0,0]} fill="var(--color-chart-1)"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  if (lower.includes("budget") || lower.includes("rajkot")) {
    return (
      <div>
        <p className="text-sm">For a typical <b>2 BHK in Rajkot</b>, here's the budget you'd need:</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { l: "Avg price", v: "₹52 L" }, { l: "Down payment (20%)", v: "₹10.4 L" },
            { l: "EMI (20y @ 8.5%)", v: "₹36,100" }, { l: "Stamp + reg", v: "₹3.1 L" },
          ].map(s => (
            <div key={s.l} className="rounded-2xl border border-border bg-card/60 p-3 backdrop-blur">
              <div className="text-[11px] uppercase text-muted-foreground">{s.l}</div>
              <div className="text-base font-semibold">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (lower.includes("societies") || lower.includes("shela")) {
    const list = [
      { n: "Godrej Garden City", s: 94, p: "₹1.38 Cr" },
      { n: "Shaligram Lakeview", s: 91, p: "₹1.55 Cr" },
      { n: "Sun Optima", s: 88, p: "₹85 L" },
    ];
    return (
      <div>
        <p className="text-sm">Top societies in <b>Shela</b>:</p>
        <div className="mt-3 space-y-2">
          {list.map(l => (
            <div key={l.n} className="flex items-center justify-between rounded-2xl border border-border bg-card/60 p-3 backdrop-blur">
              <div>
                <div className="text-sm font-semibold">{l.n}</div>
                <div className="text-xs text-muted-foreground">Match {l.s}%</div>
              </div>
              <div className="text-sm font-semibold text-gradient">{l.p}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  // default: 3 BHK Ahmedabad
  const recs = [
    { n: "Godrej Garden City", p: "₹1.38 Cr", a: "Shela · 1450 sqft" },
    { n: "Sun Optima", p: "₹1.10 Cr", a: "Gota · 1320 sqft" },
    { n: "Shaligram Prime", p: "₹1.42 Cr", a: "Bopal · 1480 sqft" },
  ];
  return (
    <div>
      <p className="text-sm">Here are 3 BHKs in <b>Ahmedabad</b> under ₹1.5 Cr matched to you:</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {recs.map(r => (
          <div key={r.n} className="rounded-2xl border border-border bg-card/60 p-3 backdrop-blur">
            <div className="text-sm font-semibold">{r.n}</div>
            <div className="text-xs text-muted-foreground">{r.a}</div>
            <div className="mt-1 text-base font-bold text-gradient">{r.p}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", content: text }, { role: "ai", content: <AiResponse prompt={text}/> }]);
    setInput("");
  };

  return (
    <div>
      <PageHeader
        eyebrow="AI Assistant"
        title={<>Talk to your <span className="text-gradient">real estate data</span></>}
        description="Ask in plain English — get prices, recommendations, comparisons and budgets as structured visual answers."
      />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="glass overflow-hidden rounded-[2rem] p-2">
          <div className="space-y-4 p-4 max-h-[60vh] overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""} animate-fade-up`}>
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${m.role === "user" ? "bg-accent" : "bg-gradient-brand text-white shadow-glow"}`}>
                  {m.role === "user" ? <User className="h-4 w-4"/> : <Bot className="h-4 w-4"/>}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-gradient-brand text-white shadow-glow" : "border border-border bg-card"}`}>
                  {typeof m.content === "string" ? <p className="text-sm">{m.content}</p> : <div className="text-foreground">{m.content}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={()=>send(s)} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-accent transition">
                  <Sparkles className="h-3 w-3 text-brand"/> {s}
                </button>
              ))}
            </div>
            <form onSubmit={e=>{e.preventDefault(); send(input);}} className="flex items-center gap-2 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur">
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask anything about Indian real estate…" className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"/>
              <button type="submit" className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02]">
                Send <Send className="h-3.5 w-3.5"/>
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
