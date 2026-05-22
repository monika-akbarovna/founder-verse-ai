import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UIMessage } from "ai";
import { Activity, Flame, ShieldAlert, Target, TrendingUp, Wallet } from "lucide-react";

/** Lightweight deterministic hash so widgets feel "live" but stable per conversation. */
function hash(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Scores = {
  conviction: number;
  risk: number;
  marketTiming: number;
  viral: number;
  valuation: { low: number; high: number; label: string };
  burn: number;
  signals: { label: string; tone: "pos" | "neg" | "neu" }[];
};

function deriveScores(messages: UIMessage[], threadId: string): Scores {
  const text = messages
    .map((m) => m.parts.map((p) => (p.type === "text" ? p.text : "")).join(" "))
    .join(" ")
    .toLowerCase();

  const h = hash(threadId + text.slice(0, 800));
  const base = (offset: number, min = 30, max = 92) => {
    const v = ((h >> offset) & 0xff) / 255;
    return Math.round(min + v * (max - min));
  };

  let conviction = base(0);
  let risk = base(8);
  let marketTiming = base(16);
  let viral = base(24);

  // simple signal boosts
  const bumps: [RegExp, Partial<Scores>][] = [
    [/\b(ai|llm|agent|gpt|gemini)\b/, { marketTiming: marketTiming + 6, viral: viral + 4 }],
    [/\b(mrr|arr|revenue|paying)\b/, { conviction: conviction + 8, risk: risk - 6 }],
    [/\b(growth|growing|mom|wow)\b/, { conviction: conviction + 5, viral: viral + 6 }],
    [/\b(competitive|crowded|saturated)\b/, { risk: risk + 8, conviction: conviction - 4 }],
    [/\b(moat|defensib|differenti)\b/, { conviction: conviction + 6 }],
    [/\b(cac|burn|runway|losing)\b/, { risk: risk + 6 }],
    [/\b(enterprise|fortune|b2b)\b/, { conviction: conviction + 4, risk: risk - 3 }],
    [/\b(consumer|viral|social)\b/, { viral: viral + 8, risk: risk + 3 }],
  ];
  for (const [re, patch] of bumps) {
    if (re.test(text)) {
      if (patch.conviction !== undefined) conviction = patch.conviction;
      if (patch.risk !== undefined) risk = patch.risk;
      if (patch.marketTiming !== undefined) marketTiming = patch.marketTiming;
      if (patch.viral !== undefined) viral = patch.viral;
    }
  }

  const clamp = (n: number) => Math.max(8, Math.min(98, n));
  conviction = clamp(conviction);
  risk = clamp(risk);
  marketTiming = clamp(marketTiming);
  viral = clamp(viral);

  // Valuation read
  let label = "Pre-seed";
  let low = 3,
    high = 7;
  if (/seed|\bmrr|paying customer|launched/.test(text)) {
    label = "Seed";
    low = 8;
    high = 15;
  }
  if (/series a|\$\d+m\s*arr|product market fit|pmf/.test(text)) {
    label = "Series A";
    low = 25;
    high = 80;
  }
  if (/series b|scale|enterprise traction/.test(text)) {
    label = "Series B";
    low = 80;
    high = 250;
  }
  // nudge by conviction
  const conv = conviction / 100;
  low = Math.round(low * (0.7 + conv * 0.6));
  high = Math.round(high * (0.7 + conv * 0.7));

  const burn = clamp(40 + ((h >> 4) & 0x3f));

  const signals: Scores["signals"] = [];
  if (conviction >= 70) signals.push({ label: "Сильный founder–market fit", tone: "pos" });
  if (marketTiming >= 70) signals.push({ label: "Отличный тайминг рынка", tone: "pos" });
  if (viral >= 75) signals.push({ label: "Апсайд уровня единорога", tone: "pos" });
  if (risk >= 70) signals.push({ label: "Давление по CAC / burn", tone: "neg" });
  if (conviction < 45) signals.push({ label: "Слабая дифференциация", tone: "neg" });
  if (signals.length === 0) signals.push({ label: "Нужно больше диалога", tone: "neu" });

  return { conviction, risk, marketTiming, viral, valuation: { low, high, label }, burn, signals };
}

export function InvestorAnalytics({
  messages,
  threadId,
  isThinking,
}: {
  messages: UIMessage[];
  threadId: string;
  isThinking: boolean;
}) {
  const targets = useMemo(() => deriveScores(messages, threadId), [messages, threadId]);
  const hasContent = messages.length > 0;

  return (
    <aside className="hidden h-full w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/5 bg-background/40 px-4 py-5 backdrop-blur-xl xl:flex">
      <Header isThinking={isThinking} />

      <div className="grid grid-cols-2 gap-3">
        <ScoreTile
          label="Conviction"
          value={hasContent ? targets.conviction : 0}
          icon={Flame}
          color="var(--neon-purple)"
        />
        <ScoreTile
          label="Market Timing"
          value={hasContent ? targets.marketTiming : 0}
          icon={Target}
          color="var(--neon-cyan)"
        />
        <ScoreTile
          label="Viral Potential"
          value={hasContent ? targets.viral : 0}
          icon={TrendingUp}
          color="var(--neon-blue)"
        />
        <ScoreTile
          label="Risk Index"
          value={hasContent ? targets.risk : 0}
          icon={ShieldAlert}
          color="oklch(0.7 0.22 25)"
          invert
        />
      </div>

      <ValuationCard data={targets.valuation} active={hasContent} />

      <BurnCard value={hasContent ? targets.burn : 0} />

      <SignalsCard signals={hasContent ? targets.signals : [{ label: "Send a pitch to begin", tone: "neu" }]} />

      <Pulse isThinking={isThinking} />
    </aside>
  );
}

function Header({ isThinking }: { isThinking: boolean }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        Deal Terminal
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isThinking ? "bg-[color:var(--neon-cyan)]" : "bg-emerald-400"
          }`}
          style={{ boxShadow: "0 0 8px currentColor" }}
        />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {isThinking ? "Analyzing" : "Live"}
        </span>
      </div>
    </div>
  );
}

function ScoreTile({
  label,
  value,
  icon: Icon,
  color,
  invert = false,
}: {
  label: string;
  value: number;
  icon: typeof Flame;
  color: string;
  invert?: boolean;
}) {
  const display = useAnimatedNumber(value);
  const pct = Math.max(0, Math.min(100, value));
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="glass reflective relative overflow-hidden rounded-2xl p-3"
    >
      <div
        className="absolute inset-0 opacity-30 blur-2xl"
        style={{ background: `radial-gradient(circle at 30% 0%, ${color}, transparent 60%)` }}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <div className="relative mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight">
        {display}
        <span className="ml-0.5 text-xs text-muted-foreground">/100</span>
      </div>
      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="h-full rounded-full"
          style={{
            background: invert
              ? `linear-gradient(90deg, oklch(0.7 0.2 25), oklch(0.65 0.25 350))`
              : `linear-gradient(90deg, ${color}, var(--neon-blue))`,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
    </motion.div>
  );
}

function ValuationCard({
  data,
  active,
}: {
  data: { low: number; high: number; label: string };
  active: boolean;
}) {
  const low = useAnimatedNumber(active ? data.low : 0);
  const high = useAnimatedNumber(active ? data.high : 0);
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass reflective relative overflow-hidden rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Valuation Read
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
          {data.label}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-2xl font-semibold tracking-tight text-gradient">
          ${low}M
        </span>
        <span className="text-sm text-muted-foreground">–</span>
        <span className="font-display text-2xl font-semibold tracking-tight text-gradient">
          ${high}M
        </span>
      </div>
      <div className="mt-3 flex h-8 items-end gap-0.5">
        {Array.from({ length: 28 }).map((_, i) => {
          const h =
            10 +
            Math.abs(
              Math.sin((i + hash(data.label) % 7) * 0.5) * 28 +
                Math.cos(i * 0.3) * 14
            );
          return (
            <motion.span
              key={i}
              initial={{ height: 2 }}
              animate={{ height: active ? h : 2 }}
              transition={{ duration: 0.8, delay: i * 0.02, ease: "easeOut" }}
              className="flex-1 rounded-sm"
              style={{
                background:
                  "linear-gradient(180deg, var(--neon-purple), var(--neon-blue))",
                opacity: 0.6 + (i % 4) * 0.1,
              }}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
        <span>Q1</span>
        <span>Q4 fwd</span>
      </div>
    </motion.div>
  );
}

function BurnCard({ value }: { value: number }) {
  const display = useAnimatedNumber(value);
  return (
    <motion.div whileHover={{ y: -2 }} className="glass reflective relative overflow-hidden rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Burn Pressure</span>
        <Wallet className="h-3.5 w-3.5 text-[color:var(--neon-cyan)]" />
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="font-display text-xl font-semibold tracking-tight tabular-nums">
            {display}%
          </div>
          <div className="text-[10px] text-muted-foreground">of comfort zone</div>
        </div>
        <RingGauge value={value} />
      </div>
    </motion.div>
  );
}

function RingGauge({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  return (
    <svg width={48} height={48} viewBox="0 0 48 48" className="drop-shadow-[0_0_6px_var(--neon-purple)]">
      <circle cx={24} cy={24} r={r} fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth={4} />
      <motion.circle
        cx={24}
        cy={24}
        r={r}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (pct / 100) * c }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        transform="rotate(-90 24 24)"
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" x2="1">
          <stop offset="0" stopColor="var(--neon-purple)" />
          <stop offset="1" stopColor="var(--neon-cyan)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SignalsCard({ signals }: { signals: { label: string; tone: "pos" | "neg" | "neu" }[] }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass reflective relative overflow-hidden rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          AI Signals
        </span>
        <Activity className="h-3.5 w-3.5 text-[color:var(--neon-blue)]" />
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {signals.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2 text-xs text-foreground/90"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background:
                    s.tone === "pos"
                      ? "var(--neon-cyan)"
                      : s.tone === "neg"
                      ? "oklch(0.7 0.25 25)"
                      : "oklch(0.6 0.02 270)",
                  boxShadow:
                    s.tone === "neu"
                      ? "none"
                      : `0 0 8px ${
                          s.tone === "pos"
                            ? "var(--neon-cyan)"
                            : "oklch(0.7 0.25 25)"
                        }`,
                }}
              />
              {s.label}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}

function Pulse({ isThinking }: { isThinking: boolean }) {
  return (
    <div className="mt-auto pt-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70">
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ opacity: isThinking ? [0.3, 1, 0.3] : 0.6 }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="font-display text-[10px] tracking-[0.2em]"
        >
          NOVA-VC · v3.1
        </motion.span>
      </div>
    </div>
  );
}

function useAnimatedNumber(target: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = n;
    const duration = 900;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return n;
}