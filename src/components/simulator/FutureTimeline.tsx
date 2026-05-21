import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Users, TrendingUp, DollarSign, Globe2, Brain, Sparkles, ArrowUpRight,
} from "lucide-react";
import type { Prediction } from "./Simulator";

type Stage = {
  id: string;
  label: string;
  sub: string;
  t: number; // months from now
  users: number;
  growth: number; // % MoM
  valuation: string;
  expansion: string[];
  prediction: string;
  confidence: number;
};

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + "K";
  return String(Math.round(n));
}

function buildStages(b: Prediction): Stage[] {
  // Drive numbers from baseline scores so it feels connected to the simulation.
  const seed = (b.survival + b.investor + b.viral) / 3 / 100; // 0..1
  const base = 800 + Math.round(seed * 4200); // month 1 users
  const k = 1 + 0.6 + seed * 1.4; // growth multiplier between stages
  const u1 = base;
  const u6 = Math.round(u1 * Math.pow(k, 1.8));
  const u12 = Math.round(u6 * Math.pow(k, 1.6));
  const u36 = Math.round(u12 * Math.pow(k, 2.4));
  const u60 = Math.round(u36 * Math.pow(k, 1.9));

  const valBase = 1.2 + seed * 4; // $M at month 1
  const v1 = `$${valBase.toFixed(1)}M`;
  const v6 = `$${(valBase * 3.4).toFixed(1)}M`;
  const v12 = `$${(valBase * 9).toFixed(1)}M`;
  const v36 = `$${(valBase * 38).toFixed(0)}M`;
  const v60 = seed > 0.7 ? `$${(valBase * 180).toFixed(0)}M+` : `$${(valBase * 110).toFixed(0)}M`;

  return [
    {
      id: "m1", label: "Month 1", sub: "Launch Window", t: 1,
      users: u1, growth: 22 + Math.round(seed * 18), valuation: v1,
      expansion: ["Beta cohort onboarding", "Founder-led sales", "Initial PMF probes"],
      prediction: "Strong narrative attracts early evangelists. Watch activation closely — first 100 power users define your wedge.",
      confidence: 62 + Math.round(seed * 18),
    },
    {
      id: "m6", label: "Month 6", sub: "Traction Curve", t: 6,
      users: u6, growth: 28 + Math.round(seed * 14), valuation: v6,
      expansion: ["Adjacent ICP segment", "Self-serve funnel", "Design-partner case studies"],
      prediction: "Compounding referrals kick in. Hire a growth lead before paid CAC overtakes organic.",
      confidence: 68 + Math.round(seed * 18),
    },
    {
      id: "y1", label: "Year 1", sub: "Scale Mode", t: 12,
      users: u12, growth: 18 + Math.round(seed * 10), valuation: v12,
      expansion: ["Seed → Series A", "API platform layer", "Mid-market motion"],
      prediction: "Category narrative crystallizes. A breakout competitor will emerge — out-execute on retention, not features.",
      confidence: 71 + Math.round(seed * 16),
    },
    {
      id: "y3", label: "Year 3", sub: "Category Capture", t: 36,
      users: u36, growth: 9 + Math.round(seed * 8), valuation: v36,
      expansion: ["EU + APAC expansion", "Enterprise tier", "Acquisitions of tooling"],
      prediction: "Platform pull becomes the moat. Margin expansion through AI ops compounds enterprise ACVs.",
      confidence: 74 + Math.round(seed * 14),
    },
    {
      id: "y5", label: "Year 5", sub: "Horizon Bet", t: 60,
      users: u60, growth: 5 + Math.round(seed * 6), valuation: v60,
      expansion: ["IPO readiness", "Verticalized AI agents", "Developer ecosystem"],
      prediction: seed > 0.7
        ? "Unicorn trajectory locked. Defensibility comes from data flywheel + distribution depth."
        : "Durable mid-cap path. Optimize for cash-efficient growth and strategic optionality.",
      confidence: 76 + Math.round(seed * 14),
    },
  ];
}

export function FutureTimeline({ baseline }: { baseline: Prediction }) {
  const stages = useMemo(() => buildStages(baseline), [baseline]);
  const [active, setActive] = useState<string>(stages[0].id);
  const current = stages.find((s) => s.id === active) ?? stages[0];

  return (
    <div className="mt-16 relative">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full blur-[160px] opacity-40 animate-aurora"
        style={{ background: "radial-gradient(circle, var(--neon-blue), transparent 65%)" }} />

      <div className="relative flex items-end justify-between gap-2 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--neon-cyan)]/80">
            <Sparkles className="h-3.5 w-3.5" /> Future Timeline
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-gradient mt-2">
            Projected Startup Trajectory
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            NOVA forecasts your venture across five horizons. Tap any stage to unfold projected users, growth, valuation, and AI predictions.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-[var(--neon-purple)] animate-pulse-glow" />
          Simulation feed live
        </div>
      </div>

      {/* Rail */}
      <div className="relative glass-strong rounded-3xl p-6 md:p-8 overflow-hidden">
        <div className="absolute inset-x-8 top-[88px] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute inset-x-8 top-[88px] h-px bg-gradient-to-r from-[var(--neon-purple)]/0 via-[var(--neon-purple)]/60 to-[var(--neon-blue)]/0 blur-sm" />

        <div className="relative grid grid-cols-5 gap-3 md:gap-6">
          {stages.map((s, i) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className="group relative flex flex-col items-center text-center focus:outline-none"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  {s.label}
                </div>
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="timeline-active-ring"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "conic-gradient(from 0deg, var(--neon-purple), var(--neon-blue), var(--neon-cyan), var(--neon-purple))",
                          filter: "blur(10px)",
                          opacity: 0.85,
                        }}
                        transition={{ type: "spring", stiffness: 220, damping: 24 }}
                      />
                    )}
                  </AnimatePresence>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
                    className={`relative h-5 w-5 rounded-full border ${
                      isActive
                        ? "bg-white border-white shadow-glow-purple"
                        : "bg-white/10 border-white/30 group-hover:bg-white/30"
                    } transition-colors`}
                  />
                </div>
                <div className={`mt-3 font-display text-sm md:text-base font-semibold transition-colors ${
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-white/80"
                }`}>
                  {s.sub}
                </div>
                <div className="text-[11px] text-muted-foreground/70 mt-1">
                  {fmt(s.users)} users
                </div>
              </button>
            );
          })}
        </div>

        {/* Stage detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative mt-10 grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <MetricCard
              icon={Users}
              label="Projected Users"
              value={fmt(current.users)}
              accent="var(--neon-cyan)"
              chart={<UserBars seed={current.users} />}
            />
            <MetricCard
              icon={TrendingUp}
              label="Startup Growth"
              value={`+${current.growth}% MoM`}
              accent="var(--neon-purple)"
              chart={<GrowthLine intensity={current.growth} />}
            />
            <MetricCard
              icon={DollarSign}
              label="Valuation"
              value={current.valuation}
              accent="var(--neon-blue)"
              chart={<ValuationGauge confidence={current.confidence} />}
            />

            <div className="lg:col-span-2 relative rounded-2xl glass p-5 overflow-hidden glow-ring">
              <div className="flex items-center gap-2 mb-4">
                <Globe2 className="h-4 w-4 text-[var(--neon-cyan)]" />
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Expansion Opportunities</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {current.expansion.map((e, i) => (
                  <motion.div
                    key={e}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="relative rounded-xl border border-white/10 bg-white/[0.03] p-3 hover-lift"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--neon-purple)] absolute top-3 right-3" />
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Vector {i + 1}</div>
                    <div className="mt-1 text-sm font-medium text-white/90">{e}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl p-5 overflow-hidden glass-strong glow-ring">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[var(--neon-purple)]" />
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">NOVA Prediction</div>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">{current.prediction}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    key={current.id + "-conf"}
                    initial={{ width: 0 }}
                    animate={{ width: `${current.confidence}%` }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "linear-gradient(90deg, var(--neon-purple), var(--neon-blue))" }}
                  />
                </div>
                <div className="text-xs font-display text-white/80 tabular-nums">{current.confidence}%</div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Model confidence</div>
              <Rocket className="absolute -bottom-4 -right-4 h-24 w-24 text-white/[0.03]" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, accent, chart,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; accent: string; chart: React.ReactNode;
}) {
  return (
    <div className="relative rounded-2xl glass p-5 overflow-hidden hover-lift glow-ring">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: accent }} />
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        </div>
      </div>
      <div className="font-display text-3xl font-semibold text-gradient mt-3">{value}</div>
      <div className="mt-4 h-14">{chart}</div>
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-40"
        style={{ background: accent }} />
    </div>
  );
}

function UserBars({ seed }: { seed: number }) {
  const bars = Array.from({ length: 14 }, (_, i) => {
    const t = (i + 1) / 14;
    const h = 20 + Math.round(80 * Math.pow(t, 1.3) * (0.7 + ((seed + i) % 7) / 14));
    return Math.min(100, h);
  });
  return (
    <div className="flex items-end gap-1 h-full">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: `${h}%`, opacity: 1 }}
          transition={{ delay: i * 0.03, duration: 0.5, ease: "easeOut" }}
          className="flex-1 rounded-sm"
          style={{
            background: "linear-gradient(180deg, var(--neon-cyan), var(--neon-blue))",
            boxShadow: "0 0 8px oklch(0.85 0.15 200 / 0.5)",
          }}
        />
      ))}
    </div>
  );
}

function GrowthLine({ intensity }: { intensity: number }) {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const x = (i / 23) * 100;
    const wobble = Math.sin(i * 0.7 + intensity) * 4;
    const y = 50 - (i / 23) * (10 + intensity * 1.2) + wobble;
    return `${x},${Math.max(4, Math.min(56, y))}`;
  });
  const d = `M${pts.join(" L")}`;
  return (
    <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.7 0.22 280)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.7 0.22 280)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${d} L100,60 L0,60 Z`} fill="url(#gl)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
      <motion.path d={d} fill="none" stroke="oklch(0.75 0.22 290)" strokeWidth="1.4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: "easeInOut" }} />
    </svg>
  );
}

function ValuationGauge({ confidence }: { confidence: number }) {
  const pct = Math.min(100, confidence);
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="flex items-center gap-3 h-full">
      <svg viewBox="0 0 60 60" className="h-full w-14">
        <circle cx="30" cy="30" r={r} fill="none" stroke="oklch(1 0 0 / 0.1)" strokeWidth="4" />
        <motion.circle
          cx="30" cy="30" r={r} fill="none"
          stroke="oklch(0.72 0.2 245)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 30 30)"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${dash} ${c}` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px oklch(0.72 0.2 245 / 0.7))" }}
        />
      </svg>
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Investor signal</div>
        <div className="font-display text-lg text-white/90 tabular-nums">{pct}%</div>
      </div>
    </div>
  );
}