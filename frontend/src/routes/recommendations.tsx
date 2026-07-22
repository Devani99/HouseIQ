import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Heart, MapPin, Bed, Maximize2, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/recommendations")({
  head: () => ({ meta: [{ title: "Recommendations — HouseIQ" }, { name: "description", content: "Personalized property suggestions matched to your preferences." }] }),
  component: Recommendations,
});

const inputCls = "w-full rounded-xl border border-input bg-card/60 backdrop-blur px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";


function Recommendations() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [budget, setBudget] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  useEffect(() => {

    api.get("/cities")
        .then(res => setCities(res.data));

    api.get("/amenities")
        .then(res => setAvailableAmenities(res.data));

  }, []);

  useEffect(() => {

    if (!city) return;

    api.get(`/localities/${city}`)
        .then(res => setLocalities(res.data));

  }, [city]);

  async function fetchRecommendations() {

    setLoading(true);

    try {

        const res = await api.post(

            "/recommend",
            {

                budget: Number(budget),

                min_area: Number(minArea),

                max_area: Number(maxArea),

                city,

                locality,

                amenities

            }

        );

        console.log(res.data);

        setRecommendations(

            res.data

        );

    }

    finally {

        setLoading(false);

    }

  }


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
              <input type="number" className={inputCls} placeholder="Budget in ₹" value={budget} onChange={(e)=>setBudget(e.target.value)}/>
              <div className="flex justify-between text-[11px] text-muted-foreground"><span>₹30L</span><span>₹5Cr</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-xs text-muted-foreground">Min area</label><input className={inputCls} value={minArea} onChange={(e)=>setMinArea(e.target.value)}/> </div>
              <div><label className="text-xs text-muted-foreground">Max area</label><input className={inputCls} value={maxArea} onChange={(e)=>setMaxArea(e.target.value)}/> </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">City</label>
              <select className={inputCls} value={city} onChange={(e) => setCity(e.target.value)}> <option value="">Select City</option>{cities.map(c => (<option key={c}value={c}>{c}</option>))}</select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Locality</label>
              <select className={inputCls} value={locality} onChange={(e) => setLocality(e.target.value)}> <option value="">Select Locality</option> {localities.map(l => ( <option key={l} value={l}> {l}</option>))}</select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amenities</label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {availableAmenities.map((a: string) => (
                  <button
                    key={a}
                    type="button"
                    className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                      amenities.includes(a)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-border hover:bg-accent"
                    }`}
                    onClick={() => {
                      if (amenities.includes(a)) {
                        setAmenities(amenities.filter((item) => item !== a));
                      } else {
                        setAmenities([...amenities, a]);
                      }
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <button className="w-full rounded-xl bg-gradient-brand py-2.5 text-sm font-semibold text-white shadow-glow" onClick = {fetchRecommendations}>Apply filters</button>
          </div>
        </aside>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

  {recommendations.map((l: any, i: number) => (

    <article
      key={`${l.society_name}-${i}`}
      className="group overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-glow animate-fade-up"
      style={{ animationDelay: `${i * 60}ms` }}
    >

      {/* Header */}
      <div className="relative h-44 bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600">

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "20px 20px,30px 30px",
          }}
        />

        <button
          onClick={() =>
            setLiked((s) => ({
              ...s,
              [l.society_name]: !s[l.society_name],
            }))
          }
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 ${
              liked[l.society_name]
                ? "fill-red-500 text-red-500"
                : "text-foreground"
            }`}
          />
        </button>

        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-green-700">

          {Number(l.score).toFixed(2)}% Match

        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">

          <div className="text-lg font-bold">

            {l.society_name}

          </div>

          <div className="mt-1 flex items-center gap-1 text-sm">

            <MapPin className="h-4 w-4" />

            {l.locality}

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-5">

        <div className="flex items-center justify-between">

          <span className="text-3xl font-bold">

            ₹ {l.price_cr} Cr

          </span>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

            {Number(l.score).toFixed(2)}% Match

          </span>

        </div>

        <div className="mt-5 flex items-center gap-5 text-sm text-muted-foreground">

          <div className="flex items-center gap-2">

            <Maximize2 className="h-4 w-4" />

            {l.builtup_area_sqft} sqft

          </div>

        </div>

        <div className="mt-5 flex flex-wrap gap-2">

          {(l.reasons ?? []).map((reason: string, index: number) => (

            <span
              key={index}
              className="rounded-full border border-border bg-accent/40 px-3 py-1 text-xs"
            >

              {reason}

            </span>

          ))}

        </div>

        <button
          onClick={() => setSelectedProperty(l)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-2.5 text-sm font-semibold text-white shadow-glow transition group-hover:scale-[1.01]">
          View Details
          <ArrowRight className="h-4 w-4" />
        </button>

      </div>

        </article>

      ))}

    </div>

      <Dialog
  open={selectedProperty !== null}
  onOpenChange={(open) => {
    if (!open) setSelectedProperty(null);
  }}
>

  <DialogContent className="max-w-2xl">

    {selectedProperty && (

      <>

        <DialogHeader>

          <DialogTitle className="text-2xl">

            {selectedProperty.society_name}

          </DialogTitle>

          <DialogDescription>

            {selectedProperty.locality}

          </DialogDescription>

        </DialogHeader>

        <div className="mt-6 space-y-5">

          <div className="grid grid-cols-2 gap-5">

            <div className="rounded-xl bg-accent p-4">

              <div className="text-sm text-muted-foreground">

                Price

              </div>

              <div className="text-2xl font-bold">

                ₹ {selectedProperty.price_cr} Cr

              </div>

            </div>

            <div className="rounded-xl bg-accent p-4">

              <div className="text-sm text-muted-foreground">

                Built-up Area

              </div>

              <div className="text-2xl font-bold">

                {selectedProperty.builtup_area_sqft} sqft

              </div>

            </div>

          </div>

          <div>

            <h3 className="mb-3 font-semibold">

              Recommendation Score

            </h3>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">

              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${selectedProperty.score}%`,
                }}
              />

            </div>

            <p className="mt-2 text-sm">

              {selectedProperty.score.toFixed(2)}%

            </p>

          </div>

          <div>

            <h3 className="mb-3 font-semibold">

              Recommendation Reasons

            </h3>

            <div className="flex flex-wrap gap-2">

              {selectedProperty.reasons.map((reason: string) => (

                <span
                  key={reason}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm"
                >

                  {reason}

                </span>

              ))}

            </div>

          </div>

          <div>

            <h3 className="mb-2 font-semibold">

              Amenity Match

            </h3>

            <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">

              {selectedProperty.amenity_match}% Match

            </span>

          </div>

        </div>

      </>

    )}

  </DialogContent>

</Dialog>
      </section>
    </div>
  );
}
