import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ThreadSidebar } from "@/components/investor/ThreadSidebar";
import { useThreads } from "@/components/investor/threadStore";
import { InvestorAvatar } from "@/components/investor/InvestorChat";

export const Route = createFileRoute("/investor")({
  head: () => ({
    meta: [
      { title: "AI Investor Chat — FounderVerse" },
      { name: "description", content: "Pitch your startup to NOVA-VC, a synthetic Silicon Valley venture capitalist. Get evaluation, market analysis, risk prediction, and a valuation read." },
      { property: "og:title", content: "AI Investor Chat — FounderVerse" },
      { property: "og:description", content: "Speak with a futuristic AI venture capitalist." },
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
            Meet NOVA-VC
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            A futuristic AI venture capitalist. Pitch your startup and get a blunt, sharp,
            unicorn-grade verdict in seconds.
          </p>
          <button
            onClick={onStart}
            className="shimmer-btn relative mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-purple transition hover:scale-105"
          >
            <span className="relative z-10">Start a deal review</span>
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