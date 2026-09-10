import { StarField } from "@/components/mission/StarField";
import { Chip, PageShell, TopNav } from "@/components/mission/Shell";
import { CameraFeed } from "@/components/mission/CameraFeed";
import { CommsPanel, CurrentActivityPanel, PerceptionPanel } from "@/components/mission/panels";
import { EventFeed } from "@/components/mission/EventFeed";
import { useMission, formatMET } from "@/components/mission/store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function METClock() {
  const met = useMission().metSeconds;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="glass flex items-center gap-3 rounded-lg px-4 py-2.5">
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground">MET</span>
      <span className={cn("font-mono text-lg text-primary", mounted && "tabular-nums")}>{formatMET(met)}</span>
      <Chip tone="cyan">ELAPSED</Chip>
    </div>
  );
}

function LiveAlerts() {
  const m = useMission();
  const latestAlert = m.events.find((e) => e.severity === "warn" || e.severity === "crit");
  if (!latestAlert) return null;
  return (
    <div
      className={cn(
        "glass flex items-center gap-3 rounded-lg border-l-2 px-4 py-2.5",
        latestAlert.severity === "crit" ? "border-l-red-400" : "border-l-amber-400",
      )}
    >
      <span
        className={cn(
          "animate-blink size-2 rounded-full",
          latestAlert.severity === "crit" ? "bg-red-400" : "bg-amber-400",
        )}
      />
      <p className="truncate text-[13px] text-foreground/90">
        <span className={cn("font-mono text-[10px] tracking-widest", latestAlert.severity === "crit" ? "text-red-300" : "text-amber-300")}>
          {latestAlert.severity === "crit" ? "CRITICAL " : "WARNING "}
        </span>
        {latestAlert.source} — {latestAlert.message}
      </p>
    </div>
  );
}

export default function Monitor() {
  return (
    <div className="relative min-h-screen">
      <StarField density={0.00008} />
      <TopNav />
      <PageShell
        kicker="MISSION CONTROL · OS-DEMO-01"
        title="Live Monitoring"
        description="Real-time camera perception, activity recognition and experiment status — simulated feed for demo purposes."
        right={<METClock />}
      >
        <div className="mb-4">
          <LiveAlerts />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <CameraFeed />
          <div className="flex flex-col gap-4">
            <CurrentActivityPanel />
            <PerceptionPanel />
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="glass rounded-xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">LIVE EVENTS</h2>
              <Chip tone="neutral">STREAM</Chip>
            </div>
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              <EventFeed max={12} />
            </div>
          </section>
          <CommsPanel />
        </div>
      </PageShell>
    </div>
  );
}
