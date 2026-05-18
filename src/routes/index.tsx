import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import {
  TrustedBy, HowItWorks, AIAgents, DashboardSection,
  Testimonials, Pricing, FinalCTA, Footer,
} from "@/components/landing/Sections";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <AIAgents />
      <DashboardSection />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
