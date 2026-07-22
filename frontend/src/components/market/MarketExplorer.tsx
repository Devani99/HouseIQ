import { useEffect, useMemo, useState } from "react";

import api from "@/lib/api";

import ChartRenderer, { type GraphType } from "./ChartRenderer";

type GraphResponse = {
  x_axis: string;
  y_axis: string;
  available_graphs: GraphType[];
  default_graph: GraphType;
  data: Record<string, unknown>[];
};

const inputCls =
  "w-full rounded-xl border border-input bg-card/80 px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

const graphLabels: Record<GraphType, string> = {
  bar: "Bar",
  horizontal_bar: "Horizontal Bar",
  pie: "Pie",
  scatter: "Scatter",
  line: "Line",
  area: "Area",
};

export default function MarketExplorer() {
  const [columns, setColumns] = useState<string[]>([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single source of truth for the response payload + the currently active graph type.
  const [graphResponse, setGraphResponse] = useState<GraphResponse | null>(null);
  const [graphType, setGraphType] = useState<GraphType | "">("");

  useEffect(() => {
    let active = true;

    api
      .get<unknown>("/columns")
      .then((response) => {
        if (!active) {
          return;
        }

        const payload = response.data;
        // Be defensive: backend may return a bare array, or an object like
        // { columns: [...] }. Normalize either shape so .map never crashes.
        const normalized = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { columns?: unknown })?.columns)
            ? ((payload as { columns: string[] }).columns)
            : [];

        if (!normalized.length) {
          console.warn("Unexpected /columns response shape:", payload);
        }

        setColumns(normalized);
      })
      .catch((fetchError) => {
        console.error(fetchError);
        setColumns([]);
      });

    return () => {
      active = false;
    };
  }, []);

  async function generateGraph() {
    if (!xAxis || !yAxis) {
      setError("Please select both X Axis and Y Axis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<GraphResponse>("/custom-graph", {
        params: { x_col: xAxis, y_col: yAxis },
      });

      const payload = response.data;
      const normalizedData = Array.isArray(payload?.data) ? payload.data : [];

      setGraphResponse({ ...payload, data: normalizedData });
      setGraphType(payload.default_graph);
    } catch (fetchError) {
      console.error(fetchError);
      setGraphResponse(null);
      setGraphType("");
      setError("Unable to generate graph. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const graphOptions = useMemo(
    () => (Array.isArray(graphResponse?.available_graphs) ? graphResponse.available_graphs : []),
    [graphResponse],
  );

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card/90 p-6 shadow-soft backdrop-blur">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Market Explorer</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Select any two features, generate a chart from the backend, and switch graph types without refetching.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">X Axis</label>
          <select className={inputCls} value={xAxis} onChange={(event) => setXAxis(event.target.value)}>
            <option value="">Select X Axis</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Y Axis</label>
          <select className={inputCls} value={yAxis} onChange={(event) => setYAxis(event.target.value)}>
            <option value="">Select Y Axis</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={generateGraph}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-brand px-5 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {graphResponse && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">X Axis</p>
              <p className="mt-2 text-sm font-semibold">{graphResponse.x_axis}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Y Axis</p>
              <p className="mt-2 text-sm font-semibold">{graphResponse.y_axis}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/20 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Records</p>
              <p className="mt-2 text-sm font-semibold">{graphResponse.data.length}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_260px] lg:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium">Graph Type</label>
              <select
                className={inputCls}
                value={graphType}
                onChange={(event) => setGraphType(event.target.value as GraphType)}
              >
                {graphOptions.map((option) => (
                  <option key={option} value={option}>
                    {graphLabels[option]}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              {graphOptions.length} graph types available
            </div>
          </div>

          <ChartRenderer
            graphType={graphType}
            graphData={graphResponse.data}
            xAxis={graphResponse.x_axis}
            yAxis={graphResponse.y_axis}
          />
        </div>
      )}
    </div>
  );
}
