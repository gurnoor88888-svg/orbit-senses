import { StarField } from "@/components/mission/StarField";
import { Chip, PageShell, TopNav } from "@/components/mission/Shell";
import { useMission, formatMET } from "@/components/mission/store";
import { Meter } from "@/components/mission/panels";
import { cn } from "@/lib/utils";
import { BatteryCharging, Cpu, Radio, Server, Thermometer, Wifi } from "lucide-react";

type Health = { label: string; value: number; icon: typeof Cpu; note: string };

function useHealth(): Health[] {
  const m = useMission();
  const base = [
    { label: "AI PIPELINE LOAD", value: 34 + (m.stepIndex * 7) % 12, icon: Cpu, note: "4 × NPU · 11 ms inference" },
    { label: "CAMERA BUS", value: 98.2, icon: Radio, note: "4 / 4 streams nominal" },
    { label: "LOCAL STORAGE", value: 41.6, icon: Server, note: "512 GB mission log · auto-prune on" },
    { label: "LINK BANDWIDTH", value: m.comms.status === "NOMINAL" ? 72 : 12, icon: Wifi, note: "Ka-band ground relay (sim)" },
    { label: "POWER", value: 87, icon: BatteryCharging, note: "Solar array + battery reserve" },
    { label: "THERMAL", value: 63, icon: Thermometer, note: "Radiator loop nominal" },
  ];
  return base;
}

function statusTone(v: number) {
  if (v >= 60) return { label: "NOMINAL", cls: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" };
  if (v >= 30) return { label: "WATCH", cls: "text-cyan-200 border-cyan-300/30 bg-cyan-400/10" };
  return { label: "DEGRADED", cls: "text-amber-300 border-amber-400/30 bg-amber-400/10" };
}

export default function SystemStatus() {
  const m = useMission();
  const health = useHealth();

  return (
    <div className="relative min-h-screen">
      <StarField density={0.00008} />
      <TopNav />
      <PageShell
        kicker="SPACECRAFT SUBSYSTEMS · OS-DEMO-01"
        title="System Status"
        description="Health of the Orbit Sense payload and its simulated host environment. All values are demo telemetry."
        right={<Chip tone="cyan">MET {formatMET(m.metSeconds)}</Chip>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {health.map((h) => {
            const st = statusTone(h.value);
            return (
              <section key={h.label} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                      <h.icon className="size-4" />
                    </div>
                    <span className="font-mono text-[11px] tracking-widest text-foreground/90">{h.label}</span>
                  </div>
                  <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-widest", st.cls)}>
                    {st.label}
                  </span>
                </div>
                <div className="mt-4">
                  <Meter label={h.note} value={h.value} tone={h.value >= 60 ? "green" : h.value >= 30 ? "cyan" : "amber"} />
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="glass rounded-xl p-5">
            <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">MODEL RUNTIMES</h2>
            <div className="mt-4 space-y-3.5">
              <Meter label="HAR Transformer · v2.4" value={94} tone="cyan" />
              <Meter label="Pose Estimation · HRNet-lite" value={91} tone="cyan" />
              <Meter label="Hand Tracker · MediaPipe-class" value={89} tone="amber" />
              <Meter label="Object Detection · YOLO-class" value={93} tone="violet" />
              <Meter label="Sequence Validator · rules + LLM" value={97} tone="green" />
            </div>
          </section>

          <section className="glass rounded-xl p-5">
            <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">EVENT LOG — SUBSYSTEM</h2>
            <div className="mt-4 space-y-2 font-mono text-[11px] leading-5">
              {m.events.slice(0, 8).map((e) => (
                <div key={e.id} className="flex gap-2 border-b border-border/40 pb-1.5 last:border-0">
                  <span className="text-muted-foreground">{e.met}</span>
                  <span className={cn(
                    e.severity === "crit" ? "text-red-300" : e.severity === "warn" ? "text-amber-300" : e.severity === "ok" ? "text-emerald-300" : "text-cyan-200",
                  )}>
                    [{e.source}]
                  </span>
                  <span className="min-w-0 flex-1 truncate text-foreground/80">{e.message}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="glass mt-4 rounded-xl p-5">
          <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">FAILOVER STATUS</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["PRIMARY PIPELINE", "ACTIVE", "green"],
              ["BACKUP PIPELINE", "HOT STANDBY", "cyan"],
              ["POWER FALLBACK", "ARMED", "cyan"],
              ["GROUND LINK", m.comms.status === "NOMINAL" ? "CONNECTED" : m.comms.status === "COMM GAP" ? "LOST — BUFFERING" : "RE-SYNC", m.comms.status === "NOMINAL" ? "green" : "amber"],
            ].map(([label, val, tone]) => (
              <div key={label} className="rounded-lg border border-border/60 bg-secondary/30 p-3">
                <p className="font-mono text-[9px] tracking-widest text-muted-foreground">{label}</p>
                <p className={cn(
                  "mt-1 font-mono text-xs",
                  tone === "green" ? "text-emerald-300" : tone === "amber" ? "text-amber-300" : "text-cyan-200",
                )}>
                  ● {val}
                </p>
              </div>
            ))}
          </div>
        </section>
      </PageShell>
    </div>
  );
}
