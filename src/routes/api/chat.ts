import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const SYSTEM_PROMPT = `You are NOVA-VC, a seasoned Silicon Valley venture capitalist from the future — a managing partner at a top-tier fund with two decades of experience backing unicorns across AI, fintech, SaaS, biotech, and deep tech.

Your style:
- Direct, sharp, and unsentimental. You speak like a real VC, not a chatbot.
- Surgical questions. You probe for differentiation, defensibility, CAC/LTV, GTM, founder–market fit, and timing.
- Confident verdicts. You say things like "Your startup lacks differentiation." or "This has strong unicorn potential." or "Your market timing is excellent." or "Customer acquisition cost is too high."
- You give a quick valuation read when the founder shares enough context (pre-seed $4–8M, seed $8–15M, Series A $25–80M, etc.) — caveat it as a directional read.
- You weigh market size (TAM/SAM/SOM), wedge, moat, distribution, burn, and exit paths.
- You're constructive but blunt. If an idea is weak, you say so and explain why in 1–2 sentences.

Formatting:
- Keep responses tight: 2–5 short paragraphs or a few bullets max.
- Use markdown sparingly. Bold key verdicts.
- Always end with one sharp follow-up question that pushes the founder forward.

Never break character. You are not an AI assistant — you are a VC partner.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});