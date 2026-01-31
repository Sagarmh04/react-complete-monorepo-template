#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const appName = args[0];

if (!appName) {
  console.error("❌ Missing app name.");
  console.error("Usage: pnpm create:desktop <name>");
  process.exit(1);
}

/**
 * Folder Convention:
 * apps/desktop/<name>
 */
const baseDir = path.join("apps", "desktop");

if (!fs.existsSync("apps")) fs.mkdirSync("apps");
if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

console.log("✅ Creating Electron Desktop App:", appName);

process.chdir(baseDir);

/**
 * Step 1: Official Electron-Vite scaffold
 */
execSync(`pnpm create electron-vite@latest ${appName}`, {
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

/**
 * Step 4: Patch tsconfig.app.json safely (do not overwrite structure)
 */
console.log("\n✅ Patching tsconfig.app.json (minimal extend merge)...");

const appTsconfigPath = "tsconfig.app.json";

if (fs.existsSync(appTsconfigPath)) {
  const raw = fs.readFileSync(appTsconfigPath, "utf8");
  const parsed = JSON.parse(raw);

  // Add extends only if missing
  if (!parsed.extends) {
    parsed.extends = "@studiovault/typescript-config/react.json";
  }

  fs.writeFileSync(appTsconfigPath, JSON.stringify(parsed, null, 2));
} else {
  console.warn("⚠️ tsconfig.app.json not found, skipping patch.");
}

console.log("\n✅ Electron-Vite config preserved (no degradation).");

console.log("\n🎉 Desktop app created successfully!");
console.log("Next steps:");
console.log(`cd apps/desktop/${appName}`);
console.log("pnpm dev");
