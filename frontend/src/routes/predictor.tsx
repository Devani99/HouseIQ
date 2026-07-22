import { createFileRoute } from "@tanstack/react-router";
import { useState,useEffect } from "react";
import api from "@/lib/api";
import { PageHeader } from "@/components/site/PageHeader";
import { Sparkles, TrendingUp, Building2, Ruler, IndianRupee } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

export const Route = createFileRoute("/predictor")({
  head: () => ({
    meta: [
      { title: "Price Predictor — HouseIQ" },
      { name: "description", content: "Instant property valuation powered by CatBoost ML across 9 Indian cities." },
    ],
  }),
  component: Predictor,
});


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const selectCls = "w-full rounded-xl border border-input bg-card/60 backdrop-blur px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

function Predictor() {
  const [form, setForm] = useState({
    city: "Ahmedabad", locality: "Shela", society: "Godrej Garden City",
    type: "Apartment", selling: "Resale", facility: "Premium",
    bhk: 3, area: 1450,
    amenities: ["Gym", "Swimming Pool", "Parking", "Security"] as string[],
  });
  const [predicted,setPredicted] = useState(false);
  const [result,setResult] = useState<any>(null);
  const [cities,setCities]=useState<string[]>([])
  const [localities,setLocalities]=useState<string[]>([])
  const [societies,setSocieties]=useState<string[]>([])
  const [propertyTypes,setPropertyTypes]=useState<string[]>([])
  const [sellingTypes,setSellingTypes]=useState<string[]>([])
  const [facilityCats,setFacilityCats]=useState<string[]>([])
  const [amenities,setAmenities]=useState<string[]>([])

  useEffect(()=>{

      const loadData = async()=>{

      const cities = await api.get("/cities")
      setCities(cities.data)

      const property = await api.get("/property-types")
      setPropertyTypes(property.data)

      const selling = await api.get("/selling-types")
      setSellingTypes(selling.data)

      const facility = await api.get("/facility-categories")
      setFacilityCats(facility.data)

      const amenity = await api.get("/amenities")
      setAmenities(amenity.data)

      }

      loadData()

    },[])


    useEffect(()=>{

      if(!form.city)return

      api.get(`/localities/${form.city.toLowerCase()}`)

      .then(res=>{

      setLocalities(res.data)

    })

    },[form.city])


    useEffect(()=>{

      if(!form.locality)return

      api.get(`/societies/${form.locality}`)

      .then(res=>{

      setSocieties(res.data)

    })

    },[form.locality])

  const toggleAm = (a: string) => setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x=>x!==a) : [...f.amenities, a] }));

  const handlePredict = async()=>{

    try{

      const payload={

      selling_type:form.selling,

      property_type:form.type,

      society_name:form.society,

      bhk:form.bhk,

      builtup_area_sqft:form.area,

      locality:form.locality,

      city:form.city.toLowerCase(),

      facilities:form.amenities

      }


      const response=await api.post(

      "/predict",

      payload

      )


      setResult(

      response.data

      )


      setPredicted(

      true

      )

    }

    catch(err){

      console.log(err)

    }

  }

  const data = [

    {name:"Predicted",
    value: result ? result.predicted_price :0,
    fill:"var(--color-chart-1)"},

    {name:"Locality avg",
    value: result ? result.avg_locality_price:0,
    fill:"var(--color-chart-3)"},

    {name:"City avg",
    value:result? result.median_locality_price:0,
    fill:"var(--color-chart-2)"}
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Price Predictor · CatBoost ML"
        title={<>Get an <span className="text-gradient">instant fair price</span> for any property</>}
        description="Enter property details and our model returns a price, confidence range, and locality comparison in milliseconds."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_1.05fr]">
        {/* Form */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow"><Building2 className="h-4 w-4"/></div>
            <h2 className="text-lg font-semibold">Property details</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="City"><select className={selectCls} value={form.city} onChange={e=>setForm({...form, city:e.target.value})}>{cities.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Locality"><select className={selectCls} value={form.locality} onChange={e=>setForm({...form, locality:e.target.value})}>{localities.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Society"><select className={selectCls} value={form.society} onChange={e=>setForm({...form, society:e.target.value})}>{societies.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Property Type"><select className={selectCls} value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>{propertyTypes.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Selling Type"><select className={selectCls} value={form.selling} onChange={e=>setForm({...form, selling:e.target.value})}>{sellingTypes.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="Facility Category"><select className={selectCls} value={form.facility} onChange={e=>setForm({...form, facility:e.target.value})}>{facilityCats.map(c=><option key={c}>{c}</option>)}</select></Field>
            <Field label="BHK"><input type="number" className={selectCls} value={form.bhk} onChange={e=>setForm({...form, bhk:+e.target.value})} /></Field>
            <Field label="Built-up Area (sqft)"><input type="number" className={selectCls} value={form.area} onChange={e=>setForm({...form, area:+e.target.value})} /></Field>
          </div>

          <div className="mt-6">
            <label className="text-xs font-medium text-muted-foreground">Amenities</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {amenities.map(a => (
                <button key={a} type="button" onClick={()=>toggleAm(a)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${form.amenities.includes(a) ? "border-transparent bg-gradient-brand text-white shadow-glow" : "border-border bg-card hover:bg-accent"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handlePredict} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
            <Sparkles className="h-4 w-4"/> Predict Property Price
          </button>
        </div>

        {/* Result */}
        <div className="relative animate-fade-up">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl" />
          <div className="relative glass rounded-[2rem] p-7">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Predicted Price</div> 
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-6xl font-bold text-gradient">₹{result?result.predicted_price:"0"}Cr</span>
              <span className="text-sm text-muted-foreground">~₹{result? result.avg_price_per_sqft:0}/ sqft</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">Range: ₹{result? result.min_price :0}Cr - ₹{result?result.max_price:0}Cr</div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { l:"Avg locality price", v: `₹${result? result.avg_locality_price: 0} Cr`, i:TrendingUp },
                { l:"Median locality price", v: `₹${ result? result.median_locality_price: 0 } Cr`, i:IndianRupee },
                { l:"Avg price / sqft", v: `₹${ result? result.avg_price_per_sqft: 0 }`, i:Ruler},
                { l:"Area per bedroom", v: `${ result? result.area_per_bhk: 0 } sqft`, i:Building2},
              ].map(s => (
                <div key={s.l} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><s.i className="h-3.5 w-3.5"/>{s.l}</div>
                  <div className="mt-1 text-lg font-semibold">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
              <div className="mb-2 text-sm font-semibold">Predicted vs locality average</div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} layout="vertical" margin={{ left: 10, right: 24 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={90} tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "var(--color-accent)" }} contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v: number)=>`₹${v} Cr`} />
                    <Bar dataKey="value" radius={[8, 8, 8, 8]}>{data.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {!predicted && <div className="text-center text-xs text-muted-foreground">Click predict to update</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
