import { StarField } from "@/components/mission/StarField";
import { Chip, PageShell, TopNav } from "@/components/mission/Shell";
import { useMission, STEPS } from "@/components/mission/store";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CloudUpload, Database, HardDrive, Satellite } from "lucide-react";

function ChartCard({ children, title, badge }: { children: React.ReactNode; title: string; badge?: React.ReactNode }) {
  return (
    <section className="glass rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">{title}</h2>
        {badge}
      </div>
      {children}
    </section>
  );
}

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.17 0.03 264 / 95%)",
    border: "1px solid oklch(0.72 0.09 220 / 0.25)",
    borderRadius: 8,
    fontSize: 11,
    fontFamily: "monospace",
  },
  labelStyle: { color: "oklch(0.83 0.135 214)" },
  itemStyle: { color: "oklch(0.93 0.012 240)" },
};

export default function MissionData() {
  const m = useMission();
  const chartData = m.history.map((h, i) => ({ i, conf: h.conf }));
  const dist = STEPS.map((s, i) => ({
    step: s.id,
    detections: 40 + ((i * 37 + m.stats.activities * 13) % 60),
  }));

  return (
    <div className="relative min-h-screen">
      <StarField density={0.00008} />
      <TopNav />
      <PageShell
        kicker="TELEMETRY & ANALYTICS · OS-DEMO-01"
        title="Mission Data"
        description="Session telemetry from the simulated perception pipeline — captured locally, visualized on ground."
        right={<Chip tone="cyan"><Satellite className="size-3" /> UPLINK {m.comms.uplinked} PKTS</Chip>}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Database, label: "FRAMES PROCESSED", value: m.stats.frames.toLocaleString(), tone: "text-cyan-200" },
            { icon: HardDrive, label: "LOCAL BUFFER", value: `${m.comms.buffered} EVT`, tone: "text-amber-300" },
            { icon: CloudUpload, label: "UPLINKED EVENTS", value: m.comms.uplinked, tone: "text-emerald-300" },
            { icon: Database, label: "ACTIVITIES RECOGNIZED", value: m.stats.activities, tone: "text-violet-300" },
          ].map((c) => (
            <div key={c.label} className="glass rounded-xl p-5">
              <c.icon className="size-5 text-primary" />
              <p className={cn2(c.tone, "mt-3 font-mono text-2xl")}>{c.value}</p>
              <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ChartCard title="ACTIVITY CONFIDENCE — LAST 96s" badge={<Chip tone="green">LIVE</Chip>}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="confFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.83 0.135 214)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.83 0.135 214)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.72 0.09 220 / 0.12)" vertical={false} />
                  <XAxis dataKey="i" tick={{ fill: "oklch(0.64 0.035 248)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[80, 100]} tick={{ fill: "oklch(0.64 0.035 248)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="conf" stroke="oklch(0.83 0.135 214)" strokeWidth={2} fill="url(#confFill)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="DETECTIONS PER STEP — THIS SESSION" badge={<Chip tone="neutral">SIM</Chip>}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dist} margin={{ top: 5, right: 5, bottom: 0, left: -18 }}>
                  <CartesianGrid stroke="oklch(0.72 0.09 220 / 0.12)" vertical={false} />
                  <XAxis dataKey="step" tick={{ fill: "oklch(0.64 0.035 248)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.64 0.035 248)", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                  <Tooltip {...tooltipStyle} cursor={{ fill: "oklch(0.83 0.135 214 / 0.06)" }} />
                  <Bar dataKey="detections" fill="oklch(0.78 0.12 195)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <section className="glass mt-4 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">DATA FLOW — OFFLINE-FIRST ARCHITECTURE</h2>
            <Chip tone={m.comms.status === "NOMINAL" ? "green" : m.comms.status === "COMM GAP" ? "amber" : "cyan"}>
              {m.comms.status}
            </Chip>
          </div>
          <div className="mt-4 flex flex-col items-center gap-3 md:flex-row md:justify-between">
            {["CAMERAS", "AI PIPELINE", "LOCAL MISSION LOG", "GROUND ARCHIVE"].map((node, i) => (
              <div key={node} className="flex items-center gap-3">
                <div className="glass rounded-lg px-4 py-3 text-center">
                  <p className="font-mono text-[11px] tracking-widest text-foreground/90">{node}</p>
                </div>
                {i < 3 && <span className="font-mono text-[10px] text-primary/70">→</span>}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
            During communication gaps the local mission log continues to capture perception events,
            poses and alerts. When the link is restored, buffered events are uplinked in order with
            integrity verification — the ground archive always receives the complete record.
          </p>
        </section>
      </PageShell>
    </div>
  );
}

function cn2(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}
