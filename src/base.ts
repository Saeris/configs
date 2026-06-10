import type { OxlintConfig } from "vite-plus/lint";

/**
 * Base config: vanilla ESLint-equivalent rules from the `oxc` and `unicorn`
 * plugins, plus the global `correctness` category and built-in environment.
 *
 * The bulk of the rules live in a `**\/*.{js,mjs,cjs,jsx}` override so they target
 * JavaScript files; TypeScript files turn many of them off in favour of the
 * typed equivalents (see {@link "./typescript".typescript}).
 *
 * Node globals (`process`, `__dirname`, etc.) and `no-console` relaxation are
 * scoped to Node-shaped files — `scripts/**`, `*.{mjs,cjs}` tooling, and config
 * files — rather than enabled globally. This keeps `src/**` honest: `no-undef`
 * still flags an accidental `process` in browser/isomorphic library code. A
 * Node-targeted library opts into `env: { node: true }` itself.
 */
export const base: OxlintConfig = {
  plugins: ["oxc", "unicorn"],
  categories: {
    correctness: "warn"
  },
  env: {
    builtin: true
  },
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,jsx}"],
      rules: {
        "array-callback-return": [
          "warn",
          {
            allowImplicit: true,
            checkForEach: true
          }
        ],
        "constructor-super": "error",
        "for-direction": "error",
        "getter-return": "error",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "error",
        "no-class-assign": "error",
        "no-compare-neg-zero": "error",
        "no-cond-assign": ["error", "always"],
        "no-const-assign": "error",
        "no-constant-binary-expression": "error",
        "no-constant-condition": "warn",
        "no-constructor-return": "error",
        "no-control-regex": "error",
        "no-debugger": "warn",
        "no-dupe-class-members": "error",
        "no-dupe-else-if": "error",
        "no-dupe-keys": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": [
          "error",
          {
            includeExports: true
          }
        ],
        "no-empty-character-class": "error",
        "no-empty-pattern": "error",
        "no-ex-assign": "error",
        "no-fallthrough": "error",
        "no-func-assign": "error",
        "no-import-assign": "error",
        "no-inner-declarations": "error",
        "no-invalid-regexp": "error",
        "no-irregular-whitespace": "error",
        "no-loss-of-precision": "error",
        "no-misleading-character-class": "error",
        "no-new-native-nonconstructor": "warn",
        "no-obj-calls": "error",
        "no-promise-executor-return": "error",
        "no-prototype-builtins": "error",
        "no-self-assign": "error",
        "no-self-compare": "error",
        "no-setter-return": "error",
        "no-sparse-arrays": "error",
        "no-template-curly-in-string": "error",
        "no-this-before-super": "error",
        "no-unassigned-vars": "error",
        "no-undef": "error",
        "no-unexpected-multiline": "off",
        "no-unmodified-loop-condition": "warn",
        "no-unreachable": "error",
        "no-unsafe-finally": "error",
        "no-unsafe-negation": "error",
        "no-unsafe-optional-chaining": "error",
        "no-unused-private-class-members": "warn",
        "no-unused-vars": "warn",
        "no-use-before-define": [
          "error",
          {
            functions: false
          }
        ],
        "no-useless-backreference": "error",
        "use-isnan": "error",
        "valid-typeof": "error",
        "accessor-pairs": "error",
        "arrow-body-style": ["error", "as-needed"],
        "block-scoped-var": "error",
        "capitalized-comments": "off",
        "class-methods-use-this": "off",
        complexity: "off",
        "@typescript-eslint/consistent-return": "off",
        curly: ["error", "multi-line"],
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "@typescript-eslint/dot-notation": [
          "error",
          {
            allowKeywords: true
          }
        ],
        eqeqeq: ["error", "smart"],
        "func-names": "off",
        "func-style": [
          "error",
          "declaration",
          {
            allowArrowFunctions: true
          }
        ],
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "id-length": "off",
        "init-declarations": "off",
        "max-classes-per-file": "off",
        "max-depth": "off",
        "max-lines": "off",
        "max-lines-per-function": "off",
        "max-nested-callbacks": "off",
        "max-params": "off",
        "max-statements": "off",
        "new-cap": [
          "error",
          {
            newIsCap: true
          }
        ],
        "no-alert": "error",
        "no-array-constructor": "off",
        "no-bitwise": [
          "error",
          {
            allow: ["~"]
          }
        ],
        "no-caller": "error",
        "no-case-declarations": "error",
        "no-console": "warn",
        "no-continue": "error",
        "no-delete-var": "error",
        "no-div-regex": "error",
        "no-else-return": "error",
        "no-empty": "error",
        "no-empty-function": [
          "error",
          {
            allow: ["arrowFunctions", "constructors"]
          }
        ],
        "no-empty-static-block": "error",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-boolean-cast": "error",
        "no-extra-label": "error",
        "no-global-assign": "error",
        "no-implicit-coercion": "off",
        "no-inline-comments": "off",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "error",
        "no-magic-numbers": "off",
        "no-multi-assign": "error",
        "no-multi-str": "error",
        "no-negated-condition": "error",
        "no-nested-ternary": "off",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-nonoctal-decimal-escape": "error",
        "no-object-constructor": "error",
        "no-param-reassign": "error",
        "no-plusplus": "off",
        "no-proto": "error",
        "no-redeclare": "error",
        "no-regex-spaces": "error",
        "no-restricted-globals": "off",
        "no-restricted-imports": "off",
        "no-return-assign": ["error", "always"],
        "no-script-url": "error",
        "no-sequences": "error",
        "no-shadow": "error",
        "no-shadow-restricted-names": "error",
        "no-ternary": "off",
        "no-throw-literal": "error",
        "no-undefined": "error",
        "no-unneeded-ternary": "error",
        "no-unused-expressions": "off",
        "no-unused-labels": "error",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-escape": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-void": [
          "error",
          {
            allowAsStatement: true
          }
        ],
        "no-warning-comments": "off",
        "no-with": "error",
        "operator-assignment": ["error", "always"],
        "prefer-const": "off",
        "prefer-destructuring": "off",
        "prefer-exponentiation-operator": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-has-own": "error",
        "prefer-object-spread": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        radix: "error",
        "require-await": "error",
        "require-yield": "error",
        "sort-imports": "off",
        "sort-keys": "off",
        "sort-vars": "off",
        "symbol-description": "error",
        "vars-on-top": "error",
        yoda: "error",
        "unicode-bom": "off"
      }
    },
    {
      files: ["**/*.{spec,test}.{js,jsx,ts,tsx}"],
      rules: {
        "no-console": "off",
        "no-undefined": "off"
      }
    },
    {
      // Node-shaped files: build/tooling scripts, standalone `.mjs`/`.cjs`
      // tooling, and config files. These run in Node, so enable Node globals
      // (`process`, `__dirname`, `URL`, …) to stop `no-undef` from firing, and
      // allow `console` since logging is the point of a script. Scoped here, so
      // `src/**` keeps `builtin`-only globals and the `no-console: warn` default.
      files: [
        "scripts/**",
        "**/*.{mjs,cjs}",
        "**/*.config.{js,ts,mjs,mts,cjs,cts}"
      ],
      env: {
        node: true
      },
      rules: {
        "no-console": "off"
      }
    }
  ]
};
