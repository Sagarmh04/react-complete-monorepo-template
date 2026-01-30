/**
 * StudioVault Utilities
 * Runtime-agnostic helpers only.
 */

/** Assert a value is never reached (exhaustive checking) */
export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

/** Simple safe string slugifier */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}
