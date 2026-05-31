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
          Нам доверяют операторы из
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
    { icon: Briefcase, title: "Опишите свой стартап", body: "Расскажите про идею, рынок, команду и traction обычным языком. Никаких таблиц." },
    { icon: Cpu, title: "ИИ-агенты запускают мир", body: "Инвестор, клиент, конкурент и риск-агент симулируют 18 месяцев за секунды." },
    { icon: Target, title: "Увидьте результат", body: "Получите кинематографичный дашборд роста, оценки, runway и решений, которые всё меняют." },
  ];
  return (
    <section id="product" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Как это работает"
          title={<>От идеи до <span className="text-gradient-brand">симулированной реальности</span> за 60 секунд</>}
          sub="Забудьте про таблицы. FounderVerse запускает мульти-агентную симуляцию вашего стартапа против миллионов рыночных сигналов."
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
              <div className="text-xs text-muted-foreground">Шаг 0{i + 1}</div>
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
    { icon: Briefcase, name: "Агент-инвестор", desc: "Моделирует реакции VC, возражения и term sheets на каждой стадии.", color: "var(--neon-purple)" },
    { icon: Users, name: "Агент-клиент", desc: "Моделирует кривые adoption, churn и готовность платить по сегментам.", color: "var(--neon-blue)" },
    { icon: ShieldAlert, name: "Агент рисков", desc: "Стресс-тест стартапа против 200+ паттернов провала.", color: "oklch(0.7 0.22 30)" },
    { icon: LineChart, name: "Агент роста", desc: "Прогнозирует MRR, CAC, payback и виральные коэффициенты помесячно.", color: "var(--neon-cyan)" },
    { icon: Brain, name: "Агент стратегии", desc: "Предлагает пивоты, GTM-ходы и ценовые эксперименты, которые стоит запустить.", color: "var(--neon-purple)" },
    { icon: MessageSquare, name: "PR-агент", desc: "Предсказывает прессу, соцсети и резонанс нарратива на запуске.", color: "var(--neon-blue)" },
  ];
  return (
    <section id="agents" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="ИИ-агенты"
          title={<>Симулированный <span className="text-gradient-brand">оргчарт</span> для вашего стартапа</>}
          sub="Шесть специализированных агентов спорят, расходятся и сходятся — как предельно честный совет директоров."
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
          eyebrow="Кокпит"
          title={<>Командный центр <span className="text-gradient-brand">вашего стартапа</span></>}
          sub="Каждая симуляция создаёт кинематографичный дашборд в реальном времени — делитесь с командой и инвесторами."
        />
        <motion.div
          {...fadeUp}
          className="glass-strong glow-ring reflective relative mt-16 overflow-hidden rounded-3xl p-2 shadow-elegant"
        >
          <div className="grid gap-2 rounded-[1.25rem] bg-[oklch(0.1_0.02_270)] p-6 md:grid-cols-12">
            <div className="md:col-span-3 space-y-2">
              {["Обзор", "Агенты", "Рост", "Риски", "Сценарии", "Сим инвестора"].map((t, i) => (
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
                  { l: "Сжигание", v: "$48k", t: "-12%" },
                  { l: "CAC", v: "$84", t: "стабильно" },
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
                  <div className="text-sm font-medium">Симуляция роста · 18 месяцев</div>
                  <div className="flex gap-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--neon-purple)]" /> База</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[var(--neon-blue)]" /> Агрессивная</span>
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
    { quote: "FounderVerse показал, что наш прайс отстаёт на 40%. Мы исправили это перед seed-раундом и закрыли его за 9 дней.", name: "Майя Чен", role: "Основательница, Northlight AI" },
    { quote: "Агент рисков подсветил паттерн оттока, который не заметил ни один инвестор. Это спасло нам квартал.", name: "Дэниел Парк", role: "CEO, Vaultline" },
    { quote: "Как прожить 3 года операционки за один вечер. Реально нечестное преимущество.", name: "София Ривера", role: "Партнёр, Foundry VC" },
  ];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Операторы ценят"
          title={<>Создано для основателей, которые <span className="text-gradient-brand">мыслят системно</span></>}
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
      name: "Explorer", price: "$0", desc: "Для основателей, которые присматриваются.",
      features: ["1 симуляция в месяц", "3 ИИ-агента", "Базовый дашборд", "Поддержка сообщества"],
    },
    {
      name: "Operator", price: "$49", desc: "Для основателей, которые уже строят.", highlight: true,
      features: ["Безлимитные симуляции", "Все 6 ИИ-агентов", "Симуляция реакции инвестора", "Ветвление сценариев", "Шейринг досок"],
    },
    {
      name: "Fund", price: "По запросу", desc: "Для VC и акселераторов.",
      features: ["Симуляции по портфелю", "Кастомные агенты и данные", "API-доступ", "SOC2 + SSO", "Выделенный успех"],
    },
  ];
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Тарифы"
          title={<>Предсказуемые планы, <span className="text-gradient-brand">нечестное преимущество</span></>}
          sub="Начните бесплатно. Перейдите на платный план, когда симуляции окупят себя."
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
                  Самый популярный
                </div>
              )}
              <div className="text-sm font-medium text-muted-foreground">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold">{t.price}</span>
                {t.price.startsWith("$") && t.price !== "$0" && <span className="text-sm text-muted-foreground">/мес</span>}
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
                {t.name === "Fund" ? "Связаться с отделом продаж" : "Начать"}
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
              <span className="text-gradient">Запустите первую симуляцию</span>
              <br />
              <span className="text-gradient-brand">меньше чем за минуту.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Тысячи основателей уже тестируют следующий стартап на миллиард до того, как написать первую строку кода.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#" className="shimmer-btn group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-glow-purple transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_80px_-10px_var(--neon-purple)]">
                <span className="relative z-10 inline-flex items-center gap-2">
                  Запустить симуляцию <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
              <a href="#" className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10">
                Записаться на демо
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
    { title: "Продукт", links: ["Агенты", "Дашборд", "Тарифы", "Журнал"] },
    { title: "Компания", links: ["О нас", "Карьера", "Пресса", "Контакты"] },
    { title: "Ресурсы", links: ["Документация", "Гайды", "Блог", "Статус"] },
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
            Симулированная реальность для амбициозных основателей. Предскажите будущее своего стартапа уже сегодня.
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
        <div>© 2026 FounderVerse Labs, Inc. Все права защищены.</div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-foreground transition-colors">Приватность</a>
          <a href="#" className="hover:text-foreground transition-colors">Условия</a>
          <a href="#" className="hover:text-foreground transition-colors">Безопасность</a>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <motion.div {...fadeUp} className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="h-1 w-1 rounded-full bg-[var(--neon-purple)] shadow-[0_0_8px_var(--neon-purple)]" />
        {eyebrow}
      </motion.div>
      <motion.h2 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-[3.25rem]">
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