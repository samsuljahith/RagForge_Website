import type { ComponentType } from "react";

export type FlowStep = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
};

/**
 * Animated 3D-style flow diagram. Horizontal on desktop, vertical on mobile.
 * Floating tilted nodes with glowing packets traveling between them — built
 * so non-technical viewers can see data moving step by step.
 */
export function Flow3D({ steps, accent = "forge" }: { steps: FlowStep[]; accent?: "forge" | "purple" }) {
  const dotColor = accent === "purple" ? "bg-secondary" : "bg-primary";
  return (
    <div className="flow-scene relative w-full">
      <div className="hidden md:flex items-stretch justify-between gap-3">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center gap-3">
            <FlowCard step={s} alt={i % 2 === 1} />
            {i < steps.length - 1 && (
              <div className="relative h-[3px] flex-1 rounded-full bg-border/70">
                <span className={`flow-packet ${dotColor}`} style={{ animationDelay: `${i * 0.4}s` }} />
                <span className={`flow-packet ${dotColor}`} style={{ animationDelay: `${i * 0.4 + 1.3}s` }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex md:hidden flex-col items-stretch gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center gap-2">
            <FlowCard step={s} alt={i % 2 === 1} mobile />
            {i < steps.length - 1 && (
              <div className="relative w-[3px] h-12 rounded-full bg-border/70">
                <span className={`flow-packet-v ${dotColor}`} style={{ animationDelay: `${i * 0.3}s` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowCard({ step, alt, mobile }: { step: FlowStep; alt?: boolean; mobile?: boolean }) {
  const Icon = step.icon;
  return (
    <div
      className={`flow-node ${alt ? "flow-node-alt" : ""} relative shrink-0 rounded-2xl p-4 ${
        mobile ? "w-full max-w-xs" : "min-w-[140px] flex-1"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flow-cube flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-bold leading-tight">{step.label}</div>
          {step.sub && <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{step.sub}</div>}
        </div>
      </div>
    </div>
  );
}
