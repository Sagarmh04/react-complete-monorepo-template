# React Complete Monorepo Template (StudioVault)

This repository is a reusable, infrastructure-first monorepo template designed to spawn modern applications across multiple runtimes:

- **Web** → Next.js  
- **Desktop** → Electron + Vite  
- **Mobile** → Expo React Native  
- **Edge Backend** → Cloudflare Workers  
- **Background Compute** → Node Processor (Lambda / Cloud Run style)

This is not a single product repository.

This is a **starter system** meant to be reused across many future projects.

The purpose is simple:

> Ship applications without tooling hell.

---

# ✅ Core Philosophy

This monorepo optimizes for:

- Windows stability
- Reproducibility across machines
- Minimal tool fighting
- Official scaffolding only
- Shared code that works everywhere
- Long-term template survivability

These rules are not preferences.

They are survival constraints.

---

# ✅ Toolchain Lock (Non-Negotiable)

This template is stable only under a fixed toolchain.

You **must** use:

| Tool     | Version |
|----------|---------|
| Node.js  | **20.20.x LTS** |
| pnpm     | **9.15.4** |

Root enforcement exists in `package.json`:

```json
"packageManager": "pnpm@9.15.4",
"engines": { "node": "20.x" }
````

This prevents invisible drift.

Forbidden:

* nvm-windows
* corepack pnpm switching
* multiple Node installs

---

# ✅ Repository Structure (Canonical)

This template has one official layout:

```txt
apps/
  web/         → Next.js apps (spawned)
  desktop/     → Electron apps (spawned)
  mobile/      → Expo apps (spawned)

  api/         → Cloudflare HTTP Workers (spawned)
  cron/        → Cloudflare Scheduled Workers (spawned)

  node/
    processor/ → Permanent background compute layer

packages/
  typescript-config → Shared TS configs
  eslint-config     → Shared lint rules
  prettier-config   → Shared formatting

  types             → Runtime-agnostic contracts
  utils             → Runtime-agnostic helpers
  ui                → Shared React component library

  database          → Schema/contracts only
  storage           → Storage contracts only

scripts/
  create-web.mjs
  create-desktop.mjs
  create-mobile.mjs
  create-worker.mjs
  create-cron-worker.mjs

rules/
  → The Constitution (mandatory)
```

This structure must remain stable forever.

---

# ✅ Shared Packages Rule (Critical)

All code under:

```txt
packages/*
```

must remain **runtime-agnostic**.

Shared packages MUST NOT import:

* `fs`
* `path`
* Node-only APIs
* Worker-only bindings
* Browser globals (`window`, `document`)

Allowed content:

* pure utilities
* TypeScript contracts
* schema definitions
* shared React UI components
* portable constants

Reason:

Apps run under incompatible runtimes.
Shared code must survive all of them.

---

# ✅ Build Output Contract (`dist/` Is Mandatory)

All buildable shared packages must emit to:

```txt
dist/
```

No exceptions.

Build artifacts must always be predictable.

---

# ✅ Windows Stability Doctrine (Tsup + Rollup)

Shared packages build with `tsup`.

Rollup v4 introduced optional native binaries that frequently break on Windows.

Permanent fix:

```json
"pnpm": {
  "overrides": {
    "tsup>rollup": "3.29.4"
  }
}
```

This override is sacred.

It is scoped to tsup only.

Do NOT replace it with a global Rollup pin, because tools like Vite require modern Rollup versions.

---

# ✅ App Creation Policy (Scripts Only)

Humans must never copy/paste apps manually.

All apps must be created only through the official scripts:

```bash
pnpm create:web my-web
pnpm create:desktop my-desktop
pnpm create:mobile my-mobile

pnpm create:worker auth
pnpm create:cron-worker cleanup --cron "0 */5 * * *"
```

Scripts exist because upstream scaffolds drift over time.

They guarantee:

* correct folder placement
* workspace dependency wiring
* safe tsconfig patching
* monorepo compatibility

---

# ✅ Worker Trigger Split (HTTP vs Cron)

Workers are strictly divided:

* `apps/api/*` → HTTP request Workers only (`fetch`)
* `apps/cron/*` → Scheduled Workers only (`scheduled`)

One cron worker = one cron schedule.

Never mix triggers.

---

# ✅ Permanent Node Processor Layer

The Node processor exists permanently at:

```txt
apps/node/processor
```

It is not spawned repeatedly.

It is the canonical background compute engine for:

* exports
* analytics
* PDF generation
* long pipelines
* heavy processing jobs

Job logic remains vendor-neutral.

Runtime adapters exist for:

* AWS Lambda
* Google Cloud Run

---

# ✅ Mandatory Next Step: Read the Constitution

All non-negotiable laws live in:

```txt
rules/
```

Start here:

```txt
rules/00-constitution.md
```

Nothing in this repository should be modified without understanding those rules.

---

# ✅ Validation Commands

After cloning:

```bash
pnpm install
pnpm build
pnpm type-check
pnpm lint
```

If these are green, the template is healthy.

---

# ✅ Template Goal

This repository exists to prevent the most common failure mode:

> Tooling complexity outgrowing the product.

Infrastructure is here only to support shipping applications.

Not to become the application.

## Mandatory Reading

This repository is governed by the Constitution in:

rules/

Start with:

rules/00-constitution.md

Nothing should be edited until those rules are understood.
