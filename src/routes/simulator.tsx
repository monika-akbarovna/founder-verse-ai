import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Simulator } from "@/components/simulator/Simulator";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Симулятор FounderVerse — запустите ИИ-симуляцию стартапа" },
      { name: "description", content: "Стресс-тест вашей идеи с ИИ-агентами. Индекс выживания, доверие инвесторов, рыночный потенциал и виральность — за секунды." },
      { property: "og:title", content: "Симулятор FounderVerse" },
      { property: "og:description", content: "Запустите ИИ-симуляцию стартапа меньше чем за минуту." },
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