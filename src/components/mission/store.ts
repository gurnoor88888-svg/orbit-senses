import { useSyncExternalStore } from "react";

export type Severity = "ok" | "info" | "warn" | "crit";

export interface LogEvent {
  id: number;
  ts: number;
  met: string;
  severity: Severity;
  source: string;
  message: string;
}

export interface MissionState {
  wall: number;
  metSeconds: number;
  stepIndex: number;
  stepProgress: number;
  verifiedAt: number;
  activityConfidence: number;
  perception: {
    astronaut: number;
    container: number;
    rightHand: number;
    leftHand: number;
    interaction: number;
  };
  events: LogEvent[];
  comms: { status: "NOMINAL" | "COMM GAP" | "SYNCING"; buffered: number; uplinked: number; gapTicksLeft: number };
  voice: { enabled: boolean; announcement: string; id: number };
  history: { t: number; conf: number }[];
  stepVerifiedAt: (number | null)[];
  stats: { activities: number; anomalies: number; frames: number };
}

export const STEPS = [
  { id: "01", name: "SECURE WORKSPACE", detail: "Stow loose items · confirm crew restraint" },
  { id: "02", name: "PICK CONTAINER", detail: "Grasp sample container S-114 from rack" },
  { id: "03", name: "OPEN CONTAINER", detail: "Rotate lock ring counter-clockwise" },
  { id: "04", name: "EXTRACT SAMPLE", detail: "Draw 20 ml via syringe probe" },
  { id: "05", name: "SEAL & STOW", detail: "Re-seal container · return to stowage" },
];

export const EXPERIMENT = {
  id: "EXP-114",
  name: "Sample Processing — Microgravity Fluid Physics",
  station: "BAS · LAB MODULE 2",
  crew: "CREW-A · FLIGHT QUALIFIED (SIM)",
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const jitter = (v: number, amt: number) => clamp(v + (Math.random() * 2 - 1) * amt, 86, 99);

export function formatMET(sec: number) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `T+ ${h}:${m}:${s}`;
}

let nextId = 1;
function makeEvent(severity: Severity, source: string, message: string, metSeconds: number): LogEvent {
  return { id: nextId++, ts: Date.now(), met: formatMET(metSeconds), severity, source, message };
}

const INFO_POOL = [
  ["VISION", "Pose lock acquired · 17 keypoints tracked"],
  ["VISION", "Frame batch written to local mission log"],
  ["GESTURE", "Gesture recognized: ROTATE_LOCK_RING"],
  ["INTERACT", "Hand-object interaction confirmed · S-114"],
  ["VALIDATOR", "Workspace boundary check passed"],
];

const WARN_POOL = [
  ["VALIDATOR", "Unexpected object in workspace — flagged for review"],
  ["GESTURE", "Hand trajectory deviation — gesture re-confirmed"],
  ["VISION", "Low light on CAM 03 — auto gain applied"],
];

const CRIT_POOL = [
  ["VALIDATOR", "Contact alert: glove proximity to open sample port"],
  ["VALIDATOR", "Procedure deviation: out-of-order motion detected"],
];

function initialState(): MissionState {
  const evts: LogEvent[] = [
    makeEvent("info", "SYSTEM", "Orbit Sense demo session initialized", 0),
    makeEvent("ok", "VISION", "Astronaut detected on CAM 01 · confidence 96%", 2),
    makeEvent("info", "SYSTEM", "Local mission logging active — offline capable", 4),
  ];
  return {
    wall: Date.now(),
    metSeconds: 8,
    stepIndex: 1,
    stepProgress: 42,
    verifiedAt: -99,
    activityConfidence: 94,
    perception: { astronaut: 96, container: 94, rightHand: 92, leftHand: 89, interaction: 91 },
    events: evts,
    comms: { status: "NOMINAL", buffered: 0, uplinked: 128, gapTicksLeft: 0 },
    voice: { enabled: false, announcement: "Step 02 in progress. Pick container.", id: 1 },
    history: Array.from({ length: 30 }, (_, i) => ({ t: i, conf: 90 + Math.round(Math.sin(i / 3) * 3) })),
    stepVerifiedAt: [4, null, null, null, null],
    stats: { activities: 3, anomalies: 0, frames: 24_560 },
  };
}

let state: MissionState = initialState();
const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | null = null;
let refCount = 0;

function emit() {
  for (const l of listeners) l();
}

function tick() {
  const s = state;
  const metSeconds = s.metSeconds + 1;
  let events = s.events;
  const addEvent = (severity: Severity, source: string, message: string) => {
    events = [makeEvent(severity, source, message, metSeconds), ...events].slice(0, 160);
  };
  const speak = (text: string) => {
    voice = { enabled: voice.enabled, announcement: text, id: voice.id + 1 };
  };

  let { stepIndex, stepProgress, stepVerifiedAt, verifiedAt } = s;
  const activityConfidence = jitter(s.activityConfidence, 1.6);
  const stats = { ...s.stats, frames: s.stats.frames + 30 };
  let voice = s.voice;
  const comms = { ...s.comms };
  let perception = s.perception;

  // ---- comms cycle ----
  if (comms.status === "NOMINAL") {
    if (Math.random() < 0.02) {
      comms.status = "COMM GAP";
      comms.gapTicksLeft = 12 + Math.floor(Math.random() * 10);
      addEvent("warn", "COMMS", "Communication gap — switching to local buffering");
      speak("Communication gap detected. Buffering locally.");
    }
  } else if (comms.status === "COMM GAP") {
    comms.gapTicksLeft -= 1;
    comms.buffered += 1;
    if (comms.gapTicksLeft <= 0) {
      comms.status = "SYNCING";
      addEvent("info", "COMMS", "Link restored — uplinking buffered telemetry");
    }
  } else {
    comms.uplinked += comms.buffered;
    addEvent("ok", "COMMS", `SYNC COMPLETE — ${comms.buffered} buffered events uplinked`);
    comms.buffered = 0;
    comms.status = "NOMINAL";
  }

  // ---- step progression ----
  stepProgress += 5.5 + Math.random() * 4.5;
  if (stepProgress >= 100) {
    const done = STEPS[stepIndex];
    stepVerifiedAt = stepVerifiedAt.map((v, i) => (i === stepIndex ? metSeconds : i === 0 && stepIndex === STEPS.length - 1 ? null : v));
    stepIndex = (stepIndex + 1) % STEPS.length;
    stepProgress = 0;
    verifiedAt = metSeconds;
    stats.activities += 1;
    addEvent("ok", "VALIDATOR", `STEP ${done.id} VERIFIED — ${done.name}`);
    const next = STEPS[stepIndex];
    speak(`Step ${done.id} verified. Proceed to step ${next.id}: ${next.name.toLowerCase()}.`);
  }

  // ---- perception wobble ----
  perception = {
    astronaut: jitter(s.perception.astronaut, 0.9),
    container: jitter(s.perception.container, 1.2),
    rightHand: jitter(s.perception.rightHand, 1.5),
    leftHand: jitter(s.perception.leftHand, 1.8),
    interaction: jitter(s.perception.interaction, 1.3),
  };

  // ---- random log events ----
  const r = Math.random();
  if (r < 0.1) {
    const [src, msg] = INFO_POOL[Math.floor(Math.random() * INFO_POOL.length)];
    addEvent("info", src, msg);
  } else if (r < 0.135) {
    const [src, msg] = WARN_POOL[Math.floor(Math.random() * WARN_POOL.length)];
    stats.anomalies += 1;
    addEvent("warn", src, msg);
    speak(`Attention. ${msg}`);
  } else if (r < 0.145) {
    const [src, msg] = CRIT_POOL[Math.floor(Math.random() * CRIT_POOL.length)];
    stats.anomalies += 1;
    addEvent("crit", src, msg);
    speak(`Warning. ${msg}`);
  }

  // ---- confidence history (every 2s) ----
  const history =
    metSeconds % 2 === 0
      ? [...s.history.slice(-47), { t: metSeconds, conf: Math.round(activityConfidence) }]
      : s.history;

  state = {
    ...s,
    wall: Date.now(),
    metSeconds,
    stepIndex,
    stepProgress: Math.min(stepProgress, 100),
    verifiedAt,
    activityConfidence,
    perception,
    events,
    comms,
    voice,
    history,
    stepVerifiedAt,
    stats,
  };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  refCount += 1;
  if (!interval) interval = setInterval(tick, 1000);
  return () => {
    listeners.delete(cb);
    refCount -= 1;
    if (refCount <= 0 && interval) {
      clearInterval(interval);
      interval = null;
    }
  };
}

export function toggleVoice() {
  state = { ...state, voice: { ...state.voice, enabled: !state.voice.enabled } };
  emit();
}

export function useMission(): MissionState {
  return useSyncExternalStore(subscribe, () => state);
}
