import { useMission, STEPS, EXPERIMENT, formatMET } from "@/components/mission/store";
import { Chip } from "@/components/mission/Shell";
import { cn } from "@/lib/utils";
import { CheckCircle2, Mic, MicOff, Volume2 } from "lucide-react";
import { toggleVoice } from "@/components/mission/store";
import { useEffect, useRef } from "react";

export function Meter({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: number;
  tone?: "cyan" | "amber" | "violet" | "green";
}) {
  const tones = {
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
    violet: "bg-violet-400",
    green: "bg-emerald-400",
  } as const;
  const text = {
    cyan: "text-cyan-200",
    amber: "text-amber-200",
    violet: "text-violet-200",
    green: "text-emerald-200",
  } as const;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn("font-mono text-xs", text[tone])}>{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/70">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", tones[tone])}
          style={{ width: `${value}%`, boxShadow: "0 0 10px oklch(0.83 0.135 214 / 0.5)" }}
        />
      </div>
    </div>
  );
}

export function CurrentActivityPanel() {
  const m = useMission();
  const step = STEPS[m.stepIndex];
  const next = STEPS[(m.stepIndex + 1) % STEPS.length];
  const justVerified = m.metSeconds - m.verifiedAt < 3;

  return (
    <section className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">CURRENT ACTIVITY</h2>
        <Chip tone="cyan">{step.id} / 05</Chip>
      </div>

      <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-primary text-glow">
        {step.name}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{step.detail}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">CONFIDENCE</p>
          <p className="mt-1 font-mono text-xl text-cyan-200">{Math.round(m.activityConfidence)}%</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">STATUS</p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1.5 font-mono text-xs",
              justVerified ? "animate-pulse-soft text-emerald-300" : "text-emerald-300",
            )}
          >
            <CheckCircle2 className="size-3.5" />
            {justVerified ? "STEP VERIFIED ✓" : "STEP VERIFIED"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
          <span>STEP PROGRESS</span>
          <span>{Math.round(m.stepProgress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-700"
            style={{ width: `${m.stepProgress}%`, boxShadow: "0 0 12px oklch(0.83 0.135 214 / 0.55)" }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-border/60 bg-primary/5 px-3 py-2.5">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">NEXT STEP</p>
          <p className="text-sm font-medium text-foreground">{next.name}</p>
        </div>
        <Chip tone="neutral">{next.id} / 05</Chip>
      </div>
    </section>
  );
}

export function PerceptionPanel() {
  const m = useMission();
  const rows: { label: string; value: number; tone: "cyan" | "amber" | "violet" | "green" }[] = [
    { label: "Astronaut", value: m.perception.astronaut, tone: "cyan" },
    { label: "Container", value: m.perception.container, tone: "violet" },
    { label: "Right Hand", value: m.perception.rightHand, tone: "amber" },
    { label: "Left Hand", value: m.perception.leftHand, tone: "amber" },
    { label: "Interaction", value: m.perception.interaction, tone: "green" },
  ];
  return (
    <section className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">AI PERCEPTION</h2>
        <Chip tone="green">TRACKING</Chip>
      </div>
      <div className="mt-4 space-y-3.5">
        {rows.map((r) => (
          <Meter key={r.label} label={r.label} value={r.value} tone={r.tone} />
        ))}
      </div>
    </section>
  );
}

export function StepTimeline() {
  const m = useMission();
  return (
    <section className="glass rounded-xl p-5">
      <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">SEQUENCE PROGRESS</h2>
      <ol className="mt-4 space-y-0">
        {STEPS.map((s, i) => {
          const verified = m.stepVerifiedAt[i] != null || i < m.stepIndex;
          const active = i === m.stepIndex;
          return (
            <li key={s.id} className="relative flex gap-3 pb-5 last:pb-0">
              {i < STEPS.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[9px] top-5 h-full w-px",
                    verified ? "bg-primary/50" : "bg-border",
                  )}
                />
              )}
              <span
                className={cn(
                  "z-10 mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border font-mono text-[9px]",
                  verified && "border-primary bg-primary/20 text-primary",
                  active && !verified && "border-primary bg-primary/10 text-primary",
                  !verified && !active && "border-border bg-secondary/40 text-muted-foreground",
                )}
              >
                {verified ? "✓" : s.id}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-primary" : verified ? "text-foreground/90" : "text-muted-foreground",
                  )}
                >
                  {s.name}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{s.detail}</p>
              </div>
              {verified && m.stepVerifiedAt[i] != null && (
                <span className="font-mono text-[10px] text-muted-foreground">{formatMET(m.stepVerifiedAt[i]!)}</span>
              )}
              {active && !verified && <Chip tone="cyan" className="self-center">ACTIVE</Chip>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function VoicePanel() {
  const m = useMission();
  const lastId = useRef(m.voice.id);
  useEffect(() => {
    lastId.current = m.voice.id;
  }, [m.voice.id]);

  return (
    <section className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">VOICE ASSISTANCE</h2>
        <button
          onClick={toggleVoice}
          className={cn(
            "flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all",
            m.voice.enabled
              ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_14px_oklch(0.83_0.135_214/0.25)]"
              : "border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground",
          )}
        >
          {m.voice.enabled ? <Mic className="size-3.5" /> : <MicOff className="size-3.5" />}
          {m.voice.enabled ? "ENABLED" : "MUTED"}
        </button>
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3">
        <Volume2 className={cn("mt-0.5 size-4 shrink-0 text-primary", m.voice.enabled && "animate-pulse-soft")} />
        <p className="text-sm leading-5 text-foreground/90">{m.voice.announcement}</p>
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">
        COACHING · DEVIATION WARNINGS · HANDS-FREE QUERIES (DEMO TTS)
      </p>
    </section>
  );
}

export function CommsPanel() {
  const m = useMission();
  const tone =
    m.comms.status === "NOMINAL" ? "green" : m.comms.status === "COMM GAP" ? "amber" : "cyan";
  return (
    <section className="glass rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">COMMS & SYNC</h2>
        <Chip tone={tone}>{m.comms.status}</Chip>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-lg text-amber-300">{m.comms.buffered}</p>
          <p className="mt-0.5 font-mono text-[9px] tracking-widest text-muted-foreground">BUFFERED</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-lg text-cyan-200">{m.comms.uplinked}</p>
          <p className="mt-0.5 font-mono text-[9px] tracking-widest text-muted-foreground">UPLINKED</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-lg text-emerald-300">100%</p>
          <p className="mt-0.5 font-mono text-[9px] tracking-widest text-muted-foreground">INTEGRITY</p>
        </div>
      </div>
      <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
        All perception events are logged locally on the station and synchronized to ground when the
        link is restored. Offline-first by design.
      </p>
    </section>
  );
}

export function ExperimentHeaderCard() {
  return (
    <section className="glass rounded-xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.25em] text-primary/80">{EXPERIMENT.id}</p>
          <h2 className="mt-1 font-display text-lg font-semibold">{EXPERIMENT.name}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {EXPERIMENT.station} · {EXPERIMENT.crew}
          </p>
        </div>
        <div className="flex gap-2">
          <Chip tone="cyan">RUNNING</Chip>
          <Chip tone="neutral">5 STEPS</Chip>
        </div>
      </div>
    </section>
  );
}
