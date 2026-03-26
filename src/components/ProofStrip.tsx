"use client";

import StatCounter from "@/components/StatCounter";

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 12, suffix: "+", label: "Quality Checks" },
  { value: 80, suffix: "%", label: "Less Debug Time" },
  { value: 87, prefix: "", suffix: "", label: "Avg Score After" },
];

export default function ProofStrip() {
  return (
    <div
      data-testid="proof-strip"
      className="grid grid-cols-1 gap-8 sm:grid-cols-3"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="text-center" data-testid="stat-item">
          <p className="text-4xl font-bold text-biq-text-primary md:text-5xl">
            <StatCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          </p>
          <p className="mt-2 text-sm font-medium text-biq-text-muted">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
