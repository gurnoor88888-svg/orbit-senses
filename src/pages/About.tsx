import { StarField } from "@/components/mission/StarField";
import { Chip, OrbitMark, PageShell, TopNav } from "@/components/mission/Shell";
import { Meter } from "@/components/mission/panels";
import { CloudOff, BrainCircuit, Camera, Hand, Radar, ScrollText, ShieldCheck, Volume2 } from "lucide-react";

const STACK = [
  { icon: Camera, title: "Perception Layer", desc: "Fixed onboard cameras feed lightweight vision models: astronaut detection, pose estimation, hand tracking, and object detection with hand-object interaction analysis." },
  { icon: BrainCircuit, title: "Reasoning Layer", desc: "A sequence engine compares recognized activities against the experiment protocol in real time, tracking progress and validating each step before the next begins." },
  { icon: ShieldCheck, title: "Safety Layer", desc: "Deviations — out-of-order actions, missing verifications, proximity hazards — raise graded alerts from advisory warnings to critical stops." },
  { icon: Volume2, title: "Interaction Layer", desc: "Voice assistance delivers step-by-step coaching and hands-free confirmations so astronauts stay focused on the task, not the screen." },
  { icon: ScrollText, title: "Logging Layer", desc: "A local mission log records every perception event, alert and telemetry frame with MET timestamps for full post-session review." },
  { icon: CloudOff, title: "Sync Layer", desc: "Offline-first by design: during communication gaps nothing is lost. Buffered events uplink automatically when the link is restored." },
];

const METRICS = [
  { label: "ACTIVITY RECOGNITION ACCURACY (BENCH)", value: 94.2 },
  { label: "POSE KEYPOINT PRECISION", value: 91.8 },
  { label: "HAND-OBJECT INTERACTION F1", value: 89.5 },
  { label: "END-TO-END LATENCY TARGET (MS)", value: 82 },
];

export default function About() {
  return (
    <div className="relative min-h-screen">
      <StarField />
      <TopNav />
      <PageShell
        kicker="PROGRAM BRIEF · OS-DEMO-01"
        title="About Orbit Sense"
        description="An AI-based Human Activity Recognition concept for next-generation autonomous space missions — presented as a software prototype."
        right={<Chip tone="neutral">SOFTWARE PROTOTYPE · DEMO</Chip>}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-4">
            <section className="glass rounded-xl p-6">
              <div className="flex items-center gap-3">
                <OrbitMark className="size-9" />
                <h2 className="font-display text-lg font-semibold">Mission concept</h2>
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Orbit Sense is designed for future orbiting stations and lunar missions, where crew
                time is precious and ground contact is intermittent. Fixed cameras watch the
                experiment workspace; onboard AI converts raw video into structured understanding —
                which activity is running, which step is complete, and whether anything deviates
                from the procedure. Crew get instant voice feedback; ground teams get a complete,
                synchronized record of every session.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This site is an interactive software prototype that demonstrates the mission-control
                experience with a simulated camera feed and live demo telemetry. It is not connected
                to any spacecraft, station or flight hardware, and no component is space-qualified.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Chip tone="cyan">HUMAN ACTIVITY RECOGNITION</Chip>
                <Chip tone="cyan">POSE ESTIMATION</Chip>
                <Chip tone="cyan">HAND TRACKING</Chip>
                <Chip tone="neutral" className="border-violet-300/30 bg-violet-400/10 text-violet-200">OBJECT DETECTION</Chip>
                <Chip tone="green">SEQUENCE VALIDATION</Chip>
                <Chip tone="amber">REAL-TIME ALERTS</Chip>
                <Chip tone="neutral">VOICE ASSISTANCE</Chip>
                <Chip tone="neutral">OFFLINE + SYNC</Chip>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              {STACK.map((s) => (
                <section key={s.title} className="glass rounded-xl p-5">
                  <div className="mb-3 flex size-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <s.icon className="size-4" />
                  </div>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">{s.desc}</p>
                </section>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <section className="glass rounded-xl p-5">
              <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">BENCHMARK PROFILE</h2>
              <div className="mt-4 space-y-3.5">
                {METRICS.map((m) => (
                  <Meter key={m.label} label={m.label} value={m.value} tone="cyan" />
                ))}
              </div>
              <p className="mt-3 font-mono text-[10px] leading-4 text-muted-foreground">
                LAB BENCHMARK FIGURES · ILLUSTRATIVE · NOT FLIGHT DATA
              </p>
            </section>

            <section className="glass rounded-xl p-5">
              <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">DESIGN PRINCIPLES</h2>
              <ul className="mt-4 space-y-3 text-[13px] leading-5 text-muted-foreground">
                <li className="flex gap-2"><Radar className="mt-0.5 size-4 shrink-0 text-primary" />Autonomy first — the system must help without a ground link.</li>
                <li className="flex gap-2"><Hand className="mt-0.5 size-4 shrink-0 text-primary" />Hands-free — voice and vision, never screens mid-procedure.</li>
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />Explainable — every alert cites the rule and the evidence.</li>
                <li className="flex gap-2"><ScrollText className="mt-0.5 size-4 shrink-0 text-primary" />Complete records — lossless local logging, ordered sync.</li>
              </ul>
            </section>

            <section className="glass rounded-xl p-5">
              <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">ROADMAP (CONCEPT)</h2>
              <ol className="mt-4 space-y-3">
                {[
                  ["PHASE 1", "Lab prototype · bench datasets", "green"],
                  ["PHASE 2", "Parabolic-flight data collection", "cyan"],
                  ["PHASE 3", "ISS-class analog evaluation", "cyan"],
                  ["PHASE 4", "Flight qualification (target)", "neutral"],
                ].map(([phase, desc, tone]) => (
                  <li key={phase} className="flex items-center gap-3">
                    <Chip tone={tone as "green" | "cyan" | "neutral"}>{phase}</Chip>
                    <span className="text-[13px] text-muted-foreground">{desc}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
