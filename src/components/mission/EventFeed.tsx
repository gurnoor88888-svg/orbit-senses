import { useMission } from "@/components/mission/store";
import { Chip } from "@/components/mission/Shell";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const SEVERITY_META: Record<
  string,
  { label: string; cls: string; dot: string }
> = {
  ok: { label: "OK", cls: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10", dot: "bg-emerald-400" },
  info: { label: "INFO", cls: "text-cyan-200 border-cyan-300/30 bg-cyan-400/10", dot: "bg-cyan-300" },
  warn: { label: "WARN", cls: "text-amber-300 border-amber-400/30 bg-amber-400/10", dot: "bg-amber-400" },
  crit: { label: "CRITICAL", cls: "text-red-300 border-red-400/30 bg-red-400/10", dot: "bg-red-400" },
};

export function EventRow({ event }: { event: ReturnType<typeof useMission>["events"][number] }) {
  const meta = SEVERITY_META[event.severity];
  return (
    <div
      className={cn(
        "flex items-start gap-3 border-l-2 bg-secondary/20 px-3 py-2.5",
        event.severity === "crit"
          ? "border-red-400/60"
          : event.severity === "warn"
            ? "border-amber-400/50"
            : event.severity === "ok"
              ? "border-emerald-400/40"
              : "border-cyan-300/25",
      )}
    >
      <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", meta.dot)} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded border px-1.5 py-0.5 font-mono text-[9px] tracking-widest", meta.cls)}>
            {meta.label}
          </span>
          <span className="font-mono text-[10px] text-primary/80">{event.source}</span>
          <span className="font-mono text-[10px] text-muted-foreground">{event.met}</span>
        </div>
        <p className="mt-1 text-[13px] leading-5 text-foreground/90">{event.message}</p>
      </div>
    </div>
  );
}

export function EventFeed({
  filter,
  max,
  events: eventsProp,
}: {
  filter?: "all" | "alerts";
  max?: number;
  events?: ReturnType<typeof useMission>["events"];
}) {
  const m = useMission();
  const events = useMemo(() => {
    if (eventsProp) return max ? eventsProp.slice(0, max) : eventsProp;
    let evs = m.events;
    if (filter === "alerts") evs = evs.filter((e) => e.severity === "warn" || e.severity === "crit");
    return max ? evs.slice(0, max) : evs;
  }, [m.events, eventsProp, filter, max]);

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {events.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            layout
          >
            <EventRow event={e} />
          </motion.div>
        ))}
      </AnimatePresence>
      {events.length === 0 && (
        <p className="py-8 text-center font-mono text-xs text-muted-foreground">NO EVENTS MATCH FILTER</p>
      )}
    </div>
  );
}
