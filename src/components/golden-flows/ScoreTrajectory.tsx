import type { TrajectorySnapshot } from "@/types/golden-flows/contract-b/trajectory";

interface Props {
  snapshots: TrajectorySnapshot[];
  /** "compact" = current small chart; "full" = wider, taller for dashboard tab */
  size?: "compact" | "full";
}

/**
 * SVG mini line chart showing score improvement over time.
 * Pure SVG — no external charting library.
 */
export default function ScoreTrajectory({ snapshots, size = "compact" }: Props) {
  if (snapshots.length === 0) return null;

  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];
  const improving = last.score >= first.score;

  // Chart dimensions — full mode is wider and taller
  const width = size === "full" ? 560 : 280;
  const height = size === "full" ? 200 : 120;
  const padX = 36;
  const padTop = 20;
  const padBottom = 28;
  const plotW = width - padX * 2;
  const plotH = height - padTop - padBottom;

  // Scale helpers
  const minScore = Math.min(...snapshots.map((s) => s.score));
  const maxScore = Math.max(...snapshots.map((s) => s.score));
  const scoreRange = maxScore - minScore || 1; // avoid division by zero

  function x(i: number): number {
    if (snapshots.length === 1) return padX + plotW / 2;
    return padX + (i / (snapshots.length - 1)) * plotW;
  }

  function y(score: number): number {
    return padTop + plotH - ((score - minScore) / scoreRange) * plotH;
  }

  // Build polyline points
  const points = snapshots.map((s, i) => `${x(i)},${y(s.score)}`).join(" ");

  // Month label helper
  function monthLabel(snap: TrajectorySnapshot): string {
    return `Mo ${snap.month}`;
  }

  const strokeColor = improving ? "#16a34a" : "#dc2626"; // green-600 / red-600
  const dotFill = improving ? "#22c55e" : "#ef4444"; // green-500 / red-500
  const bgGradientId = "trajectory-bg";

  return (
    <div className={`w-full ${size === "full" ? "max-w-full" : "max-w-[300px]"}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Score trajectory: ${first.score} to ${last.score} over ${snapshots.length} months`}
      >
        {/* Background gradient under the line */}
        <defs>
          <linearGradient id={bgGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={improving ? "#22c55e" : "#ef4444"}
              stopOpacity={0.15}
            />
            <stop
              offset="100%"
              stopColor={improving ? "#22c55e" : "#ef4444"}
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>

        {/* Filled area under the line */}
        {snapshots.length > 1 && (
          <polygon
            points={`${x(0)},${padTop + plotH} ${points} ${x(snapshots.length - 1)},${padTop + plotH}`}
            fill={`url(#${bgGradientId})`}
          />
        )}

        {/* Trend line */}
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points with score labels */}
        {snapshots.map((snap, i) => (
          <g key={snap.month}>
            {/* Dot */}
            <circle
              cx={x(i)}
              cy={y(snap.score)}
              r={4}
              fill={dotFill}
              stroke="white"
              strokeWidth={1.5}
            />
            {/* Score value above the dot */}
            <text
              x={x(i)}
              y={y(snap.score) - 8}
              textAnchor="middle"
              className="fill-bayesiq-800"
              fontSize={11}
              fontWeight={600}
            >
              {snap.score}
            </text>
            {/* Month label below */}
            <text
              x={x(i)}
              y={padTop + plotH + 16}
              textAnchor="middle"
              className="fill-bayesiq-500"
              fontSize={10}
            >
              {monthLabel(snap)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
