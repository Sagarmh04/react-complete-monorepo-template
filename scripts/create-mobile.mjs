#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const appName = args[0];

if (!appName) {
  console.error("❌ Missing app name.");
  console.error("Usage: pnpm create:mobile <name>");
  process.exit(1);
}

/**
 * Folder Convention:
 * apps/mobile/<name>
 */
const baseDir = path.join("apps", "mobile");

if (!fs.existsSync("apps")) fs.mkdirSync("apps");
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

console.log("✅ Creating Expo Mobile App:", appName);

process.chdir(baseDir);

/**
 * Step 1: Official Expo scaffold (pinned, no install)
 */
execSync(
  `pnpm dlx create-expo-app@3.5.3 ${appName}`,
  { stdio: "inherit" }
);

/**
 * Step 2: Enter app directory
 */
process.chdir(appName);

console.log("\n✅ Installing Template contract-only workspace packages...");

/**
 * Step 3: Install ONLY portable shared deps
 * ✅ types
 * ✅ utils
 * ✅ database
 * ✅ storage
 * ❌ ui forbidden in Expo
 */
execSync(
  "pnpm add @template/types @template/utils @template/database @template/storage @template/env --workspace",
  { stdio: "inherit" }
);

/**
 * Step 4: Add shared TS baseline
 */
execSync("pnpm add -D @template/typescript-config --workspace", {
  stdio: "inherit",
});

console.log("\n✅ Expo app created with contract-only sharing.");
console.log("✅ UI is local to mobile (no cross-runtime contamination).");

console.log("\n🎉 Mobile app created successfully!");
console.log("Next steps:");
console.log(`cd apps/mobile/${appName}`);
console.log("pnpm start");
