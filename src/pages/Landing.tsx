import { StarField } from "@/components/mission/StarField";
import { Chip, OrbitMark, TopNav } from "@/components/mission/Shell";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CloudOff,
  Eye,
  Hand,
  Radar,
  ScrollText,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { Link } from "react-router";

const FEATURES = [
  { icon: Eye, title: "Activity Recognition", desc: "Onboard vision models identify astronaut activities in real time — no wearables required." },
  { icon: Radar, title: "Pose Estimation", desc: "17-keypoint skeletal tracking understands posture and motion even in confined modules." },
  { icon: Hand, title: "Gesture & Hand Tracking", desc: "Fine-grained hand tracking captures manipulation of tools and sample containers." },
  { icon: ShieldCheck, title: "Sequence Validation", desc: "Every procedural step is checked against the experiment protocol; deviations alert instantly." },
  { icon: Volume2, title: "Voice Assistance", desc: "Hands-free spoken guidance, confirmations and warnings during long experiment sessions." },
  { icon: CloudOff, title: "Offline Autonomy", desc: "Local mission logging and buffering with automatic sync when the link is restored." },
];

const PIPELINE = ["CAMERA FEED", "POSE + HAND", "OBJECT + INTERACT", "SEQUENCE AI", "ALERTS + LOG"];

export default function Landing() {
  return (
    <div className="relative min-h-screen">
      <StarField />
      <TopNav />

      {/* HERO */}
      <section className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Chip tone="cyan" className="mx-auto">DESIGNED FOR NEXT-GENERATION AUTONOMOUS SPACE MISSIONS</Chip>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="text-glow mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          INTELLIGENCE
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-sky-400 bg-clip-text text-transparent">
            BEYOND EARTH.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
        >
          AI-powered Human Activity Recognition for autonomous astronaut experiment monitoring.
          Orbit Sense transforms onboard camera feeds into real-time understanding of astronaut
          activities, experiment progress, and procedural deviations — even during communication
          gaps with Earth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="ring-glow gap-2 font-mono tracking-widest">
            <Link to="/monitor">
              LAUNCH MISSION CONSOLE <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border/70 bg-secondary/40 font-mono tracking-widest">
            <Link to="/about">EXPLORE SYSTEM</Link>
          </Button>
        </motion.div>

        {/* Hero visual: station + AI processing schematic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="glass relative mt-16 w-full max-w-4xl overflow-hidden rounded-2xl p-6 sm:p-10"
        >
          <div className="grid-overlay absolute inset-0 opacity-50" />
          <svg viewBox="0 0 800 340" className="relative w-full">
            <defs>
              <radialGradient id="earth" cx="0.35" cy="0.35" r="0.8">
                <stop offset="0%" stopColor="oklch(0.6 0.14 235)" />
                <stop offset="55%" stopColor="oklch(0.42 0.11 250)" />
                <stop offset="100%" stopColor="oklch(0.2 0.05 260)" />
              </radialGradient>
            </defs>
            {/* Earth arc */}
            <circle cx="120" cy="420" r="240" fill="url(#earth)" opacity="0.9" />
            <circle cx="120" cy="420" r="240" fill="none" stroke="oklch(0.83 0.135 214 / 0.5)" strokeWidth="1.5" />
            <circle cx="120" cy="420" r="252" fill="none" stroke="oklch(0.83 0.135 214 / 0.18)" strokeWidth="1" className="animate-dash" />

            {/* station */}
            <g className="animate-float" style={{ transformOrigin: "560px 120px" }}>
              <line x1="470" y1="120" x2="650" y2="120" stroke="oklch(0.85 0.05 230 / 0.7)" strokeWidth="4" strokeLinecap="round" />
              <rect x="440" y="104" width="60" height="32" rx="8" fill="oklch(0.3 0.05 250 / 0.9)" stroke="oklch(0.83 0.135 214 / 0.5)" />
              <rect x="620" y="104" width="60" height="32" rx="8" fill="oklch(0.3 0.05 250 / 0.9)" stroke="oklch(0.83 0.135 214 / 0.5)" />
              <rect x="516" y="112" width="88" height="16" rx="4" fill="oklch(0.24 0.04 255 / 0.9)" stroke="oklch(0.83 0.135 214 / 0.35)" />
              <circle cx="560" cy="120" r="4" fill="oklch(0.83 0.135 214)" />
            </g>

            {/* comms link */}
            <path d="M 210 210 C 300 120, 380 110, 470 122" fill="none" stroke="oklch(0.78 0.12 195 / 0.5)" strokeWidth="1.4" className="animate-dash" />
            <text x="250" y="150" className="fill-cyan-200/80" fontSize="10" fontFamily="monospace" letterSpacing="2">DOWNLINK · 2.4 Mb/s</text>

            {/* AI node */}
            <g>
              <rect x="620" y="220" width="150" height="76" rx="10" fill="oklch(0.2 0.035 255 / 0.85)" stroke="oklch(0.83 0.135 214 / 0.45)" />
              <text x="640" y="250" className="fill-cyan-200" fontSize="11" fontFamily="monospace" letterSpacing="2">AI PIPELINE</text>
              <text x="640" y="272" className="fill-cyan-200/60" fontSize="9" fontFamily="monospace">POSE · GESTURE · OBJECT</text>
              <circle cx="755" cy="238" r="3" className="animate-pulse-soft" fill="oklch(0.83 0.135 214)" />
            </g>
            <path d="M 640 142 L 680 218" fill="none" stroke="oklch(0.83 0.135 214 / 0.45)" strokeWidth="1.3" className="animate-dash" />
            <path d="M 695 296 L 620 336 L 300 336" fill="none" stroke="oklch(0.78 0.12 195 / 0.4)" strokeWidth="1.2" className="animate-dash" />
            <text x="330" y="326" className="fill-cyan-200/60" fontSize="9" fontFamily="monospace" letterSpacing="2">ALERTS · LOCAL LOG · SYNC</text>

            {/* camera feeds mini-panels */}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={300 + i * 86} y={236} width="74" height="50" rx="6" fill="oklch(0.18 0.03 258 / 0.9)" stroke="oklch(0.83 0.135 214 / 0.35)" />
                <rect x={308 + i * 86} y={244} width="24" height="18" rx="2" fill="oklch(0.83 0.135 214 / 0.25)" />
                <circle cx={340 + i * 86} cy={274} r="5" fill="none" stroke="oklch(0.83 0.135 214 / 0.6)" />
                <text x={312 + i * 86} y={280} fontSize="7" fontFamily="monospace" className="fill-cyan-200/70">CAM 0{i + 1}</text>
              </g>
            ))}
            <path d="M 402 208 L 402 234" stroke="oklch(0.83 0.135 214 / 0.4)" strokeWidth="1.2" className="animate-dash" />
          </svg>

          <div className="relative mt-2 flex flex-wrap items-center justify-center gap-2">
            <Chip tone="cyan">HAR</Chip>
            <Chip tone="neutral" className="border-violet-300/30 bg-violet-400/10 text-violet-200">OBJECT DETECTION</Chip>
            <Chip tone="green">SEQUENCE AI</Chip>
            <Chip tone="amber">ALERTS</Chip>
            <Chip tone="neutral">VOICE</Chip>
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-24 sm:px-6">
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-primary/80">CAPABILITIES</p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">One system. Full experiment awareness.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="glass group rounded-xl p-5 transition-all duration-300 hover:ring-glow"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary transition-shadow group-hover:shadow-[0_0_18px_oklch(0.83_0.135_214/0.35)]">
                <f.icon className="size-5" />
              </div>
              <h3 className="text-sm font-semibold tracking-wide">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PIPELINE STRIP */}
      <section className="relative z-10 border-y border-border/50 bg-secondary/20 py-10">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-center gap-x-4 gap-y-3 px-4 sm:px-6">
          {PIPELINE.map((p, i) => (
            <div key={p} className="flex items-center gap-4">
              <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">{p}</span>
              {i < PIPELINE.length - 1 && <ArrowRight className="size-3.5 text-primary/60" />}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto w-full max-w-[1600px] px-4 py-24 text-center sm:px-6">
        <BrainCircuit className="mx-auto size-10 text-primary" />
        <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
          Ready to enter the mission console?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Run the full Orbit Sense demo: live perception, sequence validation, alerts and offline sync.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="ring-glow gap-2 font-mono tracking-widest">
            <Link to="/monitor">OPEN LIVE MONITOR <ArrowRight className="size-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-border/70 bg-secondary/40 font-mono tracking-widest">
            <Link to="/activity-log">VIEW ACTIVITY LOG</Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div className="flex items-center gap-2">
            <OrbitMark className="size-5" />
            <span className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
              ORBITSENSE · AI ASTRONAUT ACTIVITY MONITORING
            </span>
          </div>
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground">
            <ScrollText className="size-3" /> SOFTWARE PROTOTYPE · DEMO ONLY · NOT SPACE-QUALIFIED
          </p>
        </div>
      </footer>
    </div>
  );
}
