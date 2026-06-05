import type { OxlintConfig } from "vite-plus/lint";

/**
 * Vitest rules from the `vitest` plugin, scoped to spec/test files. Enforces
 * consistent test authoring (filenames, titles, hook ordering) and steers
 * matcher/assertion usage toward the idiomatic forms.
 */
export const vitest: OxlintConfig = {
  overrides: [
    {
      files: ["**/*.{spec,test}.{j,t}s?(x)"],
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
        "vitest/no-conditional-expect": "warn",
        "vitest/no-conditional-in-test": "warn",
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
        "vitest/valid-expect": "error"
      }
    }
  ]
};
