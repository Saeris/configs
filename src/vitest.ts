import type { OxlintConfig } from "vite-plus/lint";
import { TEST_FILES } from "./globs.js";

/**
 * Vitest rules from the `vitest` plugin, scoped to test code ({@link
 * "./globs".TEST_FILES}: spec/test, bench, and `__tests__/` files). Enforces
 * consistent test authoring (filenames, titles, hook ordering) and steers
 * matcher/assertion usage toward the idiomatic forms.
 *
 * Also relaxes a defined set of type-aware `@typescript-eslint/*` rules for
 * test code — rules that produce noise on idiomatic test patterns (casts,
 * structural `async` mocks, deliberate `@deprecated` usage, void-schema
 * assertions, intentionally-mixed enum fixtures) without surfacing real bugs in
 * tests. Compose this *after* {@link "./type-aware".typeAware} so the
 * relaxations win for test files; the default `lint` already does.
 */
export const vitest: OxlintConfig = {
  overrides: [
    {
      files: TEST_FILES,
      plugins: ["vitest"],
      rules: {
        "vitest/consistent-test-filename": "off",
        "vitest/consistent-test-it": "error",
        "vitest/expect-expect": [
          "error",
          {
            assertFunctionNames: ["expect", "expect*"]
          }
        ],
        "vitest/max-expects": "off",
        "vitest/max-nested-describe": "off",
        "vitest/no-alias-methods": "warn",
        "vitest/no-commented-out-tests": "warn",
        // Off, not warn: property-based tests (fast-check et al.) branch on
        // generated input inside the property callback — the conditional that
        // adapts to randomized data IS the test, not noise to split into cases.
        // The rules' "split into deterministic cases" premise is example-based
        // only, so they fight a first-class testing pattern this config endorses.
        "vitest/no-conditional-expect": "off",
        "vitest/no-conditional-in-test": "off",
        "vitest/no-conditional-tests": "warn",
        "vitest/no-disabled-tests": "warn",
        "vitest/no-duplicate-hooks": "error",
        "vitest/no-focused-tests": "error",
        "vitest/no-hooks": "off",
        "vitest/no-identical-title": "error",
        "vitest/no-import-node-test": "error",
        "vitest/no-interpolation-in-snapshots": "error",
        "vitest/no-large-snapshots": [
          "warn",
          {
            maxSize: 32
          }
        ],
        "vitest/no-mocks-import": "error",
        "vitest/no-restricted-matchers": "off",
        "vitest/no-standalone-expect": "error",
        "vitest/no-test-prefixes": "error",
        "vitest/no-test-return-statement": "error",
        "vitest/prefer-called-with": "warn",
        "vitest/prefer-comparison-matcher": "warn",
        "vitest/prefer-describe-function-title": "off",
        "vitest/prefer-each": "warn",
        "vitest/prefer-equality-matcher": "warn",
        "vitest/prefer-expect-resolves": "warn",
        "vitest/prefer-hooks-in-order": "warn",
        "vitest/prefer-hooks-on-top": "warn",
        "vitest/prefer-lowercase-title": "warn",
        "vitest/prefer-mock-promise-shorthand": "warn",
        "vitest/prefer-spy-on": "warn",
        "vitest/prefer-strict-equal": "off",
        "vitest/prefer-to-be": "off",
        "vitest/prefer-to-be-falsy": "off",
        "vitest/prefer-to-be-object": "warn",
        "vitest/prefer-to-be-truthy": "off",
        "vitest/prefer-to-contain": "warn",
        "vitest/prefer-to-have-length": "warn",
        "vitest/prefer-todo": "warn",
        "vitest/no-restricted-vi-methods": "warn",
        "vitest/prefer-strict-boolean-matchers": "warn",
        "vitest/require-local-test-context-for-concurrent-snapshots": "warn",
        "vitest/require-mock-type-parameters": "warn",
        "vitest/require-to-throw-message": "off",
        "vitest/require-top-level-describe": "error",
        "vitest/valid-describe-callback": "error",
        "vitest/valid-expect": "error",
        // Type-aware rules relaxed for test code. These fire on idiomatic test
        // patterns that aren't bugs in the test context. Because `vitest` is
        // composed after `typeAware` in the default `lint`, this spec-scoped
        // override wins over `typeAware` for matching files.
        //
        // Off: the violation is the intended test idiom, not a smell —
        //   - casts to shape mock/faker output or narrow assertions,
        //   - `async` mocks satisfying an async signature structurally,
        //   - deliberately exercising `@deprecated` APIs to test the contract,
        //   - asserting on void-schema output (`expect(mock(v.void_()))`),
        //   - intentionally-mixed enum fixtures that exist to test that case,
        //   - defensive `if (!x) throw` guards around `T | undefined` in tests.
        "@typescript-eslint/no-unsafe-type-assertion": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-deprecated": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/no-mixed-enums": "off",
        "@typescript-eslint/no-unnecessary-condition": "off",
        // Warn (not off): still worth surfacing in tests, but not blocking —
        //   `array-type` / `prefer-includes` are purely stylistic here.
        "@typescript-eslint/array-type": "warn",
        "@typescript-eslint/prefer-includes": "warn"
      }
    }
  ]
};
