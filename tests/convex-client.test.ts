import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { ConvexReactClient } from "convex/react";
import { createConvexClient } from "../src/lib/convex-client";

describe("createConvexClient", () => {
  let warns: string[] = [];
  let errors: string[] = [];
  const realWarn = console.warn;
  const realError = console.error;

  beforeEach(() => {
    warns = [];
    errors = [];
    console.warn = (...args: unknown[]) => {
      warns.push(args.join(" "));
    };
    console.error = (...args: unknown[]) => {
      errors.push(args.join(" "));
    };
  });

  afterEach(() => {
    console.warn = realWarn;
    console.error = realError;
  });

  test("returns a client for valid https and wss URLs", () => {
    for (const url of [
      "https://grand-otter-123.convex.cloud",
      "wss://region.project.convex.cloud",
      "http://localhost:3000",
      "ws://localhost:3000",
    ]) {
      const client = createConvexClient(url);
      expect(client).not.toBeNull();
      expect(client).toBeInstanceOf(ConvexReactClient);
      client!.close();
    }
    expect(warns).toHaveLength(0);
  });

  test("returns null for missing URL (undefined / null / non-string)", () => {
    expect(createConvexClient(undefined)).toBeNull();
    expect(createConvexClient(null)).toBeNull();
    expect(createConvexClient(42)).toBeNull();
    expect(warns.some((w) => w.includes("missing"))).toBe(true);
  });

  test("returns null for invalid protocol URLs and warns", () => {
    for (const url of ["", "not-a-url", "ftp://x.convex.cloud", "//no-protocol.example"]) {
      expect(createConvexClient(url)).toBeNull();
    }
    expect(warns.some((w) => w.includes("invalid"))).toBe(true);
  });

  test("returns null (not a throw) when the Convex client constructor throws", () => {
    class ExplodingClient {
      constructor() {
        throw new Error("boom");
      }
      close() {}
    }
    // Type-level lie, runtime-safe: we only exercise the factory's error path.
    const client = createConvexClient(
      "https://example.convex.cloud",
      ExplodingClient as unknown as typeof ConvexReactClient,
    );
    expect(client).toBeNull();
    expect(errors.some((e) => e.includes("boom"))).toBe(true);
  });
});
