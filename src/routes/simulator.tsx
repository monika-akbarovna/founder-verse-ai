import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Simulator } from "@/components/simulator/Simulator";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "FounderVerse Simulator — Run an AI startup simulation" },
      { name: "description", content: "Pressure-test your startup idea with AI agents. Get survival score, investor confidence, market opportunity, and viral potential in seconds." },
      { property: "og:title", content: "FounderVerse Simulator" },
      { property: "og:description", content: "Run an AI startup simulation in under a minute." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <Nav />
      <Simulator />
    </main>
  );
}