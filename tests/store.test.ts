import { describe, expect, test } from "bun:test";
import { STEPS, EXPERIMENT, formatMET } from "../src/components/mission/store";

describe("formatMET", () => {
  test("formats mission elapsed time as T+ HH:MM:SS with zero padding", () => {
    expect(formatMET(0)).toBe("T+ 00:00:00");
    expect(formatMET(8)).toBe("T+ 00:00:08");
    expect(formatMET(59)).toBe("T+ 00:00:59");
    expect(formatMET(60)).toBe("T+ 00:01:00");
    expect(formatMET(3661)).toBe("T+ 01:01:01");
    expect(formatMET(36000 + 1800 + 30)).toBe("T+ 10:30:30");
  });

  test("floors fractional seconds", () => {
    expect(formatMET(61.9)).toBe("T+ 00:01:01");
  });
});

describe("experiment definition", () => {
  test("has exactly five ordered steps with sequential ids", () => {
    expect(STEPS).toHaveLength(5);
    expect(STEPS.map((s) => s.id)).toEqual(["01", "02", "03", "04", "05"]);
    expect(STEPS.every((s) => s.name.length > 0 && s.detail.length > 0)).toBe(true);
  });

  test("matches the demo experiment metadata", () => {
    expect(EXPERIMENT.id).toBe("EXP-114");
    expect(EXPERIMENT.name).toContain("Sample Processing");
  });
});
