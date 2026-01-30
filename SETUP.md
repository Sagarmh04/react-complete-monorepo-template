# StudioVault Monorepo Setup (Single Source of Truth)

This repository is a multi-platform monorepo built for:

- Web (Next.js)
- Desktop (Electron + Vite)
- Mobile (Expo React Native)
- Backend (Cloudflare Workers / API)

The entire system is designed to be reproducible and version-stable.

---

## 1. Machine Requirements (Hard Locked)

These must be installed globally before working on this repo:

| Tool | Version | Notes |
|------|---------|------|
| Node.js | 20.20.x LTS | Installed via official MSI only |
| pnpm | 9.15.4 | Installed globally via npm |

### Verify

```bash
node -v
pnpm -v


Expected:

Node: v20.20.x

pnpm: 9.15.4

2. Repo Version Enforcement

Root package.json contains:

"packageManager": "pnpm@9.15.4"

"engines": { "node": "20.x" }

This prevents toolchain drift across machines.

3. Workspace Layout
apps/        # Platform applications
packages/    # Shared runtime-agnostic libraries
agents/      # Sequential project documentation
scripts/     # Official scaffolding automation
rules/       # Global coding + stack rules

4. Shared Package Runtime Rules (Critical)

Shared packages MUST remain portable:

✅ Allowed:

Pure TypeScript helpers

Types, schemas, validation

API clients

❌ Forbidden:

Node-only imports (fs, path)

Browser globals (window)

Worker-only bindings

Reason: Apps run in different runtimes (Node / Edge / Native).

5. Dependency Consistency Rules

We enforce identical versions using Syncpack:

pnpm sync:check
pnpm sync:fix


React must be provided by apps, not shared packages.

Shared UI packages must declare React as a peer dependency.

6. Adding New Applications (Reliable Process)

All new apps must be created ONLY via official CLIs:

Web: pnpm create next-app

Desktop: pnpm create vite

Mobile: pnpm create expo-app

Worker/API: pnpm create cloudflare

Do NOT copy/paste app templates manually.

After creation:

Add required shared deps via workspace protocol

Run pnpm install

Document creation in that app’s /agents/

7. Automation Scripts

The scripts/ folder contains wrappers that:

Call official CLIs

Apply StudioVault defaults

Prevent inconsistent setups

Example (future):

pnpm create:web studio-web
pnpm create:desktop studio-desktop


These scripts are the only allowed shortcut.



This is now part of the constitution.

---

# ✅ Step T2.9 Completed Properly

`packages/utils` is now:

- runtime-agnostic
- buildable with tsup
- dist-ready
- stable on Windows

---

# ✅ Next Step: `packages/ui` (React Component Library)

Now we create the shared UI package.

Rules:

- React is a peerDependency (never bundled)
- Uses tsup build
- Extends react.json TS config
- Runtime safe (no Node APIs)

We’ll do 3 small files next:

1. `packages/ui/package.json`
2. `packages/ui/tsconfig.json`
3. `packages/ui/src/index.ts`

---

## ✅ File 1 — `packages/ui/package.json`

mkdir -p packages/ui/src
