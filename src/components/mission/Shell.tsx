import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  ChevronDown,
  FlaskConical,
  Info,
  LayoutDashboard,
  Radio,
  ScrollText,
  Satellite,
  LogOut,
  Gauge,
} from "lucide-react";
import { useMission } from "@/components/mission/store";
import { Link, NavLink, useNavigate } from "react-router";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/monitor", label: "Live Monitor", icon: Radio },
  { to: "/experiment", label: "Experiment", icon: FlaskConical },
  { to: "/activity-log", label: "Activity Log", icon: ScrollText },
  { to: "/mission-data", label: "Mission Data", icon: Satellite },
  { to: "/system", label: "System", icon: Gauge },
];

export function OrbitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="6.5" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="13" ry="5.5" className="fill-none stroke-primary/70" strokeWidth="1.2" transform="rotate(-24 16 16)" />
      <circle cx="27.4" cy="11.2" r="1.8" className="fill-primary" />
      <circle cx="16" cy="16" r="2.2" className="fill-primary/90" />
    </svg>
  );
}

export function TopNav() {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const comms = useMission().comms;
  const commsTone =
    comms.status === "NOMINAL" ? "cyan" : comms.status === "COMM GAP" ? "amber" : "green";
  const commsLabel =
    comms.status === "NOMINAL" ? "LINK NOMINAL" : comms.status === "COMM GAP" ? `COMM GAP · BUF ${comms.buffered}` : "SYNCING…";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <OrbitMark className="size-7 transition-transform duration-500 group-hover:rotate-180" />
          <span className="font-display text-sm font-semibold tracking-[0.28em] text-foreground">
            ORBIT<span className="text-primary">SENSE</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/30"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )
              }
            >
              <item.icon className="size-3.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <MobileNav />
          <div className="hidden items-center gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 py-1.5 sm:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[11px] tracking-[0.18em] text-primary">SYSTEM ONLINE</span>
          </div>
          <div className="hidden rounded-md border border-border/70 bg-secondary/40 px-3 py-1.5 md:block">
            <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground">MISSION OS-DEMO-01</span>
          </div>
          <div
            className={cn(
              "hidden items-center gap-2 rounded-md border px-3 py-1.5 sm:flex",
              commsTone === "cyan" && "border-primary/25 bg-primary/5",
              commsTone === "amber" && "border-amber-400/30 bg-amber-400/10",
              commsTone === "green" && "border-emerald-400/30 bg-emerald-400/10",
            )}
          >
            <span className={cn("font-mono text-[11px] tracking-[0.18em]", commsTone === "amber" ? "text-amber-300" : commsTone === "green" ? "text-emerald-300" : "text-muted-foreground")}>
              {commsLabel}
            </span>
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 border-border/70 bg-secondary/40 font-mono text-[11px] tracking-wider">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-[9px] text-primary">
                    {(user?.name ?? "CR").slice(0, 2).toUpperCase()}
                  </span>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-border/70">
                <div className="px-3 py-2">
                  <p className="text-xs font-medium">{user?.name ?? "Crew Operator"}</p>
                  <p className="text-[11px] text-muted-foreground">{user?.email ?? "crew@orbitsense.demo"}</p>
                </div>
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                >
                  <LogOut className="size-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden font-mono text-[11px] tracking-wider sm:inline-flex">
              <Link to="/auth?returnTo=%2Fmonitor">
                CREW LOGIN
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="glow-line h-px w-full opacity-70" />
    </header>
  );
}

function MobileNav() {
  return (
    <div className="flex items-center gap-1 lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 border-border/70 bg-secondary/40">
            <Activity className="size-3.5" />
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="glass w-48 border-border/70">
          {NAV.map((item) => (
            <DropdownMenuItem key={item.to} asChild>
              <Link to={item.to} className="flex items-center gap-2">
                <item.icon className="size-3.5 text-primary" /> {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <Link to="/about" className="flex items-center gap-2">
              <Info className="size-3.5 text-primary" /> About
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function PageShell({
  kicker,
  title,
  description,
  right,
  children,
}: {
  kicker: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.3em] text-primary/80">{kicker}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {right}
      </div>
      <div className="glow-line mt-6 h-px w-full" />
      <div className="mt-8">{children}</div>
    </div>
  );
}

/** Small status chip used across panels */
export function Chip({
  tone = "cyan",
  children,
  className,
}: {
  tone?: "cyan" | "green" | "amber" | "red" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  const tones: Record<string, string> = {
    cyan: "border-primary/30 bg-primary/10 text-primary",
    green: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    red: "border-red-400/30 bg-red-400/10 text-red-300",
    neutral: "border-border/70 bg-secondary/40 text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
