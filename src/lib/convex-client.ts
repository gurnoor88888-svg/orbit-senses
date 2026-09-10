import { ConvexReactClient } from "convex/react";

/**
 * Create the Convex client only when a valid backend URL is configured.
 * Returns null (instead of throwing) when VITE_CONVEX_URL is missing or
 * malformed, so a missing backend can never blank the whole app.
 */
export function createConvexClient(
  rawUrl: unknown,
  ConvexClient: typeof ConvexReactClient = ConvexReactClient,
): ConvexReactClient | null {
  if (typeof rawUrl !== "string") {
    console.warn("[Orbit Sense] VITE_CONVEX_URL is missing — Convex features disabled.");
    return null;
  }

  const isValid =
    rawUrl.startsWith("https://") ||
    rawUrl.startsWith("http://") ||
    rawUrl.startsWith("wss://") ||
    rawUrl.startsWith("ws://");

  if (!isValid) {
    console.warn(
      "[Orbit Sense] VITE_CONVEX_URL is invalid (expected http(s):// or ws(s)://) — Convex features disabled.",
    );
    return null;
  }

  try {
    return new ConvexClient(rawUrl);
  } catch (err) {
    console.error("[Orbit Sense] Failed to create Convex client:", err);
    return null;
  }
}
