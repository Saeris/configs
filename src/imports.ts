import type { OxlintConfig } from "vite-plus/lint";

/**
 * Import hygiene rules from the `import` plugin: resolution, ordering, and
 * cycle/duplicate detection.
 *
 * Rule names use Oxlint's `import/` prefix — NOT `import-x/`. Oxlint implements
 * the import plugin natively and registers its rules under `import/`; the
 * `import-x/` prefix (from the `eslint-plugin-import-x` ESLint package) is
 * silently ignored, so every rule set under it is a no-op. Verify accepted
 * names with `vp lint --rules` before adding rules here.
 *
 * This fragment also owns the default-export *exceptions* for known file
 * conventions (config files, Storybook stories, Next.js route files). Those
 * are import-rule concerns, not framework concerns: a Next route file must
 * default-export regardless of whether the `next` rule scope is in use. Keeping
 * the exceptions here means they apply whenever `imports` is composed — they
 * don't depend on pulling in a framework preset.
 *
 * Oxlint resolves modules with its own built-in resolver and exposes no
 * ESLint-style `import` resolver/extension settings, so there is no `settings`
 * block here (the `eslint-plugin-import-x` resolver config would be ignored).
 */
export const imports: OxlintConfig = {
  plugins: ["import"],
  rules: {
    "import/export": "error",
    "import/no-empty-named-blocks": "warn",
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "warn",
    "import/no-named-as-default-member": "warn",
    "import/default": "error",
    "import/named": "error",
    "import/namespace": "error",
    "import/no-absolute-path": "error",
    "import/no-cycle": "warn",
    "import/no-dynamic-require": "error",
    "import/no-self-import": "error",
    "import/no-webpack-loader-syntax": "error",
    "import/first": ["error", "absolute-first"],
    "import/no-anonymous-default-export": "warn",
    "import/no-default-export": "warn",
    "import/no-duplicates": "error"
  },
  overrides: [
    {
      // Files that conventionally use a default export: build/tool configs and
      // Storybook stories.
      files: [
        "**/*.stories.{js,jsx,ts,tsx}",
        "**/*.config.{js,ts,mjs,mts,cjs,cts}"
      ],
      rules: {
        "import/no-default-export": "off",
        "import/no-anonymous-default-export": "off"
      }
    },
    {
      // Next.js route files (App + Pages routers, middleware, next.config) must
      // be default exports by convention. Scoped to those paths only, so the
      // ban stays on everywhere else. Applies independently of the `next` rule
      // scope — adopt the convention without the Next-specific plugin rules.
      files: [
        "**/app/**/*.{js,jsx,ts,tsx}",
        "**/pages/**/*.{js,jsx,ts,tsx}",
        "**/middleware.{js,jsx,ts,tsx}",
        "**/next.config.{js,ts,mjs,mts,cjs,cts}"
      ],
      rules: {
        "import/no-default-export": "off",
        "import/no-anonymous-default-export": "off"
      }
    }
  ]
};
