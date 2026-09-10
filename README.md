# ORBIT SENSE

**AI-Powered Astronaut Activity & Experiment Monitoring System**

> Software prototype / demo — a mission-control style dashboard for autonomous astronaut
> experiment monitoring, designed for future missions such as low-orbit stations and lunar
> exploration. This is **not** space-qualified software and is not connected to any real
> spacecraft, satellite, or station hardware.

## What It Does

Orbit Sense demonstrates how fixed onboard cameras could translate raw video into
*understanding* — recognizing astronaut activities, validating experiment sequences,
detecting procedural deviations, and logging mission data locally for later sync.

- 🎥 **Simulated live camera feeds** with computer-vision overlays (bounding boxes, keypoints, confidence scores)
- 🧍 **Human activity recognition** — current activity, confidence, and step-by-step sequence verification
- 🔬 **Experiment monitor** — multi-step experiment sequences with per-step status
- 📜 **Activity log** — timestamped event stream of detected actions and alerts
- 🛰️ **Mission data** — aggregated telemetry, perception metrics, and sync status
- ⚙️ **System status** — subsystem health, AI module states, communication link status
- ⚠️ **Real-time alerts** — procedural deviation warnings and confidence fallbacks

## Pages

| Route           | Purpose                                  |
| --------------- | ---------------------------------------- |
| `/`             | Landing — mission overview & entry point |
| `/monitor`      | Live monitoring mission-control console  |
| `/experiment`   | Experiment sequence monitor              |
| `/activity-log` | Event and activity history               |
| `/mission-data` | Mission telemetry and data overview      |
| `/system`       | System status dashboard                  |
| `/about`        | About Orbit Sense                        |
| `/auth`         | Sign in / sign up                        |
| `/dashboard`    | Protected account dashboard              |

## Tech Stack

- **Vite + TypeScript + React 19** — frontend
- **Tailwind CSS v4 + shadcn/ui** — styling and components
- **Framer Motion** — animations
- **React Router v7** — routing
- **Convex + Convex Auth** — backend, database, and authentication
- **Bun** — package manager

## Getting Started (Local)

Prerequisites: [Bun](https://bun.sh) installed.

```bash
# 1. Install dependencies
bun install

# 2. Set up a Convex deployment (provisions backend + auth env vars)
bunx convex dev --once

# 3. Start the dev server
bun run dev
```

### Environment Variables

Copy `.env.example`-style values into a local `.env` (never commit `.env`):

| Variable            | Source                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| `VITE_CONVEX_URL`   | Printed by `bunx convex dev --once`, or from your Convex dashboard      |
| `CONVEX_DEPLOYMENT` | Set automatically by the Convex CLI during provisioning                 |

Auth secrets (`JWKS`, `JWT_PRIVATE_KEY`, `SITE_URL`) are provisioned automatically by
Convex Auth on the backend and are never exposed to the client.

### Docker (production-style demo build)

The Dockerfile builds the static bundle and serves it via nginx with SPA fallback routing:

```bash
docker build --build-arg VITE_CONVEX_URL=wss://your-deployment.convex.cloud -t orbit-sense .
docker run -p 8080:80 orbit-sense
```

Then open http://localhost:8080.

## Project Structure

```
src/
├── components/
│   ├── mission/        # Camera feed, panels, star field, shared mission state
│   └── ui/             # shadcn/ui primitives
├── convex/             # Convex backend: schema, auth, users
├── hooks/              # useAuth, useMobile
├── pages/              # Landing, Monitor, Experiment, ActivityLog, MissionData,
│                       # SystemStatus, About, Auth, Dashboard, NotFound
├── index.css           # Theme tokens (oklch), global styles
└── main.tsx            # Router + providers
```

## Scope & Disclaimer

Orbit Sense is a **software demonstration** of concept: activity recognition, pose
estimation, hand tracking, object detection, experiment validation, alerting, and offline
logging are simulated for presentation purposes. Camera feeds are synthetic scenes, not
real video. No affiliation with NASA, ISRO, or any space agency is implied.

## License

[MIT](./LICENSE)

---

## Export to GitHub

This project was built in the Freebuff (Vly) environment, which manages version control
internally. To push a copy of this code to your own GitHub repository:

1. Download the project (or copy the folder) to your local machine.
2. Create an empty repository on GitHub (do **not** initialize it with a README).
3. From the project root, run the included script:

```bash
chmod +x scripts/export-to-github.sh
./scripts/export-to-github.sh https://github.com/<your-username>/<your-repo>.git
```

Or run the equivalent commands manually:

```bash
git init
git add .
git commit -m "Orbit Sense: AI-powered astronaut activity & experiment monitoring demo"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Replace `<your-username>/<your-repo>` with your actual GitHub repo path. A `.gitignore`
is included, so `node_modules`, build output, and env files are excluded automatically.
CI runs a TypeScript typecheck on every push and PR to `main`.

### Before publishing publicly

A security review of the codebase found one item to be aware of:

- `src/convex/auth/emailOtp.ts` contains a Freebuff **platform-provisioned API key** used
  to deliver email OTP codes for sign-in. This file is managed by the Freebuff platform
  (see `DO NOT MODIFY` header) and ships with every Freebuff template. It is not your
  personal secret and is scoped to the platform's OTP endpoint, but if you plan to run
  this app outside Freebuff or want a fully clean public repo, replace the email provider
  with your own (e.g. Resend, Postmark) and remove the hardcoded key.

No other secrets, tokens, or private keys exist in the codebase. Env vars such as
`VITE_CONVEX_URL` are excluded via `.gitignore`.

### Suggested repository metadata

- **Description:** `AI-Powered Astronaut Activity & Experiment Monitoring System — mission-control dashboard prototype (React · TypeScript · Convex)`
- **Topics:** `space` `mission-control` `human-activity-recognition` `react` `typescript` `convex` `vite` `demo`
