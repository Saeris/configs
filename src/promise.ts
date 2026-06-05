import type { OxlintConfig } from "vite-plus/lint";

/**
 * Async/Promise correctness rules from the `promise` plugin: enforces
 * resolution paths, discourages mixing callbacks with Promises, and prefers
 * `async`/`await` over raw `.then()` chains.
 */
export const promise: OxlintConfig = {
  plugins: ["promise"],
  rules: {
    "promise/always-return": "error",
    "promise/catch-or-return": [
      "error",
      {
        terminationMethod: ["catch", "finally"]
      }
    ],
    "promise/no-multiple-resolved": "error",
    "promise/no-nesting": "warn",
    "promise/no-new-statics": "error",
    "promise/no-promise-in-callback": "warn",
    "promise/no-return-in-finally": "error",
    "promise/no-return-wrap": "error",
    "promise/param-names": "error",
    "promise/prefer-await-to-callbacks": "error",
    "promise/prefer-await-to-then": "error",
    "promise/valid-params": "error"
  }
};
