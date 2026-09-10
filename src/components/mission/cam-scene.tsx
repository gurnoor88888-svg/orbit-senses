export interface CamBox {
  label: string;
  conf: number;
  x: number; // percent of frame
  y: number;
  w: number;
  h: number;
  tone?: "cyan" | "amber" | "violet";
}

export interface CamScene {
  name: string;
  view: string;
  boxes: CamBox[];
  pose: { pts: [number, number][]; links: [number, number][] };
  hands: [number, number][];
}

const skeletonLinks: [number, number][] = [
  [0, 1], [1, 2], [2, 3],
  [1, 4], [4, 5],
  [1, 6], [6, 7], [7, 8], [8, 9],
  [6, 10], [10, 11],
];

export const CAMS: CamScene[] = [
  {
    name: "CAM 01",
    view: "LAB MODULE 2 · WORKBENCH",
    boxes: [
      { label: "ASTRONAUT", conf: 96, x: 30, y: 14, w: 40, h: 72, tone: "cyan" },
      { label: "SAMPLE CONTAINER S-114", conf: 94, x: 62, y: 55, w: 16, h: 14, tone: "violet" },
      { label: "TOOL RACK", conf: 90, x: 4, y: 46, w: 15, h: 26 },
      { label: "GLOVE · R HAND", conf: 92, x: 57, y: 47, w: 8, h: 8, tone: "amber" },
    ],
    pose: {
      pts: [
        [50, 18], [50, 30], [42, 38], [38, 50],
        [58, 38], [63, 50], [44, 33], [56, 33],
        [44, 52], [44, 68], [56, 52], [56, 68],
      ],
      links: skeletonLinks,
    },
    hands: [[61, 51], [40, 51]],
  },
  {
    name: "CAM 02",
    view: "OVERHEAD · BENCH TOP",
    boxes: [
      { label: "ASTRONAUT (TORSO)", conf: 93, x: 26, y: 22, w: 48, h: 56 },
      { label: "CONTAINER + LID", conf: 95, x: 60, y: 50, w: 18, h: 16, tone: "violet" },
      { label: "SYRINGE PROBE", conf: 88, x: 30, y: 66, w: 20, h: 7 },
      { label: "GLOVE · L HAND", conf: 89, x: 34, y: 58, w: 8, h: 8, tone: "amber" },
    ],
    pose: {
      pts: [
        [46, 12], [50, 26], [40, 34], [34, 46],
        [60, 34], [66, 46], [42, 28], [58, 28],
        [42, 56], [42, 72], [58, 56], [58, 72],
      ],
      links: skeletonLinks,
    },
    hands: [[64, 52], [37, 60]],
  },
  {
    name: "CAM 03",
    view: "AFT BULKHEAD · WIDE",
    boxes: [
      { label: "ASTRONAUT", conf: 91, x: 22, y: 18, w: 30, h: 70, tone: "cyan" },
      { label: "EQUIPMENT RACK B", conf: 87, x: 62, y: 26, w: 30, h: 44 },
      { label: "SAMPLE CONTAINER", conf: 90, x: 40, y: 52, w: 12, h: 12, tone: "violet" },
    ],
    pose: {
      pts: [
        [36, 24], [36, 38], [28, 44], [24, 56],
        [44, 44], [48, 56], [30, 40], [42, 40],
        [30, 62], [30, 78], [44, 62], [44, 78],
      ],
      links: skeletonLinks,
    },
    hands: [[47, 55], [26, 57]],
  },
  {
    name: "CAM 04",
    view: "STOWAGE BAY · PORT",
    boxes: [
      { label: "ASTRONAUT (PARTIAL)", conf: 84, x: 8, y: 24, w: 30, h: 64 },
      { label: "STOWAGE LOCKER 7", conf: 92, x: 52, y: 20, w: 40, h: 34 },
      { label: "CONTAINER STOWED", conf: 89, x: 62, y: 58, w: 18, h: 15, tone: "violet" },
    ],
    pose: {
      pts: [
        [20, 30], [22, 44], [16, 52], [12, 62],
        [28, 52], [32, 62], [18, 46], [26, 46],
        [18, 72], [18, 86], [30, 72], [30, 86],
      ],
      links: skeletonLinks,
    },
    hands: [[30, 61], [14, 63]],
  },
];

const TONE_STROKE: Record<string, string> = {
  cyan: "stroke-cyan-300",
  amber: "stroke-amber-300",
  violet: "stroke-violet-300",
};

const TONE_TEXT: Record<string, string> = {
  cyan: "text-cyan-200 border-cyan-300/40 bg-cyan-400/10",
  amber: "text-amber-200 border-amber-300/40 bg-amber-400/10",
  violet: "text-violet-200 border-violet-300/40 bg-violet-400/10",
};

/** Astronaut silhouette rendered as simple vector body + helmet glow. */
export function AstronautSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 320" className={className} aria-hidden>
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.06 230 / 0.5)" />
          <stop offset="100%" stopColor="oklch(0.55 0.05 250 / 0.28)" />
        </linearGradient>
        <radialGradient id="helmet" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="oklch(0.85 0.09 215 / 0.75)" />
          <stop offset="100%" stopColor="oklch(0.6 0.08 235 / 0.35)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="52" r="30" fill="url(#helmet)" />
      <circle cx="100" cy="52" r="30" fill="none" stroke="oklch(0.85 0.09 215 / 0.6)" strokeWidth="2" />
      <rect x="64" y="88" width="72" height="104" rx="22" fill="url(#body)" />
      <rect x="70" y="118" width="60" height="26" rx="8" fill="oklch(0.83 0.135 214 / 0.22)" />
      <rect x="38" y="96" width="22" height="92" rx="11" fill="url(#body)" />
      <rect x="140" y="96" width="22" height="92" rx="11" fill="url(#body)" />
      <circle cx="49" cy="192" r="12" fill="oklch(0.85 0.09 215 / 0.55)" />
      <circle cx="151" cy="192" r="12" fill="oklch(0.85 0.09 215 / 0.55)" />
      <rect x="72" y="196" width="24" height="96" rx="12" fill="url(#body)" />
      <rect x="104" y="196" width="24" height="96" rx="12" fill="url(#body)" />
      <rect x="30" y="122" width="38" height="10" rx="5" fill="oklch(0.78 0.12 195 / 0.4)" />
      <rect x="132" y="122" width="38" height="10" rx="5" fill="oklch(0.78 0.12 195 / 0.4)" />
    </svg>
  );
}

export function DetectionOverlay({
  boxes,
  pose,
  hands,
  showPose,
  showBoxes,
}: {
  boxes: CamBox[];
  pose: CamScene["pose"];
  hands: [number, number][];
  showPose: boolean;
  showBoxes: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {showBoxes &&
        boxes.map((b) => (
          <div
            key={b.label}
            className="absolute"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
          >
            <div
              className={`h-full w-full rounded-sm border ${TONE_STROKE[b.tone ?? "cyan"]} border-dashed opacity-70`}
              style={{
                clipPath:
                  "polygon(0 0,28% 0,28% 2px,0 2px,0 0,0 28%,2px 28%,2px 0) , polygon(100% 0,72% 0,72% 2px,100% 2px,100% 0,100% 28%,98% 28%,98% 0), polygon(0 100%,28% 100%,28% 98%,0 98%,0 100%,0 72%,2px 72%,2px 100%), polygon(100% 100%,72% 100%,72% 98%,100% 98%,100% 100%,100% 72%,98% 72%,98% 100%)",
              }}
            />
            <span
              className={`absolute -top-5 left-0 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[9px] leading-none ${TONE_TEXT[b.tone ?? "cyan"]}`}
            >
              {b.label} · {b.conf}%
            </span>
          </div>
        ))}

      {showPose && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {pose.links.map(([a, b], i) => (
            <line
              key={i}
              x1={pose.pts[a][0]}
              y1={pose.pts[a][1]}
              x2={pose.pts[b][0]}
              y2={pose.pts[b][1]}
              className="stroke-cyan-300/80"
              strokeWidth="0.35"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {pose.pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="0.6" className="fill-cyan-200" vectorEffect="non-scaling-stroke" />
          ))}
          {hands.map(([x, y], i) => (
            <g key={`h${i}`}>
              <circle cx={x} cy={y} r="2.4" className="fill-none stroke-amber-300" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
              <circle cx={x} cy={y} r="0.7" className="fill-amber-300" />
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}
