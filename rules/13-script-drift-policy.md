# Rule 13 — Script Drift Policy (Scaffolding Must Survive Upstream Changes)

The automation scripts in this template are not “nice extras.”

They are the enforcement layer that keeps this monorepo reproducible.

However, there is a permanent truth of the JavaScript ecosystem:

> Upstream scaffolding tools change over time.

Next.js updates prompts.
Cloudflare changes template shapes.
Vite renames config defaults.
Electron-Vite evolves folder layouts.

Therefore:

> Scripts must be treated as controlled infrastructure, not immortal magic.

This rule exists to prevent silent template decay.

---

# ✅ The Law

All `scripts/create-*.mjs` files are:

- official CLI wrappers
- minimal patchers
- monorepo stabilizers

They are allowed to do ONLY two things:

1. Call upstream official scaffolds
2. Apply StudioVault monorepo invariants

They must never become custom scaffolding engines.

---

# ✅ Scripts Are Allowed (Only This)

Scripts may do the following:

✅ Call official tools:

- `pnpm create next-app`
- `pnpm create cloudflare`
- `pnpm create electron-vite`
- `pnpm create expo-app`

✅ Install workspace dependencies:

```bash
pnpm add @studiovault/utils @studiovault/types --workspace
````

✅ Patch configs minimally:

* add `extends`
* add `transpilePackages`
* insert cron triggers

✅ Preserve upstream defaults whenever possible.

---

# ❌ Scripts Must NOT Do This

Scripts must never:

* replace scaffolds entirely
* ship hand-written fake templates
* rewrite full config files unnecessarily
* degrade upstream tsconfig defaults
* become “framework replacements”

This repo survives by wrapping the ecosystem, not forking it.

---

# ✅ Drift Is Expected (Not a Failure)

Upstream drift is normal.

Examples:

* Cloudflare changes `wrangler.jsonc` structure
* Next.js renames `next.config.ts`
* Vite changes Rollup baseline
* Expo evolves TS configs

When drift happens:

> The script is not “wrong.”
> The ecosystem moved.

The correct response is:

1. Patch the script centrally
2. Update the rule documentation
3. Keep invariants stable

Never scatter manual fixes across apps.

---

# ✅ Safe Patching Doctrine

String patching is acceptable for templates, but must be defensive.

Scripts must always include drift guards:

```js
if (raw.includes("transpilePackages")) {
  console.log("Already patched, skipping.");
} else {
  applyPatch();
}
```

If patching fails:

* warn loudly
* do not silently corrupt configs

Silent failure is forbidden.

---

# ✅ Template Responsibility Boundary

This template guarantees:

* creation correctness at time of release
* monorepo wiring
* workspace purity
* runtime separation

This template does NOT guarantee:

* upstream CLI permanence forever
* zero drift across multiple years

Maintenance is central, not distributed.

---

# ✅ What Breaks If Violated

If scripts are treated as eternal magic:

* scaffold updates will break silently
* new apps will become inconsistent
* configs will drift across projects
* the template will rot over time

If scripts become custom forks:

* you will own the entire ecosystem burden
* the template becomes unmaintainable
* upgrades become impossible

---

# ✅ Final Statement

Scripts are the controlled gateway into this monorepo.

They are not convenience hacks.

They are constitutional infrastructure.

Upstream drift is inevitable.

Centralized repair is mandatory.

Never bypass the script layer.
Never fork the scaffold layer.

Template survival depends on this law.
