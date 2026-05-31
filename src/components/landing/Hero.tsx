import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Sparkles, Activity, DollarSign } from "lucide-react";
import { Link } from "@tanstack/react-router";

const particles = Array.from({ length: 28 });

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-44 pb-40">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[720px] w-[720px] -translate-x-1/2 rounded-full blur-[140px] opacity-60 animate-aurora"
          style={{ background: "radial-gradient(circle at 30% 30%, var(--neon-purple), transparent 60%)" }}
        />
        <div
          className="absolute top-40 -right-40 h-[520px] w-[520px] rounded-full blur-[140px] opacity-50 animate-aurora"
          style={{ background: "radial-gradient(circle at 50% 50%, var(--neon-blue), transparent 60%)", animationDelay: "-6s" }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-[520px] w-[520px] rounded-full blur-[140px] opacity-40 animate-aurora"
          style={{ background: "radial-gradient(circle at 50% 50%, var(--neon-cyan), transparent 60%)", animationDelay: "-12s" }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 noise opacity-40" />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 53) % 100;
          const size = 2 + (i % 4);
          const delay = (i % 7) * 0.4;
          return (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                background: i % 2 ? "var(--neon-blue)" : "var(--neon-purple)",
                boxShadow: `0 0 ${size * 4}px ${i % 2 ? "var(--neon-blue)" : "var(--neon-purple)"}`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.9, 0.2],
              }}
              transition={{ duration: 6 + (i % 5), repeat: Infinity, delay, ease: "easeInOut" }}
            />
          );
        })}
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.a
          href="#"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]" />
          Закрытая бета · инвестиции Series A
          <ArrowRight className="h-3 w-3" />
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-[5.5rem]"
        >
          <span className="text-gradient animate-shimmer-text">Симулируйте свой стартап</span>
          <br />
          <span className="text-gradient-brand">до того, как рискнёте деньгами</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          FounderVerse использует ИИ-агентов, чтобы предсказать рост стартапа,
          реакции инвесторов, риски и рыночные возможности — в кинематографичной симулированной реальности.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/simulator"
            className="shimmer-btn group relative inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-purple transition-all duration-500 hover:scale-[1.04] hover:shadow-[0_0_80px_-10px_var(--neon-purple)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Запустить симуляцию
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <a
            href="#"
            className="glass group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 transition-transform group-hover:scale-110">
              <Play className="h-2.5 w-2.5 fill-current" />
            </span>
            Смотреть демо
          </a>
        </motion.div>

        {/* Floating analytics cards */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <FloatingCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Прогноз MRR"
            value="$284K"
            delta="+38.2%"
            className="absolute -left-6 top-10 hidden md:flex"
            delay={0.6}
          />
          <FloatingCard
            icon={<Activity className="h-4 w-4" />}
            label="Уверенность агента"
            value="97%"
            delta="в эфире"
            className="absolute -right-6 top-24 hidden md:flex"
            delay={0.75}
          />
          <FloatingCard
            icon={<DollarSign className="h-4 w-4" />}
            label="Burn в симуляции"
            value="$48K/мес"
            delta="-12%"
            className="absolute -left-2 bottom-8 hidden lg:flex"
            delay={0.9}
          />

          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  icon, label, value, delta, className = "", delay = 0,
}: { icon: React.ReactNode; label: string; value: string; delta: string; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.06, y: -4 }}
      className={`glass-strong glow-ring reflective relative z-20 items-center gap-3 rounded-2xl p-3 pr-5 shadow-elegant animate-float-slow ${className}`}
    >
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-purple">
        {icon}
      </div>
      <div className="text-left">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-semibold">{value}</span>
          <span className="text-xs text-[var(--neon-cyan)]">{delta}</span>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
      className="glass-strong glow-ring reflective relative overflow-hidden rounded-3xl p-2 shadow-elegant"
      style={{ perspective: 1000 }}
    >
      <div className="rounded-[1.25rem] bg-[oklch(0.1_0.02_270)] p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-4 text-xs text-muted-foreground">founderverse.app / симуляции / acme-ai</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-[var(--neon-purple)]" />
            12 агентов активны
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatTile label="Выручка за 18 мес" value="$3.42M" trend="+214%" />
          <StatTile label="Запас" value="22 мес" trend="стабильно" />
          <StatTile label="Оценка" value="$48M" trend="+62%" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Симуляция роста</div>
              <div className="text-xs text-muted-foreground">Q1 → Q8</div>
            </div>
            <AnimatedChart />
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <div className="text-sm font-medium">Вердикт агентов</div>
            <div className="mt-3 space-y-2.5">
              {[
                { name: "Инвестор", v: "Бычий", c: "var(--neon-cyan)" },
                { name: "Риск", v: "Низкий", c: "var(--neon-blue)" },
                { name: "Рынок", v: "Растёт", c: "var(--neon-purple)" },
                { name: "Команда", v: "Сильная", c: "var(--neon-cyan)" },
              ].map((a) => (
                <div key={a.name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Агент · {a.name}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${a.c as string}20`, color: a.c }}>{a.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatTile({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-[var(--neon-cyan)]">{trend}</div>
    </div>
  );
}

function AnimatedChart() {
  // simple svg line + area
  const points = [10, 22, 18, 35, 30, 52, 60, 78, 92];
  const w = 480, h = 140, pad = 8;
  const stepX = (w - pad * 2) / (points.length - 1);
  const maxY = 100;
  const coords = points.map((p, i) => [pad + i * stepX, h - pad - (p / maxY) * (h - pad * 2)] as const);
  const path = coords.map((c, i) => (i === 0 ? `M${c[0]},${c[1]}` : `L${c[0]},${c[1]}`)).join(" ");
  const area = `${path} L${coords[coords.length - 1][0]},${h - pad} L${coords[0][0]},${h - pad} Z`;
  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.2 245)" />
            <stop offset="100%" stopColor="oklch(0.68 0.25 295)" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.25 295 / 0.4)" />
            <stop offset="100%" stopColor="oklch(0.68 0.25 295 / 0)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <motion.path
          d={path}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        />
        {coords.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r={3}
            fill="oklch(0.85 0.15 200)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 + i * 0.08 }}
          />
        ))}
      </svg>
    </div>
  );
}