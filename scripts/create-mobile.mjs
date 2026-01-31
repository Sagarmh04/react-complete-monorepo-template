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
 * Step 1: Official Expo scaffold
 */
execSync(`pnpm create expo-app@latest ${appName}`, {
  stdio: "inherit",
});

/**
 * Step 2: Enter app directory
 */
process.chdir(appName);

console.log("\n✅ Installing StudioVault shared workspace packages...");

/**
 * Step 3: Install shared deps
 */
execSync(
  "pnpm add @studiovault/types @studiovault/utils @studiovault/ui --workspace",
  { stdio: "inherit" },
);

execSync("pnpm add -D @studiovault/typescript-config --workspace", {
  stdio: "inherit",
});

console.log("\n✅ Expo config preserved (no tsconfig overwrite).");

console.log("\n🎉 Mobile app created successfully!");
console.log("Next steps:");
console.log(`cd apps/mobile/${appName}`);
console.log("pnpm start");
