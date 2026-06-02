import { useCallback, useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Square, TrendingUp, AlertTriangle, Target, Zap } from "lucide-react";
import { saveThreadMessages, loadThread } from "./threadStore";
import { InvestorAnalytics } from "./InvestorAnalytics";
import { generateInvestorReply } from "./mockInvestor";

const SUGGESTIONS = [
  { icon: TrendingUp, label: "Оцени мою идею стартапа", text: "Я строю B2B-платформу ИИ-агентов, которая автоматизирует SOC2-комплаенс для mid-market SaaS. Pre-revenue, два технических со-основателя. Оцени возможность." },
  { icon: Target, label: "Анализ рынка", text: "Проведи анализ рынка вертикальных ИИ-агентов в healthcare-администрировании. TAM, wedge, кто выигрывает?" },
  { icon: AlertTriangle, label: "Прогноз рисков", text: "Какие 3 главных риска прямо сейчас могут убить consumer ИИ-компаньона?" },
  { icon: Zap, label: "Оценка стоимости", text: "Seed-стадия, AI dev tools, $40k MRR, рост 18% м/м, 2 основателя ex-Stripe. Какая обоснованная оценка?" },
];

export function InvestorChatWithAnalytics({ threadId }: { threadId: string }) {
  const { messages, status, error, sendMessage, stop } = useMockInvestorChat(threadId);
  const isLoading = status === "submitted" || status === "streaming";

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length === 0) return;
    const firstUserText = (() => {
      const m = messages.find((x) => x.role === "user");
      if (!m) return undefined;
      return m.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
    })();
    saveThreadMessages(threadId, messages, firstUserText);
  }, [messages, threadId]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    sendMessage(t);
  };

  return (
    <div className="flex h-full w-full min-w-0">
      <ChatPane
        threadId={threadId}
        messages={messages}
        status={status}
        isLoading={isLoading}
        error={error}
        onSubmit={submit}
        onStop={stop}
      />
      <InvestorAnalytics
        messages={messages}
        threadId={threadId}
        isThinking={isLoading}
      />
    </div>
  );
}

function makeId() {
  return "m_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function useMockInvestorChat(threadId: string) {
  const [messages, setMessages] = useState<UIMessage[]>(() => loadThread(threadId)?.messages ?? []);
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">("ready");
  const [error, setError] = useState<Error | undefined>(undefined);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cancelled = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    return () => {
      cancelled.current = true;
      clearTimers();
    };
  }, []);

  // Persist
  useEffect(() => {
    if (messages.length === 0) return;
    const firstUser = messages.find((m) => m.role === "user");
    const hint = firstUser?.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ").trim();
    saveThreadMessages(threadId, messages, hint);
  }, [messages, threadId]);

  const stop = useCallback(() => {
    clearTimers();
    setStatus("ready");
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      setError(undefined);
      const userMsg: UIMessage = {
        id: makeId(),
        role: "user",
        parts: [{ type: "text", text }],
      } as UIMessage;

      const assistantId = makeId();
      let history: UIMessage[] = [];
      setMessages((prev) => {
        history = [...prev, userMsg];
        return history;
      });
      setStatus("submitted");

      // Think delay
      const thinkDelay = 700 + Math.random() * 900;
      timers.current.push(
        setTimeout(() => {
          if (cancelled.current) return;
          const reply = generateInvestorReply(text, history);
          // Add empty assistant message, then stream tokens
          setMessages((prev) => [
            ...prev,
            { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] } as UIMessage,
          ]);
          setStatus("streaming");

          // Tokenize by word for natural streaming
          const tokens = reply.match(/\s+|\S+/g) ?? [reply];
          let acc = "";
          tokens.forEach((tok, i) => {
            const t = setTimeout(() => {
              if (cancelled.current) return;
              acc += tok;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, parts: [{ type: "text", text: acc }] }
                    : m
                )
              );
              if (i === tokens.length - 1) {
                setStatus("ready");
              }
            }, 18 + i * (14 + Math.random() * 22));
            timers.current.push(t);
          });
        }, thinkDelay)
      );
    },
    []
  );

  return { messages, status, error, sendMessage, stop };
}

function ChatPane({
  threadId,
  messages,
  status,
  isLoading,
  error,
  onSubmit,
  onStop,
}: {
  threadId: string;
  messages: UIMessage[];
  status: string;
  isLoading: boolean;
  error: Error | undefined;
  onSubmit: (text: string) => void;
  onStop: () => void;
}) {
  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Keep textarea focused
  useEffect(() => {
    taRef.current?.focus();
  }, [threadId, status]);

  const submit = (text: string) => {
    const t = text.trim();
    if (!t || isLoading) return;
    setInput("");
    onSubmit(t);
  };

  return (
    <div className="relative flex h-full min-w-0 flex-1 flex-col">
      {/* Header */}
      <div className="relative border-b border-white/5 px-6 py-4">
        <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[color:var(--neon-purple)]/40 to-transparent" />
        <div className="flex items-center gap-3">
          <InvestorAvatar pulse={isLoading} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-semibold tracking-tight">NOVA-VC</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Управляющий партнёр · Sequoia-уровень
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
            {isLoading ? "Думаю над сделкой…" : "Онлайн · готов оценить ваш стартап"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {messages.length === 0 && <EmptyState onPick={submit} />}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </AnimatePresence>

          {status === "submitted" && <ThinkingBubble />}
          {status === "streaming" && messages.at(-1)?.role === "assistant" && (
            <StreamingCursor />
          )}
          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
              Инвестор замолчал. {error.message || "Попробуйте ещё раз через секунду."}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-white/5 bg-background/40 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="glass-strong relative flex items-end gap-2 rounded-2xl p-2 pl-4 shadow-elegant"
          >
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              rows={1}
              placeholder="Питчите стартап, спросите про оценку, рынок или анализ рисков…"
              className="max-h-40 min-h-[28px] flex-1 resize-none bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
            {isLoading ? (
              <button
                type="button"
                onClick={() => stop()}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-foreground transition hover:bg-white/20"
                aria-label="Остановить"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="shimmer-btn relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-purple transition disabled:opacity-40 disabled:shadow-none"
                aria-label="Отправить"
              >
                <ArrowUp className="relative z-10 h-4 w-4" />
              </button>
            )}
          </form>
          <p className="mt-2 text-center text-[10px] text-muted-foreground/70">
            NOVA-VC даёт прямые VC-оценки. Не является инвестиционным советом.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-2xl pt-8 text-center"
    >
      <div className="mx-auto mb-6 flex justify-center">
        <InvestorAvatar size="lg" pulse />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-gradient">
        Питчите будущее. Получите VC-вердикт.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        NOVA-VC — синтетический партнёр Кремниевой долины. Поделитесь идеей, traction или тезисом — получите
        дифференциацию, тайминг рынка, риски и ориентир по оценке.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => onPick(s.text)}
            className="glass hover-lift reflective group relative overflow-hidden rounded-2xl p-4 text-left transition"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <s.icon className="h-4 w-4 text-[color:var(--neon-cyan)]" />
              {s.label}
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.text}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-primary px-4 py-2.5 text-sm text-primary-foreground shadow-glow-purple">
          {text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-3"
    >
      <InvestorAvatar size="sm" />
      <div className="flex-1 pt-1">
        <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="text-foreground/80">NOVA-VC</span>
          <span className="h-1 w-1 rounded-full bg-[color:var(--neon-cyan)]" />
          <span>Партнёр</span>
        </div>
        <div className="prose-investor whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
          {text}
        </div>
      </div>
    </motion.div>
  );
}

function ThinkingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <InvestorAvatar size="sm" pulse />
      <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
        <span className="inline-flex gap-1">
          <Dot delay={0} />
          <Dot delay={0.15} />
          <Dot delay={0.3} />
        </span>
        <span className="bg-[linear-gradient(90deg,transparent,oklch(1_0_0/.7),transparent)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer-text">
          Провожу due diligence по сделке…
        </span>
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="h-1.5 w-1.5 rounded-full bg-[color:var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]"
      animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.2, repeat: Infinity, delay }}
    />
  );
}

function StreamingCursor() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="-mt-3 ml-12 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70"
    >
      <motion.span
        className="inline-block h-2 w-2 rounded-full bg-[color:var(--neon-cyan)]"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.15, 0.9] }}
        transition={{ duration: 1.1, repeat: Infinity }}
        style={{ boxShadow: "0 0 10px var(--neon-cyan)" }}
      />
        Потоковый ответ
    </motion.div>
  );
}

export function InvestorAvatar({
  size = "md",
  pulse = false,
}: {
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
}) {
  const dim = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-20 w-20" : "h-11 w-11";
  const inner = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-5 w-5";
  return (
    <div className={`relative ${dim} shrink-0`}>
      <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-80 blur-md" />
      <div className="glow-ring relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_20%,oklch(0.75_0.2_280),oklch(0.4_0.18_260)_60%,oklch(0.15_0.05_270))]">
        {/* orbit ring */}
        <motion.div
          className="absolute inset-1 rounded-full border border-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ borderTopColor: "var(--neon-cyan)" }}
        />
        {pulse && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: "0 0 30px 4px var(--neon-purple)" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
        <svg viewBox="0 0 24 24" className={`${inner} relative z-10 text-white drop-shadow-[0_0_6px_var(--neon-cyan)]`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l5-8 4 5 3-4 6 9" />
          <circle cx="8" cy="9" r="1.2" fill="currentColor" />
          <circle cx="15" cy="10" r="1.2" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}