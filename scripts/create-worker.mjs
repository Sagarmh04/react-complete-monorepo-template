#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * StudioVault API Worker Creator (HTTP-only)
 *
 * Usage:
 *   pnpm create:worker edge
 *   pnpm create:worker auth
 *
 * Creates:
 *   apps/api/<name>
 *
 * Guarantees:
 * - Official Cloudflare CLI only
 * - HTTP Worker only (no cron triggers)
 * - Installs shared workspace deps
 * - Patches tsconfig safely
 * - Writes fetch() entrypoint safely
 */

const workerName = process.argv[2];

if (!workerName) {
  console.error("❌ Missing worker name.");
  console.error("Usage: pnpm create:worker <name>");
  process.exit(1);
}

/**
 * Folder Convention:
 * apps/api/<workerName>
 */
if (!fs.existsSync("apps")) fs.mkdirSync("apps");
if (!fs.existsSync(path.join("apps", "api")))
  fs.mkdirSync(path.join("apps", "api"));

console.log("✅ Creating StudioVault API Worker:", workerName);

/**
 * Step 1: Scaffold Worker with official Cloudflare CLI
 */
process.chdir(path.join("apps", "api"));

execSync(`pnpm create cloudflare@latest ${workerName}`, {
  stdio: "inherit",
});

/**
 * Step 2: Enter worker directory
 */
process.chdir(workerName);

/**
 * Step 3: Install shared StudioVault dependencies
 */
console.log("\n✅ Installing shared StudioVault workspace dependencies...");

execSync("pnpm add @studiovault/utils @studiovault/types --workspace", {
  stdio: "inherit",
});

execSync("pnpm add -D @studiovault/typescript-config --workspace", {
  stdio: "inherit",
});

/**
 * Step 4: Patch tsconfig.json safely (no blind overwrite)
 */
console.log("✅ Ensuring tsconfig.json extends StudioVault baseline...");

const tsconfigPath = "tsconfig.json";

const desiredTsconfig = `{
  "_studiovault": "StudioVault Monorepo Fix",
  "extends": "@studiovault/typescript-config/base.json",

  "compilerOptions": {
    "types": ["./worker-configuration.d.ts"]
  },

  "include": ["worker-configuration.d.ts", "src/**/*.ts"],
  "exclude": ["test"]
}
`;

if (fs.existsSync(tsconfigPath)) {
  const raw = fs.readFileSync(tsconfigPath, "utf8");

  if (raw.includes(`"_studiovault": "StudioVault Monorepo Fix"`)) {
    console.log("✅ Already patched. Skipping.");
  } else {
    try {
      fs.writeFileSync(tsconfigPath, desiredTsconfig);
      console.log("✅ tsconfig.json patched successfully.");
    } catch (err) {
      console.warn("⚠️ Format changed, patch not applied. Manual review required.");
      console.error(err);
    }
  }
} else {
  console.warn("⚠️ tsconfig.json missing. Writing fresh baseline.");
  fs.writeFileSync(tsconfigPath, desiredTsconfig);
}

/**
 * Step 5: Ensure HTTP-only worker (remove triggers if present)
 */
console.log("✅ Ensuring HTTP-only Worker (no cron triggers)...");

const wranglerConfigPath = "wrangler.jsonc";

if (fs.existsSync(wranglerConfigPath)) {
  const raw = fs.readFileSync(wranglerConfigPath, "utf8");

  if (raw.includes(`"_studiovault": "StudioVault Monorepo Fix"`)) {
    console.log("✅ Already patched. Skipping.");
  } else if (raw.includes('"triggers"')) {
    try {
      // Remove triggers block
      const cleaned = raw.replace(
        /,\s*"triggers"\s*:\s*\{[\s\S]*?\}\s*/g,
        ""
      );

      // Add marker as top-level JSON field (format-independent)
      const withMarker = cleaned.replace(
        /^\s*\{/,
        `{\n  "_studiovault": "StudioVault Monorepo Fix",`
      );

      fs.writeFileSync(wranglerConfigPath, withMarker);
      console.log("✅ Removed triggers block (HTTP-only).");
    } catch (err) {
      console.warn("⚠️ Format changed, patch not applied. Manual review required.");
      console.error(err);
    }
  } else {
    // No triggers, just add marker
    try {
      const withMarker = raw.replace(
        /^\s*\{/,
        `{\n  "_studiovault": "StudioVault Monorepo Fix",`
      );
      fs.writeFileSync(wranglerConfigPath, withMarker);
      console.log("✅ No triggers found. Worker already HTTP-only.");
    } catch (err) {
      console.warn("⚠️ Format changed, patch not applied. Manual review required.");
      console.error(err);
    }
  }
} else {
  console.warn("⚠️ wrangler.jsonc not found. Cloudflare template may have changed.");
}

/**
 * Step 6: Write fetch() entrypoint safely
 */
console.log("✅ Writing API worker entrypoint...");

const entryFile = path.join("src", "index.ts");

if (fs.existsSync(entryFile)) {
  const existing = fs.readFileSync(entryFile, "utf8");

  if (existing.includes("StudioVault API Worker")) {
    console.log("✅ Entry already patched. Skipping.");
  } else {
    console.warn("⚠️ Entry exists but differs. Overwriting with template baseline.");
  }
}

fs.writeFileSync(
  entryFile,
  `import { slugify } from "@studiovault/utils";
import type { ApiResponse } from "@studiovault/types";

export default {
  async fetch(): Promise<Response> {
    const value = slugify("StudioVault API Worker: ${workerName}");

    const body: ApiResponse<string> = {
      success: true,
      data: value
    };

    return Response.json(body);
  }
};
`
);

console.log("\n🎉 API Worker created successfully!");
console.log("Next steps:");
console.log(`cd apps/api/${workerName}`);
console.log("pnpm dev");
