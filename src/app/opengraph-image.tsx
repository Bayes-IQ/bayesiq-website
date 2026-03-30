import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BayesIQ — Make Your Metrics Matter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f172a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: 24,
          }}
        >
          BayesIQ
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: 800,
          }}
        >
          Find broken metrics and broken data pipelines fast, then get the fix
          path.
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 32,
          }}
        >
          {["12+ quality checks", "0-100 scored audit", "dbt + dashboard"].map(
            (label) => (
              <div
                key={label}
                style={{
                  fontSize: 20,
                  color: "#94a3b8",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  padding: "10px 20px",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
