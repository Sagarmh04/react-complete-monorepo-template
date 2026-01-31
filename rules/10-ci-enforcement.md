## ✅ FILE 12 — `rules/10-ci-enforcement.md`

Copy-paste exactly:

```md
# Rule 10 — CI Enforcement Doctrine (Template Immune System)

A template without enforcement is not a template.

It is a suggestion repository.

This monorepo must remain:

- reproducible
- buildable
- type-safe
- stable across time

Therefore:

> CI is mandatory, minimal, and sacred.

---

# ✅ The Law

GitHub Actions CI must exist by default.

Located at:

```

.github/workflows/ci.yml

````

CI must run on:

- every push
- every pull request

No exceptions.

---

# ✅ Required CI Checks

CI must always run:

## 1. Frozen dependency install

```bash
pnpm install --frozen-lockfile
````

This ensures:

* no hidden dependency drift
* lockfile is authoritative
* installs are reproducible

---

## 2. TypeScript validation

```bash
pnpm type-check
```

Type safety is a template invariant.

---

## 3. Lint enforcement

```bash
pnpm lint
```

Lint prevents shared runtime contamination.

---

## 4. Full build

```bash
pnpm build
```

A template that does not build is dead.

---

# ❌ Forbidden CI Behavior

CI must NOT include deployment steps.

This is a template, not a product pipeline.

Forbidden:

* production deploy actions
* secrets assumptions
* vendor credentials
* environment-specific workflows

Deployment belongs to downstream projects.

---

# ✅ Why This Rule Is Sacred

Without CI enforcement:

* shared packages silently break
* scripts rot over time
* scaffolds drift
* Windows stability regressions return
* template consumers inherit broken infrastructure

CI is the template’s guardian.

---

# ✅ Template Integrity Contract

If CI is red:

* the template is invalid
* no new projects should spawn from it
* stability has been violated

The template must always remain green.

---

# ✅ Final Statement

CI is not overhead.

CI is what makes this repository a template instead of a toy.

Frozen install.
Type-check.
Lint.
Build.

Always.

CI must enable pnpm cache for speed.
Turbo remote cache is downstream concern.
