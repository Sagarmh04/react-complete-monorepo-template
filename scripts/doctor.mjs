#!/usr/bin/env node

/**
 * StudioVault Doctor Script — Constitutional Validator
 *
 * Purpose:
 * Catch violations BEFORE CI.
 *
 * Checks:
 *  1. Toolchain lock (Node + pnpm)
 *  2. Shared package purity (no forbidden runtime imports)
 *  3. React runtime duplication (real React only, not @types)
 *
 * Run:
 *   pnpm check:doctor
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/* --------------------------------------------
 * Utilities
 * ------------------------------------------ */

function fail(msg) {
  console.error("\n❌ StudioVault Doctor Failed:");
  console.error("   " + msg);
  process.exit(1);
}

function ok(msg) {
  console.log("✅ " + msg);
}

function warn(msg) {
  console.warn("⚠️ " + msg);
}

/**
 * Recursively collect all .ts/.tsx files inside a directory
 */
function getSourceFilesRecursive(dir) {
  let results = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...getSourceFilesRecursive(fullPath));
    } else {
      if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

/* --------------------------------------------
 * 1. Toolchain Verification
 * ------------------------------------------ */

console.log("\n🔎 Checking toolchain...");

const nodeVersion = process.version;
if (!nodeVersion.startsWith("v20.")) {
  fail(`Node version must be 20.x. Found: ${nodeVersion}`);
}
ok(`Node version OK (${nodeVersion})`);

let pnpmVersion = "";
try {
  pnpmVersion = execSync("pnpm -v").toString().trim();
} catch {
  fail("pnpm is not installed or not in PATH.");
}

if (pnpmVersion !== "9.15.4") {
  fail(`pnpm must be 9.15.4. Found: ${pnpmVersion}`);
}
ok(`pnpm version OK (${pnpmVersion})`);

/* --------------------------------------------
 * 2. Shared Package Runtime Purity Scan
 * ------------------------------------------ */

console.log("\n🔎 Scanning shared packages for forbidden runtime imports...");

const forbiddenImports = [
  "fs",
  "path",
  "node:fs",
  "node:path",
  "child_process",
  "node:child_process",
];

/**
 * Matches all import styles:
 *
 * import fs from "fs"
 * import * as fs from "fs"
 * import { readFile } from "fs"
 */
function containsForbiddenImport(raw, mod) {
  const pattern = new RegExp(
    String.raw`from\s+["']${mod}["']|require\(\s*["']${mod}["']\s*\)`,
    "g"
  );

  return pattern.test(raw);
}

const packagesDir = path.join("packages");

if (!fs.existsSync(packagesDir)) {
  fail("packages/ folder not found.");
}

const packageList = fs.readdirSync(packagesDir);

for (const pkg of packageList) {
  const srcDir = path.join(packagesDir, pkg, "src");

  if (!fs.existsSync(srcDir)) continue;

  const files = getSourceFilesRecursive(srcDir);

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");

    for (const bad of forbiddenImports) {
      if (containsForbiddenImport(raw, bad)) {
        fail(
          `Forbidden import "${bad}" found in:\n   ${filePath}\n\nShared packages MUST remain runtime-agnostic.`
        );
      }
    }
  }
}

ok("No forbidden runtime imports found in packages/*");

/* --------------------------------------------
 * 3. React Runtime Duplication Check
 * ------------------------------------------ */

console.log("\n🔎 Checking for duplicate React runtime versions...");

const lockfilePath = "pnpm-lock.yaml";

if (!fs.existsSync(lockfilePath)) {
  warn("pnpm-lock.yaml not found. Skipping React duplication check.");
} else {
  const rawLock = fs.readFileSync(lockfilePath, "utf8");

  /**
   * Constitutional enforcement:
   * 1. Detect all React versions (format-agnostic)
   * 2. Fail if multiple versions exist
   * 3. Fail if version doesn't match constitutional 19.1.0
   */
  const all = rawLock.match(/(?<!@types\/)react@[0-9]+\.[0-9]+\.[0-9]+/g) || [];
  const unique = [...new Set(all)];

  if (unique.length === 0) {
    warn("React runtime not found in lockfile yet (no apps installed).");
  } else if (unique.length !== 1) {
    fail(
      `Multiple React runtimes detected:\n   ${unique.join(
        "\n   "
      )}\n\nThis WILL cause Invalid Hook Call bugs.\nRun clean install immediately.`
    );
  } else if (unique[0] !== "react@19.1.0") {
    fail(
      `React version drift detected:\n   Expected: react@19.1.0\n   Found: ${unique[0]
      }\n\nConstitutional override not applied.\nRun: rm -rf node_modules pnpm-lock.yaml && pnpm install`
    );
  } else {
    ok("Single React runtime detected (react@19.1.0)");
  }
}

console.log("\n🔎 Checking React dependency law...");

const uiPkg = JSON.parse(
  fs.readFileSync("packages/ui/package.json", "utf8")
);

if (uiPkg.dependencies?.react) {
  fail("packages/ui must NOT list react in dependencies — only peerDependencies.");
}

ok("React peer dependency law upheld (UI does not bundle React).");

/* --------------------------------------------
 * Final Success
 * ------------------------------------------ */

console.log("\n🎉 StudioVault Doctor: All checks passed.\n");
process.exit(0);
