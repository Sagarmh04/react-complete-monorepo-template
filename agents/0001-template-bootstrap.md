# Template Bootstrap — Step T1.1

## Goal
Create the authoritative root package.json for the template.

## Actions Completed
- Created root package.json
- Locked Node engine to 20.x
- Locked pnpm to 9.15.4
- Added Turbo + Syncpack scripts
- Added app creation entrypoints (scripts will be implemented later)

## Step T1.2 Completed
- Added pnpm-workspace.yaml
- Defined workspace scope: apps/*, packages/*, scripts
- Prevented resolution edge cases and phantom linking

## Step T1.3 Completed
- Added strict turbo.json pipeline
- Build outputs declared explicitly (dist/, .next/)
- Dev tasks are persistent + uncached
- Next.js internal cache excluded
### Turbo Schema Correction
- Turbo 2.x uses `tasks`, not `pipeline`
- Updated turbo.json accordingly
- Verified template matches Turbo v2.8.0 config rules

## Step T1.4 Completed
- Added syncpack.config.cjs
- Enforced strict dependency version consistency across workspace
- Declared React peer dependency rules to prevent duplicate runtimes

## Step T1.5 Completed
- Added default GitHub Actions CI workflow
- Node pinned to 20.x
- pnpm pinned to 9.15.4
- CI enforces frozen lockfile + syncpack consistency
- Runs lint, type-check, and turbo build
