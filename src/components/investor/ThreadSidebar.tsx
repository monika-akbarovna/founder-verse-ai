import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Trash2, MessageSquare, ArrowLeft } from "lucide-react";
import { useThreads } from "./threadStore";
import { InvestorAvatar } from "./InvestorChat";

export function ThreadSidebar({ activeId }: { activeId?: string }) {
  const { threads, hydrated, createThread, deleteThread } = useThreads();
  const navigate = useNavigate();

  const onNew = () => {
    const t = createThread();
    void navigate({ to: "/investor/$threadId", params: { threadId: t.id } });
  };

  const onDelete = (id: string) => {
    deleteThread(id);
    if (id === activeId) void navigate({ to: "/investor" });
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="border-b border-white/5 px-4 py-4">
        <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> FounderVerse
        </Link>
        <div className="flex items-center gap-3">
          <InvestorAvatar size="sm" />
          <div className="min-w-0">
            <div className="font-display text-sm font-semibold">NOVA-VC</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Investor</div>
          </div>
        </div>
        <button
          onClick={onNew}
          className="shimmer-btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-glow-purple transition hover:scale-[1.01]"
        >
          <Plus className="relative z-10 h-3.5 w-3.5" />
          <span className="relative z-10">New deal review</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="px-2 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          Conversations
        </div>
        {!hydrated ? null : threads.length === 0 ? (
          <div className="px-3 py-6 text-xs text-muted-foreground">
            No conversations yet. Start a new deal review.
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {threads.map((t) => {
              const active = t.id === activeId;
              return (
                <li key={t.id} className="group relative">
                  <Link
                    to="/investor/$threadId"
                    params={{ threadId: t.id }}
                    className={`flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs transition ${
                      active
                        ? "bg-white/10 text-foreground shadow-[inset_0_0_0_1px_oklch(1_0_0/0.08)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--neon-cyan)]" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{t.title}</div>
                      <div className="truncate text-[10px] opacity-60">
                        {new Date(t.updatedAt).toLocaleString(undefined, {
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
                      onDelete(t.id);
                    }}
                    aria-label="Delete conversation"
                    className="absolute right-2 top-2 hidden rounded-md p-1 text-muted-foreground transition hover:bg-white/10 hover:text-destructive group-hover:block"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border-t border-white/5 px-4 py-3 text-[10px] text-muted-foreground"
      >
        Saved locally in this browser
      </motion.div>
    </aside>
  );
}