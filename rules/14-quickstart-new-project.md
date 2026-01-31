# Rule 14 — Quickstart Doctrine (How New Projects Are Born)

A monorepo template is only real if spawning a new project is:

- repeatable
- boring
- stable
- identical every time

This repository exists to prevent the most common failure mode:

> Every new app becomes a snowflake.

Therefore:

> Project creation is not flexible.
> It is procedural.
> It follows one canonical sequence.

This file defines the only approved way to start building.

---

# ✅ The Law

All new applications must be created through:

- locked toolchain
- official scripts
- canonical folder layout
- shared package wiring
- runtime separation

No manual scaffolding is allowed.

---

# ✅ Step 0 — Toolchain Verification (Before Anything)

You must have exactly:

| Tool     | Version |
|----------|---------|
| Node.js  | 20.20.x |
| pnpm     | 9.15.4  |

Verify:

```bash
node -v
pnpm -v
````

If this is wrong, stop immediately.

The template is not compatible with drift.

---

# ✅ Step 1 — Install the Monorepo

From root:

```bash
pnpm install
```

This must succeed cleanly.

Never use:

* npm install
* yarn install
* bun install

Only pnpm is constitutional.

---

# ✅ Step 2 — Validate Template Health

Before creating anything:

```bash
pnpm type-check
pnpm lint
pnpm build
```

If the template is red, do not spawn projects from it.

Green is the invariant.

---

# ✅ Step 3 — Spawn Applications (Only Through Scripts)

All apps begin through `pnpm create:*`

---

## ✅ Web App (Next.js + Tailwind)

Creates:

```
apps/web/<name>
```

Command:

```bash
pnpm create:web studio-web
```

Guarantees:

* Next.js official scaffold
* Tailwind enabled
* Workspace imports supported via `transpilePackages`

---

## ✅ Desktop App (Electron + Vite)

Creates:

```
apps/desktop/<name>
```

Command:

```bash
pnpm create:desktop studio-desktop
```

Guarantees:

* Official Electron-Vite scaffold
* Shared UI + types installed
* Default tsconfig preserved

---

## ✅ Mobile App (Expo React Native)

Creates:

```
apps/mobile/<name>
```

Command:

```bash
pnpm create:mobile studio-mobile
```

Guarantees:

* Official Expo scaffold
* Shared packages installed
* No destructive TS rewrites

---

## ✅ HTTP API Worker (Cloudflare Edge)

Creates:

```
apps/api/<name>
```

Command:

```bash
pnpm create:worker edge
```

Guarantees:

* HTTP-only Worker (`fetch()`)
* No cron triggers allowed
* Runtime purity enforced

---

## ✅ Scheduled Cron Worker (Cloudflare Timed Jobs)

Creates:

```
apps/cron/<name>
```

Command:

```bash
pnpm create:cron-worker cleanup --cron "0 */5 * * *"
```

Guarantees:

* Scheduled-only Worker (`scheduled()`)
* Exactly one cron schedule per worker
* Wrangler trigger inserted safely

Examples:

```bash
pnpm create:cron-worker sync    --cron "*/30 * * * *"
pnpm create:cron-worker daily   --cron "0 2 * * *"
```

---

# ✅ Step 4 — Permanent Background Compute Layer

Unlike other platforms, heavy compute is NOT spawned repeatedly.

It exists permanently:

```
apps/node/processor
```

This layer handles:

* exports
* analytics
* PDF generation
* long pipelines

Jobs belong in:

```
src/jobs/
```

Runtime adapters belong in:

```
src/runtime/
```

Supported deployment targets:

* AWS Lambda
* Google Cloud Run
* Any Node container runtime

This prevents vendor lock-in contamination.

---

# ✅ Step 5 — Shared Package Rules (Never Break These)

Everything under:

```
packages/*
```

Must remain runtime-agnostic.

Forbidden imports:

* fs
* path
* Node-only globals
* Worker bindings
* Browser globals

Shared packages are contracts, not runtime code.

---

# ✅ Step 6 — Windows Survival Clause

This template is Windows-safe only because of the sacred override:

```json
"pnpm": {
  "overrides": {
    "tsup>rollup": "3.29.4"
  }
}
```

Do not remove.
Do not global-pin Rollup.
Do not weaken.

This prevents tsup breakage while allowing Vite modernization.

---

# ✅ Step 7 — Template Operating Mode

Once apps exist, the standard loop is:

```bash
pnpm dev
```

Or validate everything:

```bash
pnpm build
pnpm type-check
pnpm lint
```

Turbo handles orchestration.

Green is survival.

---

# ✅ Final Statement

This monorepo is not a playground.

It is a controlled infrastructure template designed to resist:

* ecosystem drift
* runtime contamination
* Windows instability
* monorepo entropy

If you follow the script surface, you will ship.

If you bypass the constitution, tooling will eat your life.

Build products.
Do not fight ecosystems.