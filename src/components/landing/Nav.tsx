import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Nav() {
  const links = ["Product", "Agents", "Pricing", "Docs"];
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 inset-x-0 z-50 mx-auto max-w-6xl px-4"
    >
      <nav className="glass-premium relative flex items-center justify-between rounded-full px-5 py-2.5 shadow-elegant transition-shadow duration-500 hover:shadow-glow-purple">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-primary shadow-glow-purple">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">FounderVerse</span>
        </a>
        <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="relative transition-colors hover:text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-[var(--neon-purple)] after:to-[var(--neon-blue)] after:transition-transform after:duration-300 hover:after:scale-x-100">{l}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link to="/investor" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition-colors">AI Investor</Link>
          <Link to="/simulator" className="shimmer-btn relative rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow-purple transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_var(--neon-purple)]">
            <span className="relative z-10">Launch Sim</span>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}