import { motion } from "framer-motion";
import {
  Brain, LineChart, ShieldAlert, Users, Rocket, Sparkles, Check,
  Cpu, Target, Briefcase, MessageSquare, ArrowRight,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export function TrustedBy() {
  const logos = ["Sequoia", "a16z", "Y Combinator", "Lightspeed", "Founders Fund", "Index"];
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p {...fadeUp} className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by operators from
        </motion.p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
          {logos.map((l, i) => (
            <motion.span
              key={l}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.8, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="font-display text-lg font-semibold tracking-tight text-muted-foreground"
            >
              {l}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: Briefcase, title: "Describe your startup", body: "Share your idea, market, team, and traction in plain language. No spreadsheets required." },
    { icon: Cpu, title: "AI agents run the world", body: "Investor, customer, competitor, and risk agents simulate 18 months in seconds." },
    { icon: Target, title: "See the outcome", body: "Get a cinematic dashboard of growth, valuation, runway, and the moves that change it all." },
  ];
  return (
    <section id="product" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="How it works"
          title={<>From idea to <span className="text-gradient-brand">simulated reality</span> in 60 seconds</>}
          sub="Skip the spreadsheets. FounderVerse runs a multi-agent simulation of your startup against millions of market signals."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="glass glow-ring reflective hover-lift relative rounded-3xl p-7"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow-purple">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-xs text-muted-foreground">Step 0{i + 1}</div>
              <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AIAgents() {
  const agents = [
    { icon: Briefcase, name: "Investor Agent", desc: "Simulates VC reactions, pushback, and term sheets across stages.", color: "var(--neon-purple)" },
    { icon: Users, name: "Customer Agent", desc: "Models adoption curves, churn, and willingness-to-pay across segments.", color: "var(--neon-blue)" },
    { icon: ShieldAlert, name: "Risk Agent", desc: "Stress-tests your startup against 200+ failure patterns.", color: "oklch(0.7 0.22 30)" },
    { icon: LineChart, name: "Growth Agent", desc: "Forecasts MRR, CAC, payback, and viral coefficients month over month.", color: "var(--neon-cyan)" },
    { icon: Brain, name: "Strategy Agent", desc: "Recommends pivots, GTM moves, and pricing experiments worth running.", color: "var(--neon-purple)" },
    { icon: MessageSquare, name: "PR Agent", desc: "Predicts press, social sentiment, and narrative resonance at launch.", color: "var(--neon-blue)" },
  ];
  return (
    <section id="agents" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="AI Agents"
          title={<>A simulated <span className="text-gradient-brand">org chart</span> for your startup</>}
          sub="Six specialist agents debate, disagree, and converge — like a brutally honest board meeting."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="glass-strong glow-ring reflective hover-lift group relative overflow-hidden rounded-3xl p-6"
            >
              <div
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
                style={{ background: a.color }}
              />
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]" style={{ color: a.color }}>
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{a.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="The Cockpit"
          title={<>Your startup's <span className="text-gradient-brand">command center</span></>}
          sub="Every simulation produces a real-time, cinematic dashboard you can share with your team and investors."
        />
        <motion.div
          {...fadeUp}
          className="glass-strong glow-ring reflective relative mt-16 overflow-hidden rounded-3xl p-2 shadow-elegant"
        >
          <div className="grid gap-2 rounded-[1.25rem] bg-[oklch(0.1_0.02_270)] p-6 md:grid-cols-12">
            <div className="md:col-span-3 space-y-2">
              {["Overview", "Agents", "Growth", "Risk", "Scenarios", "Investor Sim"].map((t, i) => (
                <div key={t} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${i === 0 ? "bg-white/5 text-foreground" : "text-muted-foreground"}`}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? "var(--neon-purple)" : "oklch(1 0 0 / 0.2)" }} />
                  {t}
                </div>
              ))}
            </div>
            <div className="md:col-span-9 grid gap-3">
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { l: "ARR", v: "$3.4M", t: "+214%" },
                  { l: "Burn", v: "$48k", t: "-12%" },
                  { l: "CAC", v: "$84", t: "stable" },
                  { l: "NRR", v: "128%", t: "+9%" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
                    <div className="mt-1 font-display text-xl font-semibold">{s.v}</div>
                    <div className="text-xs text-[var(--neon-cyan)]">{s.t}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">18-Month Growth Simulation</div>
                  <div className="flex gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--neon-purple)]" /> Base</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--neon-blue)]" /> Aggressive</span>
                  </div>
                </div>
                <BigChart />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BigChart() {
  const a = [12, 18, 24, 35, 42, 58, 64, 78, 92];
  const b = [10, 14, 19, 27, 32, 40, 48, 55, 62];
  const w = 800, h = 220, pad = 12;
  const toPath = (data: number[]) => {
    const stepX = (w - pad * 2) / (data.length - 1);
    return data.map((p, i) => `${i === 0 ? "M" : "L"}${pad + i * stepX},${h - pad - (p / 100) * (h - pad * 2)}`).join(" ");
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-5 w-full">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.25 295 / 0.35)" />
          <stop offset="100%" stopColor="oklch(0.68 0.25 295 / 0)" />
        </linearGradient>
      </defs>
      <path d={`${toPath(a)} L${w - pad},${h - pad} L${pad},${h - pad} Z`} fill="url(#g1)" />
      <motion.path d={toPath(a)} fill="none" stroke="oklch(0.68 0.25 295)" strokeWidth="2.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
      <motion.path d={toPath(b)} fill="none" stroke="oklch(0.72 0.2 245)" strokeWidth="2" strokeDasharray="4 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.3 }} />
    </svg>
  );
}

export function Testimonials() {
  const items = [
    { quote: "FounderVerse told us our pricing was off by 40%. We fixed it before our seed round and closed in 9 days.", name: "Maya Chen", role: "Founder, Northlight AI" },
    { quote: "The Risk Agent flagged a churn pattern none of our investors saw. It saved us a quarter.", name: "Daniel Park", role: "CEO, Vaultline" },
    { quote: "It's like running a 3-year operating history in an afternoon. Genuinely unfair advantage.", name: "Sofía Rivera", role: "Partner, Foundry VC" },
  ];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Operators love it"
          title={<>Built for founders who <span className="text-gradient-brand">think in systems</span></>}
        />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="glass glow-ring reflective hover-lift relative rounded-3xl p-7">
              <Sparkles className="h-5 w-5 text-[var(--neon-purple)]" />
              <p className="mt-5 text-base leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 border-t border-white/5 pt-4">
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const tiers = [
    {
      name: "Explorer", price: "$0", desc: "For founders kicking the tires.",
      features: ["1 simulation / month", "3 AI agents", "Basic dashboard", "Community support"],
    },
    {
      name: "Operator", price: "$49", desc: "For founders building in real life.", highlight: true,
      features: ["Unlimited simulations", "All 6 AI agents", "Investor reaction sim", "Scenario branching", "Shareable boards"],
    },
    {
      name: "Fund", price: "Custom", desc: "For VCs and accelerators.",
      features: ["Portfolio-wide sims", "Custom agents & data", "API access", "SOC2 + SSO", "Dedicated success"],
    },
  ];
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Predictable plans, <span className="text-gradient-brand">unfair leverage</span></>}
          sub="Start free. Upgrade when your simulations are paying for themselves."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={`relative rounded-3xl p-7 hover-lift reflective ${t.highlight ? "glass-strong shadow-glow-purple scale-[1.02]" : "glass"} glow-ring`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-glow-purple">
                  Most popular
                </div>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{t.price}</span>
                {t.price.startsWith("$") && t.price !== "$0" && <span className="text-sm text-muted-foreground">/mo</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-[var(--neon-cyan)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                  t.highlight ? "bg-gradient-primary text-primary-foreground shadow-glow-purple" : "border border-white/10 bg-white/[0.04] text-foreground hover:bg-white/[0.08]"
                }`}
              >
                {t.name === "Fund" ? "Talk to sales" : "Get started"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section id="cta" className="relative py-32">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          {...fadeUp}
          className="glass-strong glow-ring reflective relative overflow-hidden rounded-[2rem] p-12 text-center shadow-elegant md:p-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-80" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--neon-purple)] opacity-30 blur-[120px] animate-pulse-glow" />
          <div className="relative">
            <Rocket className="mx-auto h-7 w-7 text-[var(--neon-cyan)]" />
            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">
              <span className="text-gradient">Run your first simulation</span>
              <br />
              <span className="text-gradient-brand">in under a minute.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Join thousands of founders pressure-testing the next billion-dollar startup before they write a single line of code.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#" className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-purple transition-transform hover:scale-[1.04]">
                Run Simulation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a href="#" className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10">
                Book a walkthrough
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { title: "Product", links: ["Agents", "Dashboard", "Pricing", "Changelog"] },
    { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
    { title: "Resources", links: ["Docs", "Guides", "Blog", "Status"] },
  ];
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-primary shadow-glow-purple">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display text-sm font-semibold">FounderVerse</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The simulated reality for ambitious founders. Predict the future of your startup, today.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="text-muted-foreground transition-colors hover:text-foreground">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-muted-foreground md:flex-row">
        <div>© 2026 FounderVerse Labs, Inc. All rights reserved.</div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Security</a>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.div {...fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </motion.div>
      <motion.h2 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
        <span className="text-gradient">{title}</span>
      </motion.h2>
      {sub && (
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          {sub}
        </motion.p>
      )}
    </div>
  );
}