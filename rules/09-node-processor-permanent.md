# Rule 09 — Node Processor Permanence (Background Compute Layer)

Edge runtimes are powerful, but they are not infinite.

Cloudflare Workers have limits:

- CPU time ceilings
- memory ceilings
- no heavyweight native tooling
- unsuitable for long pipelines

Therefore:

> Heavy compute must live in a dedicated Node processor.

This template provides exactly one canonical processor layer.

---

# ✅ The Law

The Node processor exists permanently at:

```

apps/node/processor

```

It is not scaffolded repeatedly.

It is part of the template itself.

All future projects reuse this layer.

---

# ✅ Purpose of the Processor

The processor handles work that Workers should not:

- long exports
- analytics aggregation
- PDF generation
- watermarking
- pipelines
- background jobs
- heavy transformations

Think of it as:

> The monorepo’s universal heavy engine.

---

# ✅ Vendor Neutral Core

The processor is structured in layers:

```

src/jobs/       → Pure job logic (portable)
src/runtime/    → Deployment adapters (vendor-specific)

````

Jobs must never import AWS/GCP directly.

Example job:

```ts
export async function exportMonthlyOrders(...) {
  // Pure logic only.
}
````

Adapters implement runtime bindings:

* AWS Lambda handler
* Cloud Run server
* Future container runtime

---

# ✅ Supported Runtime Targets

The processor is designed to deploy into:

* AWS Lambda (cheap at low scale)
* Google Cloud Run (better for long sessions)
* Any Node container environment

Switching providers should require:

* swapping runtime entrypoint
* not rewriting job logic

---

# ✅ Why No Script Exists for Processor

We do not generate “processor apps” repeatedly.

There should not be:

```
processor-1/
processor-2/
processor-random/
```

There is only one background compute spine.

This avoids:

* duplicated pipelines
* vendor lock scattering
* inconsistent job systems

---

# ✅ TypeScript Baseline

Processor TypeScript must extend:

```json
"extends": "@studiovault/typescript-config/node.json"
```

This ensures:

* Node globals exist
* Promise/lib support is correct
* no DOM assumptions leak in

---

# ✅ Build Contract

Processor builds via `tsup` like other packages:

* predictable `dist/`
* stable Windows behavior
* shared Rollup override applies

---

# ✅ What Breaks If Violated

If heavy jobs are placed into Workers:

* execution timeouts occur
* memory ceilings hit fast
* pipelines fail unpredictably

If vendor bindings leak into jobs:

* migration becomes impossible
* lock-in spreads everywhere
* template loses portability

If processor is duplicated:

* architecture fragments
* jobs become inconsistent
* long-term maintenance collapses

---

# ✅ Final Statement

Workers are the edge brain.

The processor is the heavy engine.

One engine.
Permanent.
Vendor-neutral core.

Do not scatter background compute.

This template provides the processor source.
Deployment wiring is downstream responsibility.
