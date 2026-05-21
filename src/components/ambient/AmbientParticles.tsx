import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Global ambient layer:
 *  - drifting "AI" particles
 *  - two slow conic orbs
 *  - subtle scanline + noise
 * Renders fixed behind all content. Pointer-events disabled.
 */
export function AmbientParticles({ density = 22 }: { density?: number }) {
  const dots = useMemo(() => Array.from({ length: density }), [density]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Conic aurora orbs */}
      <div
        className="absolute -top-40 left-1/2 h-[820px] w-[820px] -translate-x-1/2 rounded-full opacity-[0.18] blur-[160px] animate-aurora"
        style={{ background: "conic-gradient(from 120deg, var(--neon-purple), var(--neon-blue), var(--neon-cyan), var(--neon-purple))" }}
      />
      <div
        className="absolute bottom-[-30%] right-[-10%] h-[640px] w-[640px] rounded-full opacity-[0.12] blur-[160px] animate-aurora"
        style={{ background: "conic-gradient(from 0deg, var(--neon-blue), var(--neon-purple), transparent 70%)", animationDelay: "-9s" }}
      />

      {/* Drifting particles */}
      {dots.map((_, i) => {
        const left = (i * 41 + 7) % 100;
        const top = (i * 67 + 13) % 100;
        const size = 1.5 + (i % 4) * 0.75;
        const dur = 9 + (i % 6);
        const delay = (i % 9) * 0.5;
        const color = i % 3 === 0 ? "var(--neon-cyan)" : i % 3 === 1 ? "var(--neon-blue)" : "var(--neon-purple)";
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: color,
              boxShadow: `0 0 ${size * 6}px ${color}`,
            }}
            animate={{ y: [0, -40, 0], x: [0, (i % 2 ? 1 : -1) * 12, 0], opacity: [0.15, 0.85, 0.15] }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
          />
        );
      })}

      {/* Fine grid + noise */}
      <div className="absolute inset-0 grid-bg opacity-[0.25]" />
      <div className="absolute inset-0 noise opacity-30 mix-blend-overlay" />

      {/* Top neon scanline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent opacity-60" />
    </div>
  );
}
