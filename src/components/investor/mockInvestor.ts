import type { UIMessage } from "ai";

type Profile = {
  stage: "pre-seed" | "seed" | "series-a" | "growth" | "unknown";
  vertical: string | null;
  hasTraction: boolean;
  hasRevenue: boolean;
  consumer: boolean;
  b2b: boolean;
  aiNative: boolean;
  marketplace: boolean;
  hardware: boolean;
  competitionHeavy: boolean;
  askedValuation: boolean;
  askedRisks: boolean;
  askedMarket: boolean;
};

const VERTICALS: Array<[string, RegExp]> = [
  ["fintech", /fintech|финтех|банк|платеж|payments|lending/i],
  ["healthcare", /health|healthcare|медиц|клиник|biotech|био/i],
  ["dev tools", /dev ?tools|developer|разработчик|sdk|api/i],
  ["AI agents", /ai ?agent|агент|llm|copilot|ассистент/i],
  ["SaaS", /saas|b2b|enterprise/i],
  ["marketplace", /marketplace|маркетплейс|двусторон/i],
  ["consumer", /consumer|d2c|app|приложен|потребитель/i],
  ["security", /security|compliance|soc2|gdpr|безопасн/i],
  ["edtech", /edtech|обучен|образован/i],
];

function profile(text: string): Profile {
  const t = text.toLowerCase();
  const stage =
    /pre-?seed|пресид|идея/.test(t) ? "pre-seed"
    : /\bseed\b|сид/.test(t) ? "seed"
    : /series ?a|раунд a/.test(t) ? "series-a"
    : /series ?b|growth|рост/.test(t) ? "growth"
    : "unknown";
  const vertical = VERTICALS.find(([, re]) => re.test(text))?.[0] ?? null;
  return {
    stage,
    vertical,
    hasTraction: /(mrr|arr|пользовател|users|клиент|customers|paying|pmf|рост|growth)/i.test(t),
    hasRevenue: /(\$|usd|mrr|arr|revenue|выручк|доход)/i.test(t),
    consumer: /(consumer|d2c|b2c|потребитель|приложен)/i.test(t),
    b2b: /(b2b|enterprise|saas|команд)/i.test(t),
    aiNative: /(ai|ии|llm|gpt|gemini|claude|agent|агент)/i.test(t),
    marketplace: /(marketplace|маркетплейс)/i.test(t),
    hardware: /(hardware|железо|устройств|device|robot|роб)/i.test(t),
    competitionHeavy: /(конкурент|competition|incumbent|crowded|переполнен)/i.test(t),
    askedValuation: /(valuation|оценк|стоимост|раунд|round|raise|подним)/i.test(t),
    askedRisks: /(risk|риск|kill|умрет|провал)/i.test(t),
    askedMarket: /(market|рынок|tam|sam|som|размер|оппортун)/i.test(t),
  };
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function seedFrom(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const VERDICTS_POS = [
  "**Fund-returner profile если GTM удержит темп.**",
  "**Тонкий wedge, но реальный. Готов идти в diligence.**",
  "**Похоже на early Gong/Ramp паттерн — беру второй звонок.**",
];
const VERDICTS_MID = [
  "**Интересно, но wedge пока тонкий. Нужен один сильный proof point.**",
  "**Категория правильная, исполнение — вопрос. Условный интерес.**",
  "**Тезис рабочий, экономика недоказана. Pass на этом раунде, ремит на следующем.**",
];
const VERDICTS_NEG = [
  "**Pass at current shape.** Категория переполнена, дифференциация нарративная.",
  "**CAC-математика не сходится при текущем ARPU. Pass.**",
  "**Это фича, а не компания. Большой игрок встроит за квартал.**",
];

export function generateInvestorReply(userText: string, history: UIMessage[]): string {
  const p = profile(userText);
  const seed = seedFrom(userText + history.length);
  const sections: string[] = [];

  // Verdict bias
  const positiveSignals =
    (p.hasTraction ? 1 : 0) + (p.b2b ? 1 : 0) + (p.aiNative ? 1 : 0) + (p.hasRevenue ? 1 : 0);
  const negativeSignals =
    (p.consumer ? 1 : 0) + (p.competitionHeavy ? 1 : 0) + (p.hardware ? 1 : 0);
  const verdictPool =
    positiveSignals - negativeSignals >= 2
      ? VERDICTS_POS
      : positiveSignals - negativeSignals <= -1
      ? VERDICTS_NEG
      : VERDICTS_MID;
  sections.push(pick(verdictPool, seed));

  // Market
  const vert = p.vertical ?? "вашей категории";
  const marketLines = [
    `Рынок ${vert}: TAM есть, но реальный SOM ограничен distribution, а не product-gap. Победит тот, кто решит motion, а не feature set.`,
    `Тайминг по ${vert} правильный — модельные косты упали 8× за 18 месяцев, и инкумбенты ещё не отреагировали. Окно ~12–18 мес.`,
    `${vert.charAt(0).toUpperCase() + vert.slice(1)} — категория, где 70% игроков умирают на дистрибуции. Продукт здесь второстепенен.`,
  ];
  if (p.askedMarket || seed % 2 === 0) sections.push(pick(marketLines, seed >> 3));

  // Competition
  const compLines = [
    `Конкуренция: 3–4 well-funded стартапа уже копают здесь, плюс «достаточно хорошее» in-house решение у клиента. Ваш wedge должен быть **distribution или data**, не UX.`,
    `Incumbent (Salesforce/HubSpot класс) встроит это за 2 квартала, если категория докажет ARR. Вопрос — успеете ли вы построить moat до этого момента.`,
    `Open-source альтернатива в радиусе одного weekend hack. Защита — только switching cost через данные или workflow lock-in.`,
  ];
  sections.push(pick(compLines, seed >> 6));

  // Unit economics / scalability
  const econLines = [
    `**CAC/LTV:** на текущем ARPU пэйбек выглядит как 14–18 месяцев — за порогом комфорта. Покажите cohort retention M6+ выше 110% NRR и разговор меняется.`,
    `Масштабируемость: sales-led ceiling на ~$8–12M ARR без перехода в product-led. Заложите PLG-моушн в roadmap, иначе Series A будет жёсткий.`,
    `Gross margin для софта <60% — красный флаг. Если ops-heavy delivery, это услугой пахнет, а не SaaS. Автоматизируйте до 75%+ до раунда.`,
  ];
  sections.push(pick(econLines, seed >> 9));

  // Risks
  if (p.askedRisks || seed % 3 === 0) {
    const riskLines = [
      `Три риска, которые убьют сделку: (1) платформенный риск — OpenAI/Anthropic релизит native фичу; (2) ICP миграция вниз по рынку; (3) regulatory shift на data residency.`,
      `Главный риск — **founder–market fit на дистрибуции**, не на продукте. Кто из команды уже продавал в этот ICP до $1M ARR?`,
    ];
    sections.push(pick(riskLines, seed >> 12));
  }

  // Valuation
  if (p.askedValuation) {
    const v =
      p.stage === "pre-seed" ? "$5–8M post"
      : p.stage === "seed" ? "$12–18M post"
      : p.stage === "series-a" ? "$35–70M post"
      : "$80–200M post";
    sections.push(`**Ориентир по оценке:** ${v} при текущем профиле. Выше — только с доказанным NRR 120%+ или эксклюзивным каналом.`);
  }

  // Closing recommendation + question
  const questions = [
    "Какой у вас CAC по платному каналу и пэйбек в месяцах — без блендинга с органикой?",
    "Покажите мне M6 cohort retention. Если она ниже 80%, остальное неважно.",
    "Кто из команды продавал в этот ICP раньше до $1M ARR? Имя, компания, год.",
    "Что произойдёт с вашим moat, если OpenAI выпустит эту фичу нативно через 6 месяцев?",
    "Покажите unit economics на одной когорте: CAC, GM, payback, NRR. Без средних.",
  ];
  sections.push(pick(questions, seed >> 15));

  return sections.join("\n\n");
}