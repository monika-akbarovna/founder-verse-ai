import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket, Brain, Sparkles, TrendingUp, ShieldAlert, Users, Flame, Activity,
  DollarSign, Target, ArrowRight, Loader2, Cpu, Zap, MessageSquare, LineChart,
} from "lucide-react";
import { WhatIfEngine } from "./WhatIfEngine";
import { FutureTimeline } from "./FutureTimeline";

type FormState = {
  idea: string;
  audience: string;
  pricing: string;
  businessType: string;
};

export type Prediction = {
  survival: number;
  investor: number;
  viral: number;
  sentiment: number;
  marketSize: string;
  burn: string;
  runway: string;
  arr: string;
  competitors: { name: string; share: number; threat: "Low" | "Medium" | "High" }[];
  growth: number[];
  sentimentSeries: number[];
  insights: string[];
  verdict: "Bullish" | "Cautious" | "High Risk";
};

const PRICING_OPTIONS = ["Freemium", "Subscription", "Usage-based", "One-time", "Marketplace"];
const BUSINESS_TYPES = ["B2B SaaS", "B2C App", "Marketplace", "AI / ML", "Fintech", "DevTool", "Hardware"];

export function Simulator() {
  const [form, setForm] = useState<FormState>({ idea: "", audience: "", pricing: "Subscription", businessType: "B2B SaaS" });
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<Prediction | null>(null);

  const canSubmit = form.idea.trim().length > 3 && form.audience.trim().length > 2;

  async function runSimulation() {
    if (!canSubmit) return;
    setPhase("loading");
    setResult(null);
    await new Promise((r) => setTimeout(r, 2400));
    setResult(simulate(form));
    setPhase("done");
    requestAnimationFrame(() => {
      document.getElementById("sim-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <section className="relative pt-36">
      {/* Aurora */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[140px] opacity-50 animate-aurora"
        style={{ background: "radial-gradient(circle, var(--neon-purple), transparent 60%)" }} />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="h-1 w-1 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" />
            Live Simulator · v3.2
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-6xl"
          >
            <span className="text-gradient">Run your startup through</span>{" "}
            <span className="text-gradient-brand">a simulated reality</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            Six AI agents will model 18 months of growth, investor reactions, competitors, and risks — before you spend a dollar.
          </motion.p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-strong glow-ring reflective relative mt-12 overflow-hidden rounded-3xl p-2 shadow-elegant"
        >
          <div className="rounded-[1.25rem] bg-[oklch(0.1_0.02_270)] p-6 md:p-8">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 text-xs text-muted-foreground">
              <Cpu className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
              founderverse.app / new-simulation
              <span className="ml-auto flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_currentColor]" />
                Agents online
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Startup Idea" hint="One sentence">
                <textarea
                  rows={3}
                  placeholder="An AI that simulates your startup before you build it."
                  value={form.idea}
                  onChange={(e) => setForm({ ...form, idea: e.target.value })}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-[var(--neon-purple)] focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_oklch(0.7_0.22_280_/_0.12)]"
                />
              </Field>
              <Field label="Target Audience" hint="Who pays?">
                <input
                  placeholder="Pre-seed and seed-stage founders"
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-[var(--neon-purple)] focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_oklch(0.7_0.22_280_/_0.12)]"
                />
              </Field>
              <Field label="Pricing Model">
                <Select value={form.pricing} options={PRICING_OPTIONS} onChange={(v) => setForm({ ...form, pricing: v })} />
              </Field>
              <Field label="Business Type">
                <Select value={form.businessType} options={BUSINESS_TYPES} onChange={(v) => setForm({ ...form, businessType: v })} />
              </Field>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
                6 agents will simulate ~18 months in 2 seconds
              </div>
              <button
                onClick={runSimulation}
                disabled={!canSubmit || phase === "loading"}
                className="shimmer-btn group relative inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-purple transition-all duration-500 hover:scale-[1.04] hover:shadow-[0_0_80px_-10px_var(--neon-purple)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {phase === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                  {phase === "loading" ? "Simulating…" : "Run AI Simulation"}
                  {phase !== "loading" && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence>
          {phase === "loading" && <LoadingPanel />}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {phase === "done" && result && <ResultDashboard result={result} form={form} />}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground/60">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-[var(--neon-purple)] focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_oklch(0.7_0.22_280_/_0.12)]"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[oklch(0.1_0.02_270)]">{o}</option>
        ))}
      </select>
      <ArrowRight className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-muted-foreground" />
    </div>
  );
}

function LoadingPanel() {
  const steps = [
    { icon: Brain, label: "Investor agent modeling reactions…" },
    { icon: Users, label: "Customer agent simulating adoption curves…" },
    { icon: ShieldAlert, label: "Risk agent stress-testing failure patterns…" },
    { icon: LineChart, label: "Growth agent forecasting MRR & viral coefficients…" },
    { icon: MessageSquare, label: "PR agent predicting sentiment & narrative…" },
    { icon: Sparkles, label: "Synthesizing 18-month forecast…" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="glass-strong glow-ring reflective relative mt-10 overflow-hidden rounded-3xl p-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent animate-[scan-line_2.5s_linear_infinite]" />
      </div>
      <div className="relative grid gap-3 md:grid-cols-2">
        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.18 }}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
          >
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow-purple">
              <s.icon className="h-4 w-4" />
            </div>
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-[var(--neon-cyan)]" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ResultDashboard({ result, form }: { result: Prediction; form: FormState }) {
  return (
    <motion.div
      id="sim-result"
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12 space-y-5"
    >
      {/* Header bar */}
      <div className="glass-strong glow-ring reflective relative overflow-hidden rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Simulation Complete</div>
            <div className="mt-1 font-display text-xl font-semibold">{form.idea.slice(0, 80)}{form.idea.length > 80 ? "…" : ""}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {form.businessType} · {form.pricing} · targeting {form.audience}
            </div>
          </div>
          <Verdict value={result.verdict} />
        </div>
      </div>

      {/* Score row */}
      <div className="grid gap-5 md:grid-cols-4">
        <ScoreCard icon={ShieldAlert} label="Survival Score" value={result.survival} color="var(--neon-cyan)" />
        <ScoreCard icon={DollarSign} label="Investor Confidence" value={result.investor} color="var(--neon-purple)" />
        <ScoreCard icon={Flame} label="Viral Potential" value={result.viral} color="oklch(0.7 0.22 30)" />
        <ScoreCard icon={MessageSquare} label="Customer Sentiment" value={result.sentiment} color="var(--neon-blue)" />
      </div>

      {/* Main grid */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="md:col-span-2 glass-strong glow-ring reflective hover-lift relative overflow-hidden rounded-3xl p-6">
          <Header icon={TrendingUp} title="Market Opportunity" hint="18-month projection" />
          <BigChart series={result.growth} />
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
            <Mini label="TAM" value={result.marketSize} accent="var(--neon-purple)" />
            <Mini label="Projected ARR" value={result.arr} accent="var(--neon-cyan)" />
            <Mini label="Runway" value={result.runway} accent="var(--neon-blue)" />
          </div>
        </div>
        <div className="glass-strong glow-ring reflective hover-lift relative overflow-hidden rounded-3xl p-6">
          <Header icon={Activity} title="Burn Rate" hint="Monthly" />
          <div className="mt-6 text-center">
            <div className="font-display text-4xl font-semibold text-gradient">{result.burn}</div>
            <div className="mt-1 text-xs text-muted-foreground">avg over 12 months</div>
          </div>
          <BurnBars />
          <div className="mt-4 border-t border-white/5 pt-4">
            <div className="text-xs text-muted-foreground">Capital efficiency</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${result.investor}%` }} transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-primary shadow-glow-purple"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="glass-strong glow-ring reflective hover-lift relative overflow-hidden rounded-3xl p-6 md:col-span-2">
          <Header icon={Target} title="Competitor Analysis" hint={`${result.competitors.length} key players`} />
          <div className="mt-5 space-y-3">
            {result.competitors.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                className="grid grid-cols-[120px_1fr_70px] items-center gap-4 text-sm"
              >
                <span className="font-medium">{c.name}</span>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${c.share}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: c.threat === "High" ? "linear-gradient(90deg, oklch(0.7 0.22 30), oklch(0.68 0.25 295))" : "var(--gradient-primary)" }}
                  />
                </div>
                <ThreatPill v={c.threat} />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="glass-strong glow-ring reflective hover-lift relative overflow-hidden rounded-3xl p-6">
          <Header icon={MessageSquare} title="Sentiment Pulse" hint="Last 30 days sim" />
          <SentimentChart series={result.sentimentSeries} />
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Net positive</span>
            <span className="font-display text-lg font-semibold text-[var(--neon-cyan)]">+{result.sentiment - 50}%</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass-strong glow-ring reflective relative overflow-hidden rounded-3xl p-7">
        <Header icon={Brain} title="AI-Generated Insights" hint="Strategy agent · synthesized" />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {result.insights.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
              className="group relative flex gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-[var(--neon-purple)]/30 hover:bg-white/[0.04]"
            >
              <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow-purple">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* What-If Scenario Engine */}
      <WhatIfEngine baseline={result} />

      {/* Future Timeline */}
      <FutureTimeline baseline={result} />
    </motion.div>
  );
}

function Header({ icon: Icon, title, hint }: { icon: React.ComponentType<{ className?: string }>; title: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[var(--neon-purple)]" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      {hint && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{hint}</span>}
    </div>
  );
}

function ScoreCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="glass-strong glow-ring reflective hover-lift relative overflow-hidden rounded-3xl p-5"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-50 blur-2xl" style={{ background: color }} />
      <div className="relative flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04]" style={{ color }}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="relative mt-5 flex items-baseline gap-1">
        <CountUp to={value} />
        <span className="text-sm text-muted-foreground">/100</span>
      </div>
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, var(--neon-purple))`, boxShadow: `0 0 16px ${color}` }}
        />
      </div>
    </motion.div>
  );
}

function CountUp({ to }: { to: number }) {
  return (
    <motion.span
      className="font-display text-4xl font-semibold text-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ count: 0 } as any}
        animate={{ count: to } as any}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        {to}
      </motion.span>
    </motion.span>
  );
}

function Verdict({ value }: { value: Prediction["verdict"] }) {
  const map = {
    Bullish: { color: "var(--neon-cyan)", label: "Bullish" },
    Cautious: { color: "var(--neon-blue)", label: "Cautious" },
    "High Risk": { color: "oklch(0.7 0.22 30)", label: "High Risk" },
  } as const;
  const v = map[value];
  return (
    <div className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs" style={{ color: v.color }}>
      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: v.color, boxShadow: `0 0 10px ${v.color}` }} />
      Verdict: <span className="font-semibold">{v.label}</span>
    </div>
  );
}

function ThreatPill({ v }: { v: "Low" | "Medium" | "High" }) {
  const c = v === "High" ? "oklch(0.7 0.22 30)" : v === "Medium" ? "var(--neon-blue)" : "var(--neon-cyan)";
  return (
    <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${c}20`, color: c }}>{v}</span>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-semibold" style={{ color: accent }}>{value}</div>
    </div>
  );
}

function BigChart({ series }: { series: number[] }) {
  const w = 800, h = 200, pad = 12;
  const max = Math.max(...series, 100);
  const stepX = (w - pad * 2) / (series.length - 1);
  const pts = series.map((p, i) => [pad + i * stepX, h - pad - (p / max) * (h - pad * 2)] as const);
  const line = pts.map((c, i) => `${i === 0 ? "M" : "L"}${c[0]},${c[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-5 w-full">
      <defs>
        <linearGradient id="bgArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.25 295 / 0.4)" />
          <stop offset="100%" stopColor="oklch(0.68 0.25 295 / 0)" />
        </linearGradient>
        <linearGradient id="bgLine" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.2 245)" />
          <stop offset="100%" stopColor="oklch(0.68 0.25 295)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line key={y} x1={pad} x2={w - pad} y1={pad + y * (h - pad * 2)} y2={pad + y * (h - pad * 2)} stroke="oklch(1 0 0 / 0.04)" />
      ))}
      <motion.path d={area} fill="url(#bgArea)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} />
      <motion.path d={line} fill="none" stroke="url(#bgLine)" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, ease: "easeOut" }}
      />
      {pts.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={3} fill="oklch(0.85 0.15 200)"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 + i * 0.06 }}
        />
      ))}
    </svg>
  );
}

function SentimentChart({ series }: { series: number[] }) {
  const w = 300, h = 120, pad = 8;
  const stepX = (w - pad * 2) / (series.length - 1);
  const pts = series.map((p, i) => [pad + i * stepX, h - pad - (p / 100) * (h - pad * 2)] as const);
  const line = pts.map((c, i) => `${i === 0 ? "M" : "L"}${c[0]},${c[1]}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
      <motion.path d={line} fill="none" stroke="var(--neon-cyan)" strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }}
      />
    </svg>
  );
}

function BurnBars() {
  const bars = useMemo(() => Array.from({ length: 12 }, (_, i) => 30 + ((i * 11) % 60)), []);
  return (
    <div className="mt-5 flex h-20 items-end gap-1.5">
      {bars.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0 }} animate={{ height: `${v}%`, opacity: 1 }} transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
          className="flex-1 rounded-sm bg-gradient-to-t from-[var(--neon-purple)]/30 to-[var(--neon-blue)]"
        />
      ))}
    </div>
  );
}

// ----------------- Simulation logic -----------------
function simulate(form: FormState): Prediction {
  // Deterministic hashing of inputs for stable, "realistic" results
  const seed = hash(form.idea + form.audience + form.pricing + form.businessType);
  const rand = mulberry32(seed);
  const r = (min: number, max: number) => Math.floor(min + rand() * (max - min));

  const ideaLen = Math.min(form.idea.length, 200);
  const base = 50 + Math.floor((ideaLen / 200) * 20);

  const survival = clamp(base + r(-8, 22) + bonus(form.businessType, ["B2B SaaS", "AI / ML", "DevTool"], 6), 32, 96);
  const investor = clamp(base + r(-10, 25) + bonus(form.pricing, ["Subscription", "Usage-based"], 8), 28, 97);
  const viral = clamp(40 + r(0, 50) + bonus(form.businessType, ["B2C App", "Marketplace"], 12), 18, 95);
  const sentiment = clamp(58 + r(-10, 30), 38, 94);

  const verdict: Prediction["verdict"] =
    survival > 75 && investor > 70 ? "Bullish" : survival > 55 ? "Cautious" : "High Risk";

  const growth: number[] = [];
  let g = 5 + r(0, 8);
  const mult = 1 + (investor / 100) * 0.18 + (viral / 100) * 0.1;
  for (let i = 0; i < 18; i++) {
    g = g * mult + r(-2, 4);
    growth.push(Math.max(2, Math.round(g)));
  }

  const sentimentSeries = Array.from({ length: 30 }, (_, i) =>
    clamp(sentiment + Math.round(Math.sin(i / 2) * 10 + rand() * 8 - 4), 20, 100)
  );

  const competitorPool = [
    "Northlight AI", "Vaultline", "Cortex.io", "Apex Labs", "Strato", "Nimbus", "Forge",
    "Helios", "Mercury", "Quanta", "Pulsar", "Beacon",
  ];
  const competitors = pick(competitorPool, 4, rand).map((name, i) => ({
    name,
    share: clamp(50 - i * 9 + r(-6, 6), 12, 60),
    threat: ((i === 0 ? "High" : i === 1 ? "Medium" : "Low") as "Low" | "Medium" | "High"),
  }));

  const arrM = Math.round(growth[growth.length - 1] * (investor / 100) * 0.04 * 100) / 100;
  const burnK = 30 + r(0, 60);
  const runwayMo = clamp(Math.round((investor / 100) * 28), 8, 30);

  const insights = generateInsights(form, { survival, investor, viral, sentiment, verdict });

  return {
    survival, investor, viral, sentiment, verdict,
    marketSize: `$${(8 + r(0, 40))}B`,
    burn: `$${burnK}k/mo`,
    runway: `${runwayMo} months`,
    arr: `$${arrM}M`,
    competitors, growth, sentimentSeries, insights,
  };
}

function generateInsights(form: FormState, s: { survival: number; investor: number; viral: number; sentiment: number; verdict: string }): string[] {
  const out: string[] = [];
  if (s.investor > 75) out.push(`Investor agent rates this ${s.verdict.toLowerCase()} — your ${form.pricing.toLowerCase()} model resonates with current ${form.businessType} thesis at top-decile VCs.`);
  else out.push(`Investor pushback predicted: tighten the wedge for ${form.audience}. Consider a usage-based tier to lower CAC payback.`);

  if (s.viral > 70) out.push(`Viral potential is high — build in product-led referral hooks within the first 14-day activation window to compound growth.`);
  else out.push(`Viral coefficient is modest. Lean on content + community before paid acquisition to keep CAC under $${50 + (form.businessType === "B2C App" ? 30 : 80)}.`);

  if (s.survival > 70) out.push(`Risk profile is favorable. Stress test against a 25% MRR shock and validate runway covers 18 months at current burn.`);
  else out.push(`Survival risk elevated. Cut non-essential burn early and concentrate on 1 ICP — multi-segment GTM will kill momentum.`);

  out.push(`Pricing test: A/B a 40% higher anchor for "${form.businessType}" — sentiment data shows ${form.audience} are 22% less price-sensitive than baseline.`);

  if (s.sentiment > 75) out.push(`Narrative is strong — launch on Product Hunt + a long-form essay; PR agent forecasts 3x baseline pickup.`);
  else out.push(`Narrative needs sharpening. Reframe the idea around a measurable "before/after" outcome to lift sentiment by ~18 points.`);

  out.push(`Strategy agent suggests a 2-week investor sim before raising — current confidence band is ${s.investor - 8}–${s.investor + 8}%.`);
  return out;
}

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a: number) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function bonus(v: string, list: string[], amt: number) { return list.includes(v) ? amt : 0; }
function pick<T>(arr: T[], n: number, rand: () => number): T[] { const a = [...arr]; const out: T[] = []; for (let i = 0; i < n && a.length; i++) { out.push(a.splice(Math.floor(rand() * a.length), 1)[0]); } return out; }