import type { OxlintConfig } from "vite-plus/lint";

/**
 * TypeScript rules that require full type information to evaluate. These are
 * the most powerful but also the most expensive checks, so they are gated
 * behind `options.typeAware`/`typeCheck` and split out from the syntactic
 * {@link "./typescript".typescript} rules.
 *
 * Consuming this config implies a typed lint run — `vp` must be able to build
 * the TypeScript program (i.e. a resolvable `tsconfig.json`).
 */
export const typeAware: OxlintConfig = {
  plugins: ["typescript"],
  options: {
    typeAware: true,
    typeCheck: true
  },
  overrides: [
    {
      files: ["**/*.?(m|c)ts?(x)"],
      rules: {
        "@typescript-eslint/non-nullable-type-assertion-style": "warn",
        "@typescript-eslint/prefer-find": "error",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-nullish-coalescing": [
          "error",
          {
            ignoreConditionalTests: true,
            ignoreMixedLogicalExpressions: true
          }
        ],
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/prefer-regexp-exec": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "warn",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/consistent-type-exports": "off",
        "@typescript-eslint/no-array-delete": "error",
        "@typescript-eslint/no-base-to-string": "error",
        "@typescript-eslint/no-confusing-void-expression": [
          "error",
          {
            ignoreArrowShorthand: true
          }
        ],
        "@typescript-eslint/no-deprecated": "warn",
        "@typescript-eslint/no-duplicate-type-constituents": "error",
        "@typescript-eslint/no-floating-promises": [
          "error",
          {
            ignoreIIFE: true
          }
        ],
        "@typescript-eslint/no-for-in-array": "error",
        "@typescript-eslint/no-meaningless-void-operator": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "@typescript-eslint/no-misused-spread": "error",
        "@typescript-eslint/no-mixed-enums": "error",
        "@typescript-eslint/no-redundant-type-constituents": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
        "@typescript-eslint/no-unnecessary-condition": "warn",
        "@typescript-eslint/no-unnecessary-qualifier": "warn",
        "@typescript-eslint/no-unnecessary-template-expression": "warn",
        "@typescript-eslint/no-unnecessary-type-arguments": "warn",
        "@typescript-eslint/no-unnecessary-type-assertion": "warn",
        "@typescript-eslint/no-unnecessary-type-conversion": "warn",
        "@typescript-eslint/no-unnecessary-type-parameters": "warn",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-enum-comparison": "warn",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-type-assertion": "warn",
        "@typescript-eslint/no-unsafe-unary-minus": "error",
        "@typescript-eslint/prefer-readonly": "off",
        "@typescript-eslint/prefer-readonly-parameter-types": "off",
        "@typescript-eslint/prefer-reduce-type-parameter": "warn",
        "@typescript-eslint/prefer-return-this-type": "error",
        "@typescript-eslint/promise-function-async": [
          "error",
          {
            allowedPromiseNames: ["Thenable"],
            checkArrowFunctions: true,
            checkFunctionDeclarations: true,
            checkFunctionExpressions: true,
            checkMethodDeclarations: true
          }
        ],
        "@typescript-eslint/related-getter-setter-pairs": "warn",
        "@typescript-eslint/require-array-sort-compare": "warn",
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/restrict-template-expressions": "warn",
        "@typescript-eslint/return-await": "error",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "warn",
        "@typescript-eslint/unbound-method": [
          "warn",
          {
            ignoreStatic: true
          }
        ],
        "@typescript-eslint/use-unknown-in-catch-callback-variable": "warn",
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/consistent-return": "off",
        "@typescript-eslint/no-implied-eval": "error",
        "no-throw-literal": "off",
        "@typescript-eslint/only-throw-error": "error",
        "prefer-destructuring": "off",
        "prefer-promise-reject-errors": "off",
        "@typescript-eslint/prefer-promise-reject-errors": "error",
        "require-await": "off",
        "@typescript-eslint/require-await": "error"
      }
    }
  ]
};
