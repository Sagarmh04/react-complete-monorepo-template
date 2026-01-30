# @studiovault/eslint-config

Shared ESLint rules for the entire monorepo.

Key enforcement:
- One lint baseline across all apps/packages
- Prevent Node-only imports (`fs`, `path`) inside shared runtime-agnostic packages
