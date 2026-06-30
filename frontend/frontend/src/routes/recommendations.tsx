import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Heart, MapPin, Bed, Maximize2, Star, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "Recommendations — HouseIQ" }, { name: "description", content: "Personalized property suggestions matched to your preferences." }] }),
  component: Recommendations,
});

const inputCls = "w-full rounded-xl border border-input bg-card/60 backdrop-blur px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";

const listings = [
  { society: "Godrej Garden City", city: "Ahmedabad", price: "₹1.38 Cr", area: 1450, bhk: 3, psqft: 9517, facilities: ["Pool","Gym","Security"], score: 94, gradient: "from-blue-500 to-indigo-500" },
  { society: "Lodha Park", city: "Mumbai", price: "₹3.20 Cr", area: 1180, bhk: 2, psqft: 27118, facilities: ["Pool","Club","Garden"], score: 91, gradient: "from-indigo-500 to-violet-500" },
  { society: "Prestige Lakeside", city: "Bangalore", price: "₹1.95 Cr", area: 1620, bhk: 3, psqft: 12037, facilities: ["Gym","Pool","Parking"], score: 90, gradient: "from-violet-500 to-fuchsia-500" },
  { society: "Sun Optima", city: "Ahmedabad", price: "₹85 L", area: 1180, bhk: 2, psqft: 7203, facilities: ["Gym","Security"], score: 88, gradient: "from-cyan-500 to-blue-500" },
  { society: "Goyal Orchid Whitefield", city: "Bangalore", price: "₹1.42 Cr", area: 1350, bhk: 3, psqft: 10518, facilities: ["Pool","Club","Garden"], score: 87, gradient: "from-fuchsia-500 to-pink-500" },
  { society: "My Home Bhooja", city: "Hyderabad", price: "₹1.65 Cr", area: 1820, bhk: 3, psqft: 9066, facilities: ["Gym","Pool","Security"], score: 86, gradient: "from-amber-500 to-orange-500" },
];

function Recommendations() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  return (
    <div>
      <PageHeader
        eyebrow="Recommendations"
        title={<>Hand-picked homes <span className="text-gradient">matched to you</span></>}
        description="Tell us your budget, BHK and amenities — we rank thousands of properties by fit score."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="glass h-fit rounded-3xl p-5 lg:sticky lg:top-24 animate-fade-up">
          <h3 className="text-sm font-semibold">Filters</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Budget (₹ Cr)</label>
              <input type="range" min={0.3} max={5} step={0.1} defaultValue={1.5} className="w-full accent-[color:var(--color-brand)]"/>
              <div className="flex justify-between text-[11px] text-muted-foreground"><span>₹30L</span><span>₹5Cr</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-muted-foreground">Min area</label><input className={inputCls} defaultValue={800}/></div>
              <div><label className="text-xs text-muted-foreground">Max area</label><input className={inputCls} defaultValue={2200}/></div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">BHK</label>
              <div className="mt-1 flex gap-1">{["1","2","3","4+"].map(b=><button key={b} className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs hover:bg-accent">{b}</button>)}</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">City</label>
              <select className={inputCls}><option>Any</option><option>Ahmedabad</option><option>Mumbai</option><option>Bangalore</option></select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amenities</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Pool","Gym","Club","Garden","Security","Parking"].map(a=>(
                  <button key={a} className="rounded-full border border-border px-2.5 py-1 text-[11px] hover:bg-accent">{a}</button>
                ))}
              </div>
            </div>
            <button className="w-full rounded-xl bg-gradient-brand py-2.5 text-sm font-semibold text-white shadow-glow">Apply filters</button>
          </div>
        </aside>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((l, i) => (
            <article key={l.society} className="group overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-glow animate-fade-up" style={{animationDelay:`${i*60}ms`}}>
              <div className={`relative h-44 bg-gradient-to-br ${l.gradient}`}>
                <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "20px 20px, 30px 30px"}}/>
                <button onClick={()=>setLiked(s=>({...s, [l.society]: !s[l.society]}))} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110">
                  <Heart className={`h-4 w-4 ${liked[l.society] ? "fill-red-500 text-red-500" : "text-foreground"}`}/>
                </button>
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
                  <span className="text-gradient">{l.score}% match</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <div className="text-sm font-semibold drop-shadow">{l.society}</div>
                    <div className="flex items-center gap-1 text-xs opacity-90"><MapPin className="h-3 w-3"/>{l.city}</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{l.price}</span>
                  <span className="text-xs text-muted-foreground">₹{l.psqft.toLocaleString()}/sqft</span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5"/>{l.bhk} BHK</span>
                  <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5"/>{l.area} sqft</span>
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400"/>{(l.score/20).toFixed(1)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {l.facilities.map(f=><span key={f} className="rounded-full border border-border bg-accent/40 px-2 py-0.5 text-[11px]">{f}</span>)}
                </div>
                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-2.5 text-sm font-semibold text-white shadow-glow transition group-hover:scale-[1.01]">
                  View Details <ArrowRight className="h-4 w-4"/>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
