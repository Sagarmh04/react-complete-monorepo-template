#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * StudioVault Cron Worker Creator
 *
 * Usage:
 *   pnpm create:cron-worker cleanup --cron "0 * /5 * * *" (there is no space between the * and / in * /5 , it is stuffed so that the comment does not break)
 *   pnpm create:cron-worker sync --cron "* /30 * * * *"
 *   pnpm create:cron-worker daily --cron "0 2 * * *"
 *
 * Creates:
 *   apps/cron/<name>
 *
 * Guarantees:
 * - Official Cloudflare CLI only
 * - Scheduled Worker only
 * - Safe tsconfig patching
 * - Safe wrangler cron trigger insertion
 * - No silent overwrite failures
 */

const args = process.argv.slice(2);

const workerName = args[0];
const cronFlagIndex = args.indexOf("--cron");
const cronExpr = cronFlagIndex !== -1 ? args[cronFlagIndex + 1] : null;

if (!workerName) {
    console.error("❌ Missing worker name.");
    console.error('Usage: pnpm create:cron-worker <name> --cron "*/30 * * * *"');
    process.exit(1);
}

if (!cronExpr) {
    console.error("❌ Missing --cron argument.");
    console.error('Example: pnpm create:cron-worker cleanup --cron "0 */5 * * *"');
    process.exit(1);
}

/**
 * Basic cron validation: exactly 5 fields
 */
const cronParts = cronExpr.trim().split(/\s+/);
if (cronParts.length !== 5) {
    console.error("❌ Invalid cron expression:", cronExpr);
    console.error('Cron must have exactly 5 fields. Example: "*/30 * * * *"');
    process.exit(1);
}

/**
 * Folder Convention:
 * apps/cron/<workerName>
 */
if (!fs.existsSync("apps")) fs.mkdirSync("apps");
if (!fs.existsSync(path.join("apps", "cron")))
    fs.mkdirSync(path.join("apps", "cron"));

console.log("✅ Creating StudioVault Cron Worker:", workerName);
console.log("⏱️ Schedule:", cronExpr);

/**
 * Step 1: Scaffold Worker with official Cloudflare CLI
 */
process.chdir(path.join("apps", "cron"));

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
 * Step 4: Patch tsconfig.json safely
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
    fs.writeFileSync(tsconfigPath, desiredTsconfig);
}

/**
 * Step 5: Patch wrangler.jsonc with cron trigger safely
 */
console.log("✅ Ensuring wrangler.jsonc contains cron trigger...");

const wranglerPath = "wrangler.jsonc";

if (!fs.existsSync(wranglerPath)) {
    console.error("❌ wrangler.jsonc not found. Cloudflare template changed.");
    process.exit(1);
}

const rawWrangler = fs.readFileSync(wranglerPath, "utf8");

if (rawWrangler.includes("StudioVault Monorepo Fix")) {
    console.log("✅ Already patched. Skipping.");
} else {
    try {
        // Insert marker and triggers as top-level JSON fields (format-independent)
        const patched = rawWrangler.replace(
            /^\s*\{/,
            `{\n  "_studiovault": "StudioVault Monorepo Fix",\n  "triggers": {\n    "crons": ["${cronExpr}"]\n  },`
        );

        if (patched === rawWrangler) {
            console.warn("⚠️ Format changed, patch not applied. Manual review required.");
        } else {
            fs.writeFileSync(wranglerPath, patched);
            console.log("✅ Cron trigger inserted.");
        }
    } catch (err) {
        console.warn("⚠️ Format changed, patch not applied. Manual review required.");
        console.error(err);
    }
}

/**
 * Step 6: Write scheduled worker entry safely
 */
console.log("✅ Writing scheduled worker entrypoint...");

const entryFile = path.join("src", "index.ts");

fs.writeFileSync(
    entryFile,
    `import { slugify } from "@studiovault/utils";

export default {
  /**
   * StudioVault Cron Worker
   * Schedule: ${cronExpr}
   */
  async scheduled(): Promise<void> {
    const name = slugify("${workerName}");
    console.log("⏱️ Cron tick from:", name);

    // TODO: Implement scheduled job here
  }
};
`
);

console.log("\n🎉 Cron Worker created successfully!");
console.log("Next steps:");
console.log(`cd apps/cron/${workerName}`);
console.log("pnpm dev");
