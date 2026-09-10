import { StarField } from "@/components/mission/StarField";
import { Chip, PageShell, TopNav } from "@/components/mission/Shell";
import { EventFeed } from "@/components/mission/EventFeed";
import { useMission } from "@/components/mission/store";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Filter = "all" | "alerts" | "crit";

export default function ActivityLog() {
  const m = useMission();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      total: m.events.length,
      alerts: m.events.filter((e) => e.severity === "warn" || e.severity === "crit").length,
      crit: m.events.filter((e) => e.severity === "crit").length,
    }),
    [m.events],
  );

  const filtered = useMemo(() => {
    let evs = m.events;
    if (filter === "alerts") evs = evs.filter((e) => e.severity === "warn" || e.severity === "crit");
    if (filter === "crit") evs = evs.filter((e) => e.severity === "crit");
    if (query.trim()) {
      const q = query.toLowerCase();
      evs = evs.filter(
        (e) => e.message.toLowerCase().includes(q) || e.source.toLowerCase().includes(q),
      );
    }
    return evs;
  }, [m.events, filter, query]);

  return (
    <div className="relative min-h-screen">
      <StarField density={0.00008} />
      <TopNav />
      <PageShell
        kicker="LOCAL MISSION LOG · OFFLINE-FIRST"
        title="Activity Log"
        description="Every perception, validation and comms event is logged locally on the station and synced when possible."
        right={
          <div className="flex gap-2">
            <Chip tone="green">{counts.total} EVENTS</Chip>
            <Chip tone="amber">{counts.alerts} ALERTS</Chip>
            <Chip tone="red">{counts.crit} CRITICAL</Chip>
          </div>
        }
      >
        <div className="glass rounded-xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2">
              {(["all", "alerts", "crit"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] transition-all",
                    filter === f
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border/70 bg-secondary/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f === "all" ? "ALL EVENTS" : f === "alerts" ? "ALERTS" : "CRITICAL"}
                </button>
              ))}
            </div>
            <div className="relative sm:ml-auto sm:w-72">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search source or message…"
                className="h-9 w-full rounded-md border border-border/70 bg-secondary/40 pl-9 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 max-h-[62vh] space-y-2 overflow-y-auto pr-1">
            <EventFeed events={filtered} max={160} />
          </div>
          <p className="mt-3 font-mono text-[10px] text-muted-foreground">
            SHOWING {filtered.length} OF {m.events.length} EVENTS · OLDEST PRUNED AT 160 (DEMO BUFFER)
          </p>
        </div>
      </PageShell>
    </div>
  );
}
