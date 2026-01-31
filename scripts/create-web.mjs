#!/usr/bin/env node

/**
 * StudioVault Web App Creator (Next.js + Tailwind)
 *
 * Creates a monorepo-safe Next.js app under /apps/web.
 * Installs shared packages and patches Next.js config safely.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const appName = process.argv[2];

if (!appName) {
  console.error("❌ Missing app name.");
  console.error("Usage: pnpm create:web <app-name>");
  process.exit(1);
}

/**
 * Step 1: Ensure /apps/web exists
 */
if (!fs.existsSync("apps")) fs.mkdirSync("apps");

const baseDir = path.join("apps", "web");
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

/**
 * Step 2: Scaffold Next.js app (official CLI)
 */
process.chdir(baseDir);

console.log("✅ Creating Next.js + Tailwind app:", appName);

execSync(
  `pnpm create next-app@latest ${appName} \
    --ts \
    --eslint \
    --tailwind \
    --src-dir \
    --app \
    --use-pnpm`,
  { stdio: "inherit" }
);

/**
 * Step 3: Install shared StudioVault workspace packages
 */
process.chdir(appName);

console.log("\n✅ Installing shared StudioVault packages...");

execSync(
  "pnpm add @studiovault/ui @studiovault/utils @studiovault/types --workspace",
  { stdio: "inherit" }
);

/**
 * Step 4: Patch next.config.ts safely
 */
console.log("\n✅ Checking next.config.ts for monorepo compatibility...");

const nextConfigPath = "next.config.ts";

if (!fs.existsSync(nextConfigPath)) {
  console.warn("⚠️ next.config.ts not found. Next.js template may have changed.");
  console.warn("⚠️ Please add transpilePackages manually.");
  process.exit(0);
}

const raw = fs.readFileSync(nextConfigPath, "utf8");

/**
 * If already patched (marker present), do nothing.
 */
if (raw.includes(`"_studiovault": "StudioVault Monorepo Fix"`)
) {
  console.log("✅ Already patched. Skipping.");
} else {
  console.log("✅ Applying StudioVault transpilePackages patch...");

  const patched = `import type { NextConfig } from "next";

// StudioVault Monorepo Fix
const nextConfig: NextConfig = {
  /**
   * StudioVault Monorepo Fix:
   * Workspace packages must be transpiled explicitly.
   */
  transpilePackages: [
    "@studiovault/ui",
    "@studiovault/utils",
    "@studiovault/types"
  ],
};

export default nextConfig;
`;

  try {
    fs.writeFileSync(nextConfigPath, patched);
    console.log("✅ next.config.ts patched successfully.");
  } catch (err) {
    console.warn("⚠️ Format changed, patch not applied. Manual review required.");
    console.error(err);
  }
}

/**
 * Final Output
 */
console.log("\n🎉 Web app created successfully!");
console.log("Next steps:");
console.log(`cd apps/web/${appName}`);
console.log("pnpm dev");
