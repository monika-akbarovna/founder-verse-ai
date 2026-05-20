import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Swords, TrendingDown, CloudLightning, Tag, Rocket, Sparkles,
  ShieldAlert, DollarSign, Activity, Loader2, RotateCcw, Brain,
} from "lucide-react";
import type { Prediction } from "./Simulator";

type ScenarioId = "competitor" | "ad_costs" | "recession" | "pricing" | "viral";

type Scenario = {
  id: ScenarioId;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  // Multipliers/deltas applied on top of baseline
  apply: (p: Prediction) => Prediction;
  risk: string;
  narrative: (delta: Delta) => string;
};

type Delta = {
  survival: number;
  investor: number;
  viral: number;
  sentiment: number;
};

const SCENARIOS: Scenario[] = [
  {
    id: "competitor",
    label: "Competitor enters market",
    sub: "Series-B funded, same wedge",
    icon: Swords,
    color: "oklch(0.7 0.22 30)",
    risk: "Distribution & pricing pressure",
    apply: (p) => transform(p, {
      survival: -14, investor: -10, viral: -6, sentiment: -8,
      growthMult: 0.78, growthVolatility: 0.08, competitorBoost: 18, burnMult: 1.15,
    }),
    narrative: (d) => `A well-funded competitor compresses your wedge — investor confidence falls ${Math.abs(d.investor)}pts as differentiation risk repriced. Expect a 6–9 month price war.`,
  },
  {
    id: "ad_costs",
    label: "Ad costs spike +60%",
    sub: "iOS / platform CPM shock",
    icon: TrendingDown,
    color: "oklch(0.72 0.2 245)",
    risk: "CAC payback breaks",
    apply: (p) => transform(p, {
      survival: -8, investor: -6, viral: -3, sentiment: -2,
      growthMult: 0.86, burnMult: 1.35,
    }),
    narrative: (d) => `CAC payback stretches past 18 months. Survival drops ${Math.abs(d.survival)}pts. Shift mix toward organic, partnerships, or sales-led motion within 60 days.`,
  },
  {
    id: "recession",
    label: "Recession starts",
    sub: "Macro tightens, budgets freeze",
    icon: CloudLightning,
    color: "oklch(0.65 0.2 20)",
    risk: "Deal cycles 2–3x longer",
    apply: (p) => transform(p, {
      survival: -18, investor: -16, viral: -4, sentiment: -10,
      growthMult: 0.65, burnMult: 0.85,
    }),
    narrative: (d) => `Budget freezes elongate sales cycles. Investor confidence -${Math.abs(d.investor)}pts. Cut burn 30%, extend runway past 24 months, prioritize cash-positive customers.`,
  },
  {
    id: "pricing",
    label: "Pricing changes +25%",
    sub: "Premium reposition",
    icon: Tag,
    color: "oklch(0.72 0.18 165)",
    risk: "Logo churn spikes short-term",
    apply: (p) => transform(p, {
      survival: +4, investor: +9, viral: -4, sentiment: -6,
      growthMult: 1.08, burnMult: 0.95,
    }),
    narrative: (d) => `Net revenue lifts but logo churn rises. Investors reward gross margin expansion (+${d.investor}pts). Pair with a stronger onboarding moat to defend retention.`,
  },
  {
    id: "viral",
    label: "Product goes viral",
    sub: "Top of HN, 10x traffic spike",
    icon: Rocket,
    color: "oklch(0.68 0.25 295)",
    risk: "Infra & support overload",
    apply: (p) => transform(p, {
      survival: +6, investor: +18, viral: +24, sentiment: +14,
      growthMult: 1.55, growthVolatility: 0.18, burnMult: 1.2,
    }),
    narrative: (d) => `Viral spike compresses 6 months of growth into 3 weeks. Investor confidence +${d.investor}pts — but only if infra & support hold. Raise opportunistically within 30 days.`,
  },
];

function transform(
  base: Prediction,
  o: {
    survival: number; investor: number; viral: number; sentiment: number;
    growthMult: number; growthVolatility?: number;
    competitorBoost?: number; burnMult: number;
  },
): Prediction {
  const clamp = (n: number, lo = 5, hi = 99) => Math.max(lo, Math.min(hi, Math.round(n)));
  const survival = clamp(base.survival + o.survival);
  const investor = clamp(base.investor + o.investor);
  const viral = clamp(base.viral + o.viral);
  const sentiment = clamp(base.sentiment + o.sentiment);

  // Deterministic but feels noisy
  const vol = o.growthVolatility ?? 0.04;
  const growth = base.growth.map((v, i) => {
    const noise = Math.sin((i + 1) * 1.7) * vol * v;
    return Math.max(1, Math.round(v * o.growthMult + noise));
  });

  const competitors = base.competitors.map((c, i) => ({
    ...c,
    share: Math.max(8, Math.min(72, c.share + (o.competitorBoost ?? 0) * (i === 0 ? 1 : 0.4))),
    threat: (o.competitorBoost && i === 0 ? "High" : c.threat) as "Low" | "Medium" | "High",
  }));

  const burnNum = parseInt(base.burn.replace(/[^\d]/g, ""), 10) || 50;
  const burn = `$${Math.round(burnNum * o.burnMult)}k/mo`;

  const verdict: Prediction["verdict"] =
    survival > 75 && investor > 70 ? "Bullish" : survival > 55 ? "Cautious" : "High Risk";

  return { ...base, survival, investor, viral, sentiment, growth, competitors, burn, verdict };
}

export function WhatIfEngine({ baseline }: { baseline: Prediction }) {
  const [active, setActive] = useState<ScenarioId | null>(null);
  const [recalculating, setRecalculating] = useState(false);
  const [current, setCurrent] = useState<Prediction>(baseline);

  // Reset if baseline changes (new simulation run)
  useEffect(() => { setCurrent(baseline); setActive(null); }, [baseline]);

  const scenario = useMemo(() => SCENARIOS.find((s) => s.id === active) ?? null, [active]);

  function run(id: ScenarioId) {
    if (recalculating) return;
    setActive(id);
    setRecalculating(true);
    const s = SCENARIOS.find((x) => x.id === id)!;
    // Cinematic recalculation delay
    window.setTimeout(() => {
      setCurrent(s.apply(baseline));
      setRecalculating(false);
    }, 1100);
  }

  function reset() {
    setActive(null);
    setRecalculating(true);
    window.setTimeout(() => {
      setCurrent(baseline);
      setRecalculating(false);
    }, 600);
  }

  const delta: Delta = {
    survival: current.survival - baseline.survival,
    investor: current.investor - baseline.investor,
    viral: current.viral - baseline.viral,
    sentiment: current.sentiment - baseline.sentiment,
  };

  return (
    <div className="glass-strong glow-ring reflective relative overflow-hidden rounded-3xl p-6 md:p-8">
      {/* Ambient aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full blur-[120px] opacity-40 animate-aurora"
          style={{ background: "radial-gradient(circle, var(--neon-purple), transparent 65%)" }}
        />
        <div
          className="absolute -right-20 bottom-0 h-72 w-72 rounded-full blur-[120px] opacity-30 animate-aurora"
          style={{ background: "radial-gradient(circle, var(--neon-cyan), transparent 65%)" }}
        />
      </div>

      {/* Header */}
      <div className="relative flex flex-wrap items-end justify-between gap-3 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" />
            What-If Scenario Engine
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
            <span className="text-gradient">Stress-test your startup</span>{" "}
            <span className="text-gradient-brand">against the future</span>
          </h3>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Inject a real-world shock. NOVA recalculates survival, growth, and investor confidence in real time.
          </p>
        </div>
        <button
          onClick={reset}
          disabled={!active || recalculating}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-muted-foreground transition-all hover:text-foreground disabled:opacity-40"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset baseline
        </button>
      </div>

      {/* Scenario chips */}
      <div className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {SCENARIOS.map((s) => {
          const isActive = active === s.id;
          return (
            <motion.button
              key={s.id}
              onClick={() => run(s.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${
                isActive
                  ? "border-[var(--neon-purple)]/60 bg-white/[0.05] shadow-[0_0_40px_-8px_var(--neon-purple)]"
                  : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }`}
              style={isActive ? { boxShadow: `0 0 50px -10px ${s.color}` } : undefined}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-50"
                style={{ background: s.color }}
              />
              <div className="relative flex items-start gap-3">
                <div
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"
                  style={{ color: s.color }}
                >
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{s.label}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</div>
                </div>
              </div>
              <div className="relative mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>{s.risk}</span>
                {isActive && (
                  <span className="flex items-center gap-1 text-[var(--neon-cyan)]">
                    <span className="h-1 w-1 rounded-full bg-current shadow-[0_0_8px_currentColor] animate-pulse" />
                    Active
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Recalc / dashboard */}
      <div className="relative mt-7">
        <AnimatePresence mode="wait">
          {recalculating ? (
            <motion.div
              key="recalc"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="relative h-[360px] overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]"
            >
              <div className="absolute inset-0 grid-bg opacity-40" />
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent animate-[scan-line_1.6s_linear_infinite]" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 -m-2 rounded-full bg-[var(--neon-purple)]/30 blur-2xl animate-pulse" />
                    <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow-purple">
                      <Brain className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    NOVA recalculating <span className="text-foreground">{scenario?.label ?? "baseline"}</span>…
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Re-simulating 18 months · 6 agents
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={active ?? "baseline"}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="grid gap-5 lg:grid-cols-3"
            >
              {/* Left: deltas */}
              <div className="space-y-3">
                <DeltaCard icon={ShieldAlert} label="Survival" value={current.survival} delta={delta.survival} color="var(--neon-cyan)" />
                <DeltaCard icon={DollarSign} label="Investor Confidence" value={current.investor} delta={delta.investor} color="var(--neon-purple)" />
                <DeltaCard icon={Rocket} label="Viral Potential" value={current.viral} delta={delta.viral} color="oklch(0.7 0.22 30)" />
                <DeltaCard icon={Activity} label="Sentiment" value={current.sentiment} delta={delta.sentiment} color="var(--neon-blue)" />
              </div>

              {/* Middle/right: chart + narrative */}
              <div className="lg:col-span-2 space-y-5">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-sm font-medium">Recalculated Growth Curve</div>
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-3 rounded-full bg-white/30" /> Baseline
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-3 rounded-full bg-[var(--neon-purple)] shadow-[0_0_8px_var(--neon-purple)]" />
                        Scenario
                      </span>
                    </div>
                  </div>
                  <CompareChart baseline={baseline.growth} current={current.growth} />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
                      AI Risk Analysis
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {scenario ? scenario.narrative(delta) : "Baseline scenario active. Inject a shock above to see how your startup adapts."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Activity className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
                      Verdict shift
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Pill text={baseline.verdict} muted />
                      <span className="text-muted-foreground">→</span>
                      <Pill text={current.verdict} highlight={baseline.verdict !== current.verdict} />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Burn: <span className="text-foreground">{current.burn}</span>
                      {baseline.burn !== current.burn && (
                        <span className="ml-2 text-[var(--neon-purple)]">(from {baseline.burn})</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DeltaCard({
  icon: Icon, label, value, delta, color,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; delta: number; color: string }) {
  const positive = delta > 0;
  const neutral = delta === 0;
  const tone = neutral ? "var(--muted-foreground)" : positive ? "oklch(0.78 0.18 160)" : "oklch(0.7 0.22 30)";
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-4"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-40 blur-2xl" style={{ background: color }} />
      <div className="relative flex items-center justify-between">
        <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04]" style={{ color }}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="relative mt-3 flex items-baseline gap-2">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-semibold text-gradient"
        >
          {value}
        </motion.span>
        <span className="text-xs text-muted-foreground">/100</span>
        {!neutral && (
          <motion.span
            key={`d-${value}`}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="ml-auto text-xs font-semibold"
            style={{ color: tone }}
          >
            {positive ? "+" : ""}{delta}
          </motion.span>
        )}
      </div>
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          key={`bar-${value}`}
          initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, var(--neon-purple))`, boxShadow: `0 0 14px ${color}` }}
        />
      </div>
    </motion.div>
  );
}

function CompareChart({ baseline, current }: { baseline: number[]; current: number[] }) {
  const w = 800, h = 220, pad = 14;
  const max = Math.max(...baseline, ...current, 100);
  const stepX = (w - pad * 2) / (baseline.length - 1);
  const toPts = (s: number[]) => s.map((p, i) => [pad + i * stepX, h - pad - (p / max) * (h - pad * 2)] as const);
  const toPath = (pts: readonly (readonly [number, number])[]) =>
    pts.map((c, i) => `${i === 0 ? "M" : "L"}${c[0]},${c[1]}`).join(" ");

  const basePts = toPts(baseline);
  const curPts = toPts(current);
  const linePath = toPath(basePts);
  const curPath = toPath(curPts);
  const area = `${curPath} L${curPts[curPts.length - 1][0]},${h - pad} L${curPts[0][0]},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
      <defs>
        <linearGradient id="wifArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.25 295 / 0.45)" />
          <stop offset="100%" stopColor="oklch(0.68 0.25 295 / 0)" />
        </linearGradient>
        <linearGradient id="wifLine" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.2 245)" />
          <stop offset="100%" stopColor="oklch(0.68 0.25 295)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line key={y} x1={pad} x2={w - pad} y1={pad + y * (h - pad * 2)} y2={pad + y * (h - pad * 2)} stroke="oklch(1 0 0 / 0.04)" />
      ))}

      {/* baseline ghost */}
      <path d={linePath} fill="none" stroke="oklch(1 0 0 / 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* current scenario */}
      <motion.path
        key={`area-${current.join(",")}`}
        d={area} fill="url(#wifArea)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        key={`line-${current.join(",")}`}
        d={curPath} fill="none" stroke="url(#wifLine)" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {curPts.map(([x, y], i) => (
        <motion.circle
          key={`pt-${i}-${current[i]}`}
          cx={x} cy={y} r={2.5} fill="oklch(0.85 0.15 200)"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + i * 0.04 }}
        />
      ))}
    </svg>
  );
}

function Pill({ text, highlight, muted }: { text: string; highlight?: boolean; muted?: boolean }) {
  const color = text === "Bullish" ? "var(--neon-cyan)" : text === "Cautious" ? "var(--neon-blue)" : "oklch(0.7 0.22 30)";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        muted ? "opacity-60" : ""
      } ${highlight ? "shadow-[0_0_18px_-2px_currentColor]" : ""}`}
      style={{ background: `${color}18`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {text}
    </span>
  );
}