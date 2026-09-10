import { useEffect, useMemo, useState } from "react";
import { useMission, formatMET } from "@/components/mission/store";
import { Chip } from "@/components/mission/Shell";
import { AstronautSilhouette, CAMS, DetectionOverlay } from "@/components/mission/cam-scene";
import { cn } from "@/lib/utils";
import { Maximize2, Pause, Play } from "lucide-react";

export function CameraFeed() {
  const [camIdx, setCamIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [showPose, setShowPose] = useState(true);
  const [frameTick, setFrameTick] = useState(0);
  const met = useMission().metSeconds;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setFrameTick((t) => t + 1), 120);
    return () => clearInterval(id);
  }, [playing]);

  const scene = CAMS[camIdx];
  // gentle per-frame jitter of overlay positions to feel "live"
  const jittered = useMemo(() => {
    const j = (v: number, amt: number) => v + Math.sin(frameTick / 7 + v) * amt;
    return {
      boxes: scene.boxes.map((b) => ({ ...b, x: j(b.x, 0.35), y: j(b.y, 0.3) })),
      pose: { ...scene.pose, pts: scene.pose.pts.map(([x, y]) => [j(x, 0.5), j(y, 0.45)]) as [number, number][] },
      hands: scene.hands.map(([x, y]) => [j(x, 0.6), j(y, 0.55)] as [number, number]),
    };
  }, [scene, frameTick]);

  return (
    <section className="glass flex h-full flex-col overflow-hidden rounded-xl">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] text-red-300">
            <span className="animate-blink inline-block size-2 rounded-full bg-red-400" /> REC
          </span>
          <h2 className="font-mono text-xs tracking-[0.22em] text-foreground/90">
            LIVE CAMERA FEED — {scene.name}
          </h2>
        </div>
        <span className="hidden font-mono text-[11px] text-muted-foreground sm:block">{formatMET(met)}</span>
      </div>

      {/* feed */}
      <div className="scanlines relative aspect-video w-full overflow-hidden bg-[oklch(0.13_0.03_255)]">
        {/* environment backdrop */}
        <div className="grid-overlay absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,oklch(0.3_0.06_230/0.35),transparent_60%)]" />
        {/* rack hint shapes */}
        <div className="absolute left-[4%] top-[46%] hidden h-[26%] w-[15%] rounded-sm border border-cyan-200/10 bg-cyan-300/5 sm:block" />
        <div className="absolute right-[4%] top-[20%] hidden h-[34%] w-[30%] rounded-sm border border-cyan-200/10 bg-cyan-300/5 sm:block" />

        {/* astronaut */}
        <div className={cn("absolute inset-0 flex items-end justify-center", camIdx === 3 && "justify-start pl-[6%]")}>
          <AstronautSilhouette
            className={cn(
              "h-[86%] animate-float opacity-90 drop-shadow-[0_0_24px_oklch(0.83_0.135_214/0.18)]",
              camIdx === 1 && "h-[70%] -translate-y-6",
              camIdx === 2 && "h-[78%] -translate-x-10",
            )}
          />
        </div>

        {/* scan sweep */}
        <div className="animate-scan absolute left-0 h-10 w-full bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />

        <DetectionOverlay
          boxes={jittered.boxes}
          pose={jittered.pose}
          hands={jittered.hands}
          showBoxes={showBoxes}
          showPose={showPose}
        />

        {/* corner ticks + HUD */}
        <div className="pointer-events-none absolute inset-3">
          <span className="absolute left-0 top-0 size-4 border-l-2 border-t-2 border-cyan-300/60" />
          <span className="absolute right-0 top-0 size-4 border-r-2 border-t-2 border-cyan-300/60" />
          <span className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-cyan-300/60" />
          <span className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-cyan-300/60" />
        </div>
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
          <Chip tone="cyan">ASTRONAUT DETECTED</Chip>
          <Chip tone="neutral">CONFIDENCE 96%</Chip>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] leading-4 text-cyan-200/70">
          <div>{scene.view}</div>
          <div>1080p · 30 FPS · LOCAL BUFFER ON</div>
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] text-cyan-200/70">
          AI PIPELINE v2.4 · DEMO SIM
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3">
        {CAMS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setCamIdx(i)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] transition-all",
              i === camIdx
                ? "border-primary/50 bg-primary/15 text-primary shadow-[0_0_14px_oklch(0.83_0.135_214/0.25)]"
                : "border-border/70 bg-secondary/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {c.name}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowBoxes((v) => !v)}
            className={cn(
              "rounded-md border px-2.5 py-1.5 font-mono text-[10px] tracking-wider transition-colors",
              showBoxes ? "border-primary/40 bg-primary/10 text-primary" : "border-border/70 text-muted-foreground",
            )}
          >
            BOXES
          </button>
          <button
            onClick={() => setShowPose((v) => !v)}
            className={cn(
              "rounded-md border px-2.5 py-1.5 font-mono text-[10px] tracking-wider transition-colors",
              showPose ? "border-primary/40 bg-primary/10 text-primary" : "border-border/70 text-muted-foreground",
            )}
          >
            POSE
          </button>
          <button
            onClick={() => setPlaying((v) => !v)}
            className="rounded-md border border-border/70 bg-secondary/40 p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={playing ? "Pause simulation" : "Resume simulation"}
          >
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
          <button
            className="rounded-md border border-border/70 bg-secondary/40 p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Fullscreen (demo)"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
