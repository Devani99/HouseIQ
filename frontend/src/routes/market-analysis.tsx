import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Building2, IndianRupee, MapPin, TrendingUp } from "lucide-react";

import "leaflet/dist/leaflet.css";

import MarketExplorer from "@/components/market/MarketExplorer";
import { PageHeader } from "@/components/site/PageHeader";
import api from "@/lib/api";

import WordCloud from "@/components/market/WordCloud";

export const Route = createFileRoute("/market-analysis")({
  head: () => ({
    meta: [
      { title: "Market Analysis — HouseIQ" },
      { name: "description", content: "Explore price trends, premium societies, and distributions across Indian cities." },
    ],
  }),
  component: MarketAnalysis,
});

type MapPoint = {
  locality: string;
  price_cr: number;
  latitude: number;
  longitude: number;
};

type CityStats = {
  avg_price: number;
  median_price: number;
  max_price: number;
  min_price: number;
  total_localities: number;
  map_data: MapPoint[];
};

// react-leaflet touches `window` at import time, so it must never be imported
// during SSR. We only load it lazily inside a client-only useEffect.
type LeafletModule = typeof import("react-leaflet");

const inputCls =
  "rounded-xl border border-input bg-card/80 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

function formatPrice(value: number) {
  return `₹${value.toFixed(2)} Cr`;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getMarkerRadius(price: number, minimumPrice: number, maximumPrice: number) {
  if (maximumPrice <= minimumPrice) {
    return 12;
  }

  const normalized = (price - minimumPrice) / (maximumPrice - minimumPrice);
  return clamp(8 + normalized * 18, 8, 26);
}

function getMarkerColor(price: number, minimumPrice: number, maximumPrice: number) {
  if (maximumPrice <= minimumPrice) {
    return "#2563eb";
  }

  const normalized = (price - minimumPrice) / (maximumPrice - minimumPrice);
  const hue = 225 - normalized * 185;
  return `hsl(${hue}, 85%, 52%)`;
}

function getCenter(points: MapPoint[]) {
  if (!points.length) {
    return { lat: 23.0225, lng: 72.5714 };
  }

  const total = points.reduce(
    (accumulator, point) => {
      accumulator.lat += point.latitude;
      accumulator.lng += point.longitude;
      return accumulator;
    },
    { lat: 0, lng: 0 },
  );

  return {
    lat: total.lat / points.length,
    lng: total.lng / points.length,
  };
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-white shadow-glow">
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-1 text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function LeafletBubbleMap({ points }: { points: MapPoint[] }) {
  const [leafletModule, setLeafletModule] = useState<LeafletModule | null>(null);

  useEffect(() => {
    let mounted = true;

    import("react-leaflet").then((module) => {
      if (mounted) {
        setLeafletModule(module);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const mapCenter = useMemo(() => getCenter(points), [points]);

  if (!points.length) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
        No locality coordinates available for this city.
      </div>
    );
  }

  if (!leafletModule) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-3xl border border-border bg-card/70 text-sm text-muted-foreground">
        Loading map...
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = leafletModule;
  const minimumPrice = Math.min(...points.map((point) => point.price_cr));
  const maximumPrice = Math.max(...points.map((point) => point.price_cr));

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={11} scrollWheelZoom className="h-[480px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => {
          const color = getMarkerColor(point.price_cr, minimumPrice, maximumPrice);

          return (
            <CircleMarker
              key={`${point.locality}-${point.latitude}-${point.longitude}`}
              center={[point.latitude, point.longitude]}
              radius={getMarkerRadius(point.price_cr, minimumPrice, maximumPrice)}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.82,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-foreground">{point.locality}</div>
                  <div className="text-muted-foreground">Average price</div>
                  <div className="text-base font-semibold text-foreground">{formatPrice(point.price_cr)}</div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function MarketAnalysis() {
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("ahmedabad");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [wordCloudCity, setWordCloudCity] = useState("ahmedabad");
  const [stats, setStats] = useState<CityStats | null>(null);
  const [mapData, setMapData] = useState<MapPoint[]>([]);
  const [loadingMap, setLoadingMap] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get<string[]>("/cities")
      .then((response) => {
        if (!active) {
          return;
        }

        setCities(response.data);

        if (!response.data.includes(selectedCity) && response.data[0]) {
          setSelectedCity(response.data[0]);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let active = true;

    setLoadingMap(true);

    api
      .get<CityStats>(`/market-map/${selectedCity}`)
      .then((response) => {
        if (!active) {
          return;
        }

        setStats(response.data);
        setMapData(response.data.map_data ?? []);
      })
      .catch((error) => {
        console.error(error);

        if (active) {
          setStats(null);
          setMapData([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingMap(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedCity]);

  const statsCards = useMemo(
    () => [
      {
        label: "Average price",
        value: stats ? formatPrice(stats.avg_price) : "—",
        icon: <IndianRupee className="h-5 w-5" />,
      },
      {
        label: "Median price",
        value: stats ? formatPrice(stats.median_price) : "—",
        icon: <TrendingUp className="h-5 w-5" />,
      },
      {
        label: "Localities",
        value: stats ? new Intl.NumberFormat("en-IN").format(stats.total_localities) : "—",
        icon: <MapPin className="h-5 w-5" />,
      },
      {
        label: "Peak price",
        value: stats ? formatPrice(stats.max_price) : "—",
        icon: <Building2 className="h-5 w-5" />,
      },
    ],
    [stats],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Market Analysis"
        title={
          <>
            The <span className="text-gradient">Indian real estate market</span>, decoded
          </>
        }
        description="Interactive charts powered by 47,000+ residential listings across 9 cities."
      />

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight">Market Heatmap</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Circle markers are sized and colored by average property price across localities in the selected city.
              </p>
            </div>

            <div className="min-w-[220px]">
              <label className="mb-2 block text-sm font-medium text-foreground">City</label>
              <select className={inputCls} value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statsCards.map((card) => (
              <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
            ))}
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_0.85fr]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Interactive Bubble Map</h3>
                  <p className="text-sm text-muted-foreground">Hover any locality to inspect its average price.</p>
                </div>
                <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {loadingMap ? "Refreshing map" : `${mapData.length} localities`}
                </div>
              </div>

              <LeafletBubbleMap points={mapData} />
            </div>

            <div className="rounded-3xl border border-border bg-muted/20 p-5">
              <h3 className="text-base font-semibold">Price scale</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Lower-priced areas appear in cool tones, while premium pockets shift toward warm tones.
              </p>

              <div className="mt-5 space-y-3">
                {[
                  { label: "Low", color: "#2563eb" },
                  { label: "Mid", color: "#a855f7" },
                  { label: "High", color: "#ef4444" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">Average price bucket</p>
                    </div>
                  </div>
                ))}
              </div>

              {stats && (
                <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Selected city summary</p>
                  <p className="mt-2">Average price: {formatPrice(stats.avg_price)}</p>
                  <p>Median price: {formatPrice(stats.median_price)}</p>
                  <p>Lowest locality average: {formatPrice(stats.min_price)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <MarketExplorer />
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-6">

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <h2 className="text-2xl font-bold">

                        Amenities Word Cloud

                    </h2>

                    <p className="text-sm text-muted-foreground">

                        Most common amenities in the selected city

                    </p>

                </div>

                <select
                    className={inputCls}
                    value={wordCloudCity}
                    onChange={(e)=>setWordCloudCity(e.target.value)}
                >

                    {
                        cities.map(city=>(

                            <option
                                key={city}
                                value={city}
                            >

                                {city}

                            </option>

                        ))
                    }

                </select>

            </div>

            <WordCloud
                city={wordCloudCity}
                locality=""
            />

        </div>

      </section>
          
    
    </div>


  );
}
