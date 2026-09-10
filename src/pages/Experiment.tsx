import { StarField } from "@/components/mission/StarField";
import { Chip, PageShell, TopNav } from "@/components/mission/Shell";
import {
  ExperimentHeaderCard,
  PerceptionPanel,
  StepTimeline,
  VoicePanel,
} from "@/components/mission/panels";
import { EventFeed } from "@/components/mission/EventFeed";
import { useMission, STEPS, EXPERIMENT } from "@/components/mission/store";
import { cn } from "@/lib/utils";
import { FlaskConical } from "lucide-react";

function ProgressRing({ value, stepIndex }: { value: number; stepIndex: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="glass flex items-center gap-6 rounded-xl p-5">
      <div className="relative size-32 shrink-0">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="oklch(0.72 0.09 220 / 0.15)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="oklch(0.83 0.135 214)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - value / 100)}
            style={{ transition: "stroke-dashoffset 0.8s ease", filter: "drop-shadow(0 0 8px oklch(0.83 0.135 214 / 0.6))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl text-primary">{Math.round(value)}%</span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">SEQUENCE</span>
        </div>
      </div>
      <div>
        <p className="font-mono text-[10px] tracking-widest text-muted-foreground">OVERALL COMPLETION</p>
        <p className="mt-1 text-sm text-foreground/90">
          {stepIndex} of {STEPS.length} steps verified this cycle
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Validator checks pose, hand trajectory and object state at every step.
        </p>
      </div>
    </div>
  );
}

export default function Experiment() {
  const m = useMission();
  const completedBefore = m.stepIndex;

  return (
    <div className="relative min-h-screen">
      <StarField density={0.00008} />
      <TopNav />
      <PageShell
        kicker="EXPERIMENT SEQUENCE · EXP-114"
        title="Experiment Monitor"
        description="Step-by-step AI validation of the running experiment protocol, with voice guidance and deviation alerts."
        right={
          <Chip tone="cyan" className="gap-2">
            <FlaskConical className="size-3" /> {EXPERIMENT.id}
          </Chip>
        }
      >
        <div className="grid gap-4">
          <ExperimentHeaderCard />
          <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
            <div className="flex flex-col gap-4">
              <ProgressRing
                value={(completedBefore / STEPS.length) * 100 + m.stepProgress * (1 / STEPS.length)}
                stepIndex={completedBefore}
              />
              <StepTimeline />
              <section className="glass rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">VALIDATOR STREAM</h2>
                  <Chip tone="neutral">RULE ENGINE</Chip>
                </div>
                <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                  <EventFeed max={14} />
                </div>
              </section>
            </div>
            <div className="flex flex-col gap-4">
              <CurrentActivityMini />
              <VoicePanel />
              <PerceptionPanel />
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}

function CurrentActivityMini() {
  const m = useMission();
  const step = STEPS[m.stepIndex];
  return (
    <section className="glass rounded-xl p-5">
      <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">NOW EXECUTING</h2>
      <p className="mt-3 font-display text-xl font-semibold text-primary text-glow">{step.name}</p>
      <p className="mt-1 text-xs text-muted-foreground">{step.detail}</p>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary/70">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-700")}
          style={{ width: `${m.stepProgress}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>STEP {step.id} / 05</span>
        <span>{Math.round(m.stepProgress)}% · CONF {Math.round(m.activityConfidence)}%</span>
      </div>
    </section>
  );
}
