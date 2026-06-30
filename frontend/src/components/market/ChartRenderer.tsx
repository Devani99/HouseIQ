import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type GraphType = "bar" | "horizontal_bar" | "pie" | "scatter" | "line" | "area";

type GraphDatum = Record<string, unknown>;

type Props = {
  graphType: GraphType | "";
  graphData: GraphDatum[];
  xAxis: string;
  yAxis: string;
};

const COLORS = ["#2563eb", "#0f766e", "#8b5cf6", "#f97316", "#ef4444", "#14b8a6"];
const GRID_COLOR = "rgba(148, 163, 184, 0.2)";
const AXIS_TICK = { fill: "#64748b", fontSize: 12 };

function isNumericValue(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * The backend doesn't tell us which key holds the numeric value to plot, so we
 * infer it: prefer a key other than x/y axis that has numeric data, then fall
 * back to y_axis, then x_axis.
 */
function resolveValueKey(graphData: GraphDatum[], xAxis: string, yAxis: string) {
  if (!graphData.length) {
    return yAxis;
  }

  const allKeys = Array.from(new Set(graphData.flatMap((row) => Object.keys(row))));
  const otherKeys = allKeys.filter((key) => key !== xAxis && key !== yAxis);

  const numericOther = otherKeys.find((key) => graphData.some((row) => isNumericValue(row[key])));
  if (numericOther) {
    return numericOther;
  }

  if (graphData.some((row) => isNumericValue(row[yAxis]))) {
    return yAxis;
  }

  if (graphData.some((row) => isNumericValue(row[xAxis]))) {
    return xAxis;
  }

  return otherKeys[0] ?? yAxis;
}

function ChartFrame({ children }: { children: React.ReactNode }) {
  return <div className="h-[460px] rounded-3xl border border-border bg-card/90 p-4 shadow-soft">{children}</div>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[460px] items-center justify-center rounded-3xl border border-dashed border-border bg-muted/20 text-sm text-muted-foreground">
      {message}
    </div>
  );
}

type TooltipPayloadEntry = { value?: unknown; payload?: GraphDatum };

function ChartTooltip({
  active,
  payload,
  label,
  valueKey,
  xAxis,
  yAxis,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: unknown;
  valueKey: string;
  xAxis: string;
  yAxis: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0]?.payload ?? {};

  return (
    <div className="rounded-2xl border border-border bg-background/95 px-4 py-3 text-sm shadow-xl backdrop-blur">
      <p className="font-semibold text-foreground">{String(label ?? entry[xAxis] ?? entry[yAxis] ?? "Data")}</p>
      <div className="mt-2 space-y-1 text-muted-foreground">
        <p>
          {valueKey}: <span className="font-medium text-foreground">{String(payload[0]?.value ?? "-")}</span>
        </p>
        <p>
          {xAxis}: <span className="font-medium text-foreground">{String(entry[xAxis] ?? "-")}</span>
        </p>
        <p>
          {yAxis}: <span className="font-medium text-foreground">{String(entry[yAxis] ?? "-")}</span>
        </p>
      </div>
    </div>
  );
}

export default function ChartRenderer({ graphType, graphData, xAxis, yAxis }: Props) {
  if (!graphType) {
    return <EmptyState message="Choose a graph type to render the chart." />;
  }

  if (!graphData.length) {
    return <EmptyState message="No data available for the selected axes." />;
  }

  const valueKey = resolveValueKey(graphData, xAxis, yAxis);
  const tooltip = (props: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: unknown }) => (
    <ChartTooltip {...props} valueKey={valueKey} xAxis={xAxis} yAxis={yAxis} />
  );

  switch (graphType) {
    case "bar":
      return (
        <ChartFrame>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphData} margin={{ top: 12, right: 24, left: 0, bottom: 32 }}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey={xAxis} tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip content={tooltip} />
              <Legend />
              <Bar dataKey={valueKey} fill={COLORS[0]} radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      );

    case "horizontal_bar":
      return (
        <ChartFrame>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graphData} layout="vertical" margin={{ top: 12, right: 24, left: 24, bottom: 12 }}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" horizontal={false} />
              <XAxis type="number" tick={AXIS_TICK} />
              <YAxis dataKey={xAxis} type="category" width={140} tick={AXIS_TICK} />
              <Tooltip content={tooltip} />
              <Legend />
              <Bar dataKey={valueKey} fill={COLORS[1]} radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>
      );

    case "pie":
      return (
        <ChartFrame>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={tooltip} />
              <Legend />
              <Pie
                data={graphData}
                dataKey={valueKey}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={70}
                paddingAngle={2}
              >
                {graphData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartFrame>
      );

    case "scatter":
      return (
        <ChartFrame>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 12, right: 24, left: 8, bottom: 24 }}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
              <XAxis dataKey={xAxis} type="number" tick={AXIS_TICK} />
              <YAxis dataKey={yAxis} type="number" tick={AXIS_TICK} />
              <Tooltip content={tooltip} cursor={{ stroke: COLORS[0], strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter data={graphData} fill={COLORS[2]} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartFrame>
      );

    case "line":
      return (
        <ChartFrame>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData} margin={{ top: 12, right: 24, left: 8, bottom: 24 }}>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
              <XAxis dataKey={xAxis} tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip content={tooltip} />
              <Legend />
              <Line type="monotone" dataKey={valueKey} stroke={COLORS[3]} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
      );

    case "area":
      return (
        <ChartFrame>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={graphData} margin={{ top: 12, right: 24, left: 8, bottom: 24 }}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[4]} stopOpacity={0.45} />
                  <stop offset="95%" stopColor={COLORS[4]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
              <XAxis dataKey={xAxis} tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} />
              <Tooltip content={tooltip} />
              <Legend />
              <Area type="monotone" dataKey={valueKey} stroke={COLORS[4]} fill="url(#areaFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>
      );

    default:
      return <EmptyState message="Unsupported graph type." />;
  }
}
