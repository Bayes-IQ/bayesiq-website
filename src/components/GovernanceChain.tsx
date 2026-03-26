interface GovernanceChainNode {
  label: string;
}

interface GovernanceChainProps {
  /** Nodes to display in the chain */
  nodes?: GovernanceChainNode[];
  /** "simple" for homepage, "expanded" for platform page */
  variant?: "simple" | "expanded";
  /** Whether to animate continuously (platform page only) */
  animate?: boolean;
  /** Color theme: "light" for dark backgrounds, "dark" for light backgrounds */
  theme?: "light" | "dark";
}

const defaultNodes: GovernanceChainNode[] = [
  { label: "Raw Data" },
  { label: "Reviewed" },
  { label: "Approved" },
];

export default function GovernanceChain({
  nodes = defaultNodes,
  variant = "simple",
  theme = "dark",
}: GovernanceChainProps) {
  const nodeRadius = variant === "simple" ? 20 : 24;
  const nodeSpacing = variant === "simple" ? 160 : 200;

  // Theme-aware colors
  const nodeFill =
    theme === "light" ? "var(--color-bayesiq-200)" : "var(--color-biq-text-primary)";
  const nodeText = theme === "light" ? "var(--color-biq-text-primary)" : "white";
  const connectorColor =
    theme === "light" ? "var(--color-bayesiq-500)" : "var(--color-biq-text-muted)";
  const labelColor =
    theme === "light" ? "var(--color-bayesiq-300)" : "var(--color-biq-text-secondary)";

  // Horizontal layout dimensions
  const svgWidth = (nodes.length - 1) * nodeSpacing + nodeRadius * 2 + 40;
  const svgHeight = 100;
  const startX = nodeRadius + 20;
  const centerY = 36;

  // Vertical layout dimensions (mobile)
  const verticalSpacing = 80;
  const svgHeightVertical =
    (nodes.length - 1) * verticalSpacing + nodeRadius * 2 + 60;
  const centerX = 60;
  const startY = nodeRadius + 20;

  return (
    <div data-testid="governance-chain">
      {/* Desktop: horizontal */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="mx-auto hidden w-full max-w-lg md:block"
        role="img"
        aria-label={`Governance chain: ${nodes.map((n) => n.label).join(" to ")}`}
      >
        {nodes.map((node, i) => {
          const x = startX + i * nodeSpacing;

          return (
            <g key={node.label}>
              {/* Connector line to next node */}
              {i < nodes.length - 1 && (
                <>
                  <line
                    x1={x + nodeRadius}
                    y1={centerY}
                    x2={startX + (i + 1) * nodeSpacing - nodeRadius}
                    y2={centerY}
                    stroke={connectorColor}
                    strokeWidth={2}
                  />
                  {/* Arrow head */}
                  <polygon
                    points={`${startX + (i + 1) * nodeSpacing - nodeRadius - 6},${centerY - 4} ${startX + (i + 1) * nodeSpacing - nodeRadius},${centerY} ${startX + (i + 1) * nodeSpacing - nodeRadius - 6},${centerY + 4}`}
                    fill={connectorColor}
                  />
                </>
              )}

              {/* Node circle */}
              <circle cx={x} cy={centerY} r={nodeRadius} fill={nodeFill} />

              {/* Checkmark inside circle */}
              <text
                x={x}
                y={centerY + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={nodeText}
                fontSize={variant === "simple" ? 14 : 16}
                fontFamily="var(--font-sans)"
              >
                {i === 0 ? "\u25CB" : i === 1 ? "\u25C9" : "\u2713"}
              </text>

              {/* Label below */}
              <text
                x={x}
                y={centerY + nodeRadius + 20}
                textAnchor="middle"
                fill={labelColor}
                fontSize={13}
                fontFamily="var(--font-sans)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Mobile: vertical */}
      <svg
        viewBox={`0 0 120 ${svgHeightVertical}`}
        className="mx-auto block w-28 md:hidden"
        role="img"
        aria-label={`Governance chain: ${nodes.map((n) => n.label).join(" to ")}`}
      >
        {nodes.map((node, i) => {
          const y = startY + i * verticalSpacing;

          return (
            <g key={node.label}>
              {/* Connector line to next node */}
              {i < nodes.length - 1 && (
                <>
                  <line
                    x1={centerX}
                    y1={y + nodeRadius}
                    x2={centerX}
                    y2={startY + (i + 1) * verticalSpacing - nodeRadius}
                    stroke={connectorColor}
                    strokeWidth={2}
                  />
                  <polygon
                    points={`${centerX - 4},${startY + (i + 1) * verticalSpacing - nodeRadius - 6} ${centerX},${startY + (i + 1) * verticalSpacing - nodeRadius} ${centerX + 4},${startY + (i + 1) * verticalSpacing - nodeRadius - 6}`}
                    fill={connectorColor}
                  />
                </>
              )}

              {/* Node circle */}
              <circle cx={centerX} cy={y} r={nodeRadius} fill={nodeFill} />

              {/* Icon */}
              <text
                x={centerX}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill={nodeText}
                fontSize={14}
                fontFamily="var(--font-sans)"
              >
                {i === 0 ? "\u25CB" : i === 1 ? "\u25C9" : "\u2713"}
              </text>

              {/* Label to the right */}
              <text
                x={centerX + nodeRadius + 10}
                y={y + 1}
                dominantBaseline="central"
                fill={labelColor}
                fontSize={12}
                fontFamily="var(--font-sans)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
