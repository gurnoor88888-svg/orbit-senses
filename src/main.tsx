import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Monitor = lazy(() => import("./pages/Monitor.tsx"));
const Experiment = lazy(() => import("./pages/Experiment.tsx"));
const ActivityLog = lazy(() => import("./pages/ActivityLog.tsx"));
const MissionData = lazy(() => import("./pages/MissionData.tsx"));
const SystemStatus = lazy(() => import("./pages/SystemStatus.tsx"));
const About = lazy(() => import("./pages/About.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Create the Convex client only when a valid backend URL is configured.
 *  A missing/invalid URL previously threw at module scope → unrenderable blank page. */
function createConvexClient(): ConvexReactClient | null {
  const url = import.meta.env.VITE_CONVEX_URL;
  if (
    typeof url === "string" &&
    (url.startsWith("https://") || url.startsWith("http://") || url.startsWith("wss://") || url.startsWith("ws://"))
  ) {
    try {
      return new ConvexReactClient(url);
    } catch (err) {
      console.error("[Orbit Sense] Failed to create Convex client:", err);
      return null;
    }
  }
  console.warn("[Orbit Sense] VITE_CONVEX_URL is missing or invalid — Convex features disabled.");
  return null;
}

const convex = createConvexClient();



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


function AppRoutes() {
  return (
    <BrowserRouter>
      <RouteSyncer />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/experiment" element={<Experiment />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/mission-data" element={<MissionData />} />
          <Route path="/system" element={<SystemStatus />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/auth"
            element={<AuthPage redirectAfterAuth="/monitor" />}
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

/** Shown instead of a blank page when the Convex backend URL is not configured. */
function MissingConvexConfig() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="glass max-w-md rounded-xl p-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-primary">SYSTEM CONFIG ERROR</p>
        <h1 className="mt-3 font-display text-xl font-semibold">Convex backend not configured</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          <code className="font-mono text-primary">VITE_CONVEX_URL</code> is missing. Run{" "}
          <code className="font-mono text-foreground">bunx convex dev --once</code> to provision the
          backend, then restart the dev server.
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      {convex ? (
        <ConvexAuthProvider client={convex}>
          <AppRoutes />
          <Toaster />
        </ConvexAuthProvider>
      ) : (
        <MissingConvexConfig />
      )}
    </RootErrorBoundary>
  </StrictMode>,
);
