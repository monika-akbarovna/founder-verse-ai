import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ThreadSidebar } from "@/components/investor/ThreadSidebar";
import { useThreads } from "@/components/investor/threadStore";
import { InvestorAvatar } from "@/components/investor/InvestorChat";

export const Route = createFileRoute("/investor")({
  head: () => ({
    meta: [
      { title: "Чат с ИИ-инвестором — FounderVerse" },
      { name: "description", content: "Питчите стартап NOVA-VC — синтетическому венчурному инвестору из Кремниевой долины. Оценка, анализ рынка, прогноз рисков и ориентир по стоимости." },
      { property: "og:title", content: "Чат с ИИ-инвестором — FounderVerse" },
      { property: "og:description", content: "Поговорите с футуристичным ИИ-венчуром." },
    ],
  }),
  component: InvestorIndex,
});

function InvestorIndex() {
  const { threads, hydrated, createThread } = useThreads();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (threads.length > 0) {
      void navigate({
        to: "/investor/$threadId",
        params: { threadId: threads[0].id },
        replace: true,
      });
    }
  }, [hydrated, threads, navigate]);

  const onStart = () => {
    const t = createThread();
    void navigate({ to: "/investor/$threadId", params: { threadId: t.id } });
  };

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-background">
      <BgFx />
      <ThreadSidebar />
      <section className="relative flex flex-1 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex justify-center">
            <InvestorAvatar size="lg" pulse />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-gradient">
            Знакомьтесь — NOVA-VC
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Футуристичный ИИ-венчур. Питчите стартап и получите прямой, острый
            вердикт уровня единорога за секунды.
          </p>
          <button
            onClick={onStart}
            className="shimmer-btn relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-purple transition hover:scale-105"
          >
            <span className="relative z-10">Начать разбор сделки</span>
          </button>
        </div>
      </section>
    </main>
  );
}

function BgFx() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_280/.35),transparent_70%)] blur-3xl animate-aurora" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.72_0.2_245/.3),transparent_70%)] blur-3xl animate-aurora" />
      <div className="absolute inset-0 grid-bg opacity-40" />
    </div>
  );
}