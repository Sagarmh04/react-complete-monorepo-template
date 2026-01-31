# Rule 05 — Windows Stability Doctrine (Rollup + Tsup)

This rule exists for one reason:

> Windows stability is not optional.

Modern bundlers increasingly ship optional native binaries.
Those binaries frequently break in real-world Windows environments.

The monorepo template must survive this.

---

# ✅ The Problem Domain

Shared packages build with:

- `tsup`

Internally, `tsup` depends on:

- `rollup`

Rollup v4 introduced:

- optional native platform binaries
- resolution edge cases
- Windows breakage in monorepo installs

This causes:

- `tsup` build failures
- broken developer onboarding
- non-reproducible installs

Therefore:

> Rollup must be controlled.

But carefully.

---

# ✅ The Law

We apply a scoped pnpm override:

```json
"pnpm": {
  "overrides": {
    "tsup>rollup": "3.29.4"
  }
}
````

Meaning:

* `tsup` always uses Rollup v3 (stable)
* the rest of the ecosystem remains free to use Rollup v4+

This is the only stable equilibrium.

---

# ❌ Forbidden Fix: Global Rollup Pin

This is explicitly forbidden:

```json
"overrides": {
  "rollup": "3.29.4"
}
```

Reason:

Tools like:

* Vite
* Electron-Vite
* future frontend bundlers

increasingly require modern Rollup versions.

A global pin would:

* break Vite upgrades
* block ecosystem compatibility
* freeze the repo in time

We are not building a museum.

---

# ✅ Why Scoped Override Is Sacred

This override isolates the instability:

* tsup gets the stable Rollup major it needs
* Vite and frontend tooling can evolve normally

This prevents tool fighting between:

* package bundling stability (tsup)
* app bundling modernity (Vite)

Without the scope, you will always break one side.

---

# ✅ What Breaks If Violated

If the override is removed:

* tsup builds may fail on Windows
* onboarding becomes unreliable
* shared packages stop building

If the override is made global:

* Vite/Electron builds may break
* frontend ecosystem upgrades become impossible

Either direction destroys template stability.

---

# ✅ Final Statement

This rule is constitutional.

The scoped Rollup override is a permanent Windows survival constraint.

Do not simplify it.
Do not “clean it up.”
Do not remove it.

The ecosystem is unstable.

This override is stability.


## This does NOT freeze Vite

The override is scoped:

tsup>rollup

Vite and frontend tooling remain free to use Rollup v4+.

Do not global-pin Rollup.
