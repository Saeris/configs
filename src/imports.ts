import type { OxlintConfig } from "vite-plus/lint";

/**
 * Import hygiene rules from the `import` plugin: resolution, ordering, and
 * cycle/duplicate detection. Settings configure the TypeScript-aware resolver
 * so path aliases and extensions resolve correctly.
 */
export const imports: OxlintConfig = {
  plugins: ["import"],
  rules: {
    "import-x/export": "error",
    "import-x/no-empty-named-blocks": "warn",
    "import-x/no-mutable-exports": "error",
    "import-x/no-named-as-default": "warn",
    "import-x/no-named-as-default-member": "warn",
    "import-x/default": "error",
    "import-x/named": "error",
    "import-x/namespace": "error",
    "import-x/no-absolute-path": "error",
    "import-x/no-cycle": "warn",
    "import-x/no-dynamic-require": "error",
    "import-x/no-self-import": "error",
    "import-x/no-webpack-loader-syntax": "error",
    "import-x/first": ["error", "absolute-first"],
    "import-x/no-anonymous-default-export": "warn",
    "import-x/no-default-export": "warn",
    "import-x/no-duplicates": "error"
  },
  settings: {
    "import-x/extensions": [".cjs", ".mjs", ".js", ".jsx", ".cts", ".mts", ".ts", ".tsx"],
    "import-x/resolver-next": [
      {
        interfaceVersion: 3,
        name: "eslint-import-resolver-typescript"
      },
      {
        interfaceVersion: 3,
        name: "eslint-plugin-import-x:node"
      }
    ]
  }
};
