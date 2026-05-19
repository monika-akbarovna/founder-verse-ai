import { createFileRoute } from "@tanstack/react-router";
import { ThreadSidebar } from "@/components/investor/ThreadSidebar";
import { InvestorChat } from "@/components/investor/InvestorChat";

export const Route = createFileRoute("/investor/$threadId")({
  head: () => ({
    meta: [
      { title: "AI Investor Chat — FounderVerse" },
      { name: "description", content: "Conversation with NOVA-VC, a synthetic Silicon Valley VC partner." },
    ],
  }),
  component: ThreadPage,
});

function ThreadPage() {
  const { threadId } = Route.useParams();
  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.22_280/.3),transparent_70%)] blur-3xl animate-aurora" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,oklch(0.72_0.2_245/.25),transparent_70%)] blur-3xl animate-aurora" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>
      <ThreadSidebar activeId={threadId} />
      <section className="relative flex min-w-0 flex-1">
        {/* keyed by threadId to remount cleanly between threads */}
        <div key={threadId} className="flex h-full w-full min-w-0">
          <InvestorChat threadId={threadId} />
        </div>
      </section>
    </main>
  );
}