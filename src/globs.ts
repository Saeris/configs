/**
 * File globs shared across config fragments, so the set stays in sync rather
 * than drifting between `base`, `typescript`, and `vitest`.
 */

/**
 * Test and test-adjacent files. Covers spec/test files, Vitest benchmark files,
 * and anything under a `__tests__/` directory (helpers, fixtures, factories that
 * aren't named `.spec`/`.test`). Used by every fragment that relaxes rules for
 * test code, and exported so consumers can reuse the exact same set in their
 * own overrides.
 *
 * Brace expansion only — no extglob (`?(x)`), which oxlint silently drops in
 * `overrides[].files` (oxc#21525).
 */
export const TEST_FILES = [
  "**/*.{spec,test}.{js,jsx,ts,tsx}",
  "**/*.bench.{ts,tsx}",
  "**/__tests__/**"
];
