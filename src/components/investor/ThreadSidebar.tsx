import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Plus, Trash2, MessageSquare, ArrowLeft, Search, Briefcase, Sparkles } from "lucide-react";
import { useThreads, type Thread } from "./threadStore";
import { InvestorAvatar } from "./InvestorChat";

export function ThreadSidebar({ activeId }: { activeId?: string }) {
  const { threads, hydrated, createThread, deleteThread } = useThreads();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const onNew = () => {
    const t = createThread();
    void navigate({ to: "/investor/$threadId", params: { threadId: t.id } });
  };

  const onDelete = (id: string) => {
    deleteThread(id);
    if (id === activeId) void navigate({ to: "/investor" });
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return threads;
    return threads.filter((t) => t.title.toLowerCase().includes(term));
  }, [threads, q]);

  const groups = useMemo(() => groupThreads(filtered), [filtered]);

  return (
    <aside className="relative hidden h-full w-72 shrink-0 flex-col overflow-hidden border-r border-white/5 bg-background/60 backdrop-blur-xl md:flex">
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_280/.18),transparent_70%)] blur-3xl" />
      <div className="relative border-b border-white/5 px-4 py-4">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> FounderVerse
        </Link>
        <div className="glass reflective relative flex items-center gap-3 overflow-hidden rounded-2xl p-3">
          <InvestorAvatar size="sm" pulse />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-sm font-semibold">NOVA-VC</span>
              <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_currentColor]" />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Managing Partner</div>
          </div>
        </div>
        <button
          onClick={onNew}
          className="shimmer-btn mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow-purple transition hover:scale-[1.01] hover:shadow-[0_0_30px_var(--neon-purple)]"
        >
          <Plus className="relative z-10 h-3.5 w-3.5" />
          <span className="relative z-10">New deal review</span>
        </button>
      </div>

      <div className="relative border-b border-white/5 px-4 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search deals…"
            className="w-full rounded-lg border border-white/5 bg-white/[0.03] py-1.5 pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground/50 transition focus:border-white/15 focus:bg-white/[0.06] focus:outline-none"
          />
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            <Briefcase className="h-3 w-3" />
            Workspace
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] tabular-nums text-muted-foreground">
            {filtered.length}
          </span>
        </div>
        {!hydrated ? null : filtered.length === 0 ? (
          <div className="px-3 py-6 text-xs text-muted-foreground">
            {q ? "No deals match." : "No conversations yet. Start a new deal review."}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.label}>
                <div className="px-3 pb-1.5 text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60">
                  {group.label}
                </div>
                <ul className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {group.items.map((t) => (
                      <ThreadRow
                        key={t.id}
                        thread={t}
                        active={t.id === activeId}
                        onDelete={onDelete}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex items-center gap-2 border-t border-white/5 px-4 py-3 text-[10px] text-muted-foreground"
      >
        <Sparkles className="h-3 w-3 text-[color:var(--neon-cyan)]" />
        Encrypted locally on this device
      </motion.div>
    </aside>
  );
}

function ThreadRow({
  thread,
  active,
  onDelete,
}: {
  thread: Thread;
  active: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      {active && (
        <motion.div
          layoutId="active-thread-glow"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.7 0.22 280 / 0.18), oklch(0.72 0.2 245 / 0.08))",
            boxShadow:
              "inset 0 0 0 1px oklch(1 0 0 / 0.12), 0 0 24px -6px oklch(0.7 0.22 280 / 0.5)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Link
        to="/investor/$threadId"
        params={{ threadId: thread.id }}
        className={`relative flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-xs transition ${
          active
            ? "text-foreground"
            : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
        }`}
      >
        <span
          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md transition ${
            active
              ? "bg-gradient-primary shadow-[0_0_12px_var(--neon-purple)]"
              : "bg-white/5"
          }`}
        >
          <MessageSquare
            className={`h-3 w-3 ${active ? "text-primary-foreground" : "text-[color:var(--neon-cyan)]"}`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{thread.title}</div>
          <div className="truncate text-[10px] opacity-60">
            {thread.messages.length} msg ·{" "}
            {new Date(thread.updatedAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(thread.id);
        }}
        aria-label="Delete conversation"
        className="absolute right-2 top-2 hidden rounded-md p-1 text-muted-foreground transition hover:bg-white/10 hover:text-destructive group-hover:block"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </motion.li>
  );
}

function groupThreads(threads: Thread[]) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const startOfWeek = startOfToday - 7 * 86_400_000;

  const today: Thread[] = [];
  const yesterday: Thread[] = [];
  const week: Thread[] = [];
  const older: Thread[] = [];

  for (const t of threads) {
    if (t.updatedAt >= startOfToday) today.push(t);
    else if (t.updatedAt >= startOfYesterday) yesterday.push(t);
    else if (t.updatedAt >= startOfWeek) week.push(t);
    else older.push(t);
  }

  return [
    { label: "Today", items: today },
    { label: "Yesterday", items: yesterday },
    { label: "This week", items: week },
    { label: "Earlier", items: older },
  ].filter((g) => g.items.length > 0);
}