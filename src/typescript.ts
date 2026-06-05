import type { OxlintConfig } from "vite-plus/lint";

/**
 * TypeScript rules from the `typescript` plugin that do **not** require type
 * information (syntactic/AST-only). These are safe to run without a typed
 * program, so they live separately from {@link "./type-aware".typeAware}.
 *
 * Three overrides cooperate here:
 * - `**\/*.{ts,mts,cts,tsx}` enables the typed-flavoured rules.
 * - `**\/*.{ts,tsx}` disables the base ESLint rules that TypeScript supersedes
 *   (the `@typescript-eslint/*` variants take over).
 * - `**\/*.{spec,test}.{js,jsx,ts,tsx}` relaxes explicit return types in tests.
 */
export const typescript: OxlintConfig = {
  plugins: ["typescript"],
  overrides: [
    {
      files: ["**/*.{ts,mts,cts,tsx}"],
      rules: {
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": [
          "error",
          {
            default: "array-simple"
          }
        ],
        "@typescript-eslint/ban-tslint-comment": "error",
        "@typescript-eslint/class-literal-property-style": "off",
        "@typescript-eslint/consistent-generic-constructors": "error",
        "@typescript-eslint/consistent-indexed-object-style": "off",
        "@typescript-eslint/consistent-type-assertions": [
          "error",
          {
            assertionStyle: "as"
          }
        ],
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        "@typescript-eslint/no-confusing-non-null-assertion": "error",
        "@typescript-eslint/no-inferrable-types": [
          "warn",
          {
            ignoreParameters: true,
            ignoreProperties: true
          }
        ],
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-function-type": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/explicit-module-boundary-types": ["warn"],
        "@typescript-eslint/no-duplicate-enum-values": "error",
        "@typescript-eslint/no-dynamic-delete": "warn",
        "@typescript-eslint/no-empty-object-type": [
          "warn",
          {
            allowInterfaces: "with-single-extends"
          }
        ],
        "@typescript-eslint/no-explicit-any": [
          "warn",
          {
            ignoreRestArgs: true
          }
        ],
        "@typescript-eslint/no-extra-non-null-assertion": "error",
        "@typescript-eslint/no-extraneous-class": "off",
        "@typescript-eslint/no-import-type-side-effects": "error",
        "@typescript-eslint/no-invalid-void-type": "warn",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": [
          "error",
          {
            allowDeclarations: true,
            allowDefinitionFiles: true
          }
        ],
        "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-require-imports": "warn",
        "@typescript-eslint/no-restricted-types": "off",
        "@typescript-eslint/no-this-alias": "error",
        "@typescript-eslint/no-unnecessary-parameter-property-assignment": "warn",
        "@typescript-eslint/no-unnecessary-type-constraint": "warn",
        "@typescript-eslint/no-unsafe-declaration-merging": "error",
        "@typescript-eslint/no-unsafe-function-type": "error",
        "@typescript-eslint/no-useless-empty-export": "error",
        "@typescript-eslint/no-wrapper-object-types": "warn",
        "@typescript-eslint/parameter-properties": "off",
        "@typescript-eslint/prefer-as-const": "warn",
        "@typescript-eslint/prefer-enum-initializers": "error",
        "@typescript-eslint/prefer-literal-enum-member": "error",
        "@typescript-eslint/prefer-namespace-keyword": "off",
        "@typescript-eslint/triple-slash-reference": [
          "error",
          {
            types: "prefer-import"
          }
        ],
        "@typescript-eslint/unified-signatures": "off",
        "class-methods-use-this": [
          "warn",
          {
            ignoreOverrideMethods: true,
            ignoreClassesThatImplementAnInterface: "public-fields"
          }
        ],
        "default-param-last": "error",
        "init-declarations": "off",
        "max-params": "off",
        "no-array-constructor": "off",
        "no-dupe-class-members": "error",
        "no-loop-func": "error",
        "no-magic-numbers": "off",
        "no-redeclare": "error",
        "no-restricted-imports": "off",
        "no-shadow": "error",
        "no-unused-expressions": "off",
        "no-unused-vars": [
          "error",
          {
            vars: "local",
            args: "none",
            ignoreRestSiblings: true
          }
        ],
        "no-use-before-define": [
          "error",
          {
            functions: true,
            classes: true
          }
        ],
        "no-useless-constructor": "error"
      }
    },
    {
      files: ["**/*.{ts,tsx}"],
      rules: {
        "default-param-last": "off",
        "@typescript-eslint/dot-notation": "off",
        "init-declarations": "off",
        "no-array-constructor": "off",
        "no-dupe-class-members": "off",
        "no-duplicate-imports": "off",
        "no-empty-function": "off",
        "no-loop-func": "off",
        "no-loss-of-precision": "off",
        "no-magic-numbers": "off",
        "no-redeclare": "off",
        "no-shadow": "off",
        "no-throw-literal": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "no-useless-constructor": "off",
        "require-await": "off"
      }
    },
    {
      files: ["**/*.{spec,test}.{js,jsx,ts,tsx}"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    }
  ]
};
