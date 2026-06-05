import type { OxlintConfig } from "vite-plus/lint";

/**
 * Next.js config: rules from the `nextjs` plugin, plus an override that relaxes
 * the default-export bans where Next's file conventions require them.
 *
 * Intended to be composed *after* {@link "./react".react} (Next is React), and
 * after {@link "./base".base}/{@link "./imports".imports} so the route-file
 * override below wins over their `import-x/no-default-export` warnings:
 *
 * ```ts
 * mergeLint(base, imports, promise, typescript, react, next)
 * ```
 *
 * Route files (`app/` and `pages/` entries, `middleware`, `next.config`) must
 * be default exports by convention, so the override disables the export bans
 * there only — they stay on everywhere else.
 */
export const next: OxlintConfig = {
  plugins: ["nextjs"],
  overrides: [
    {
      files: ["**/*.{j,t}s?(x)"],
      rules: {
        "nextjs/google-font-display": "error",
        "nextjs/google-font-preconnect": "error",
        "nextjs/inline-script-id": "error",
        "nextjs/next-script-for-ga": "error",
        "nextjs/no-assign-module-variable": "error",
        "nextjs/no-async-client-component": "error",
        "nextjs/no-before-interactive-script-outside-document": "error",
        "nextjs/no-css-tags": "error",
        "nextjs/no-document-import-in-page": "error",
        "nextjs/no-duplicate-head": "error",
        "nextjs/no-head-element": "error",
        "nextjs/no-head-import-in-document": "error",
        "nextjs/no-html-link-for-pages": "error",
        "nextjs/no-img-element": "error",
        "nextjs/no-page-custom-font": "error",
        "nextjs/no-script-component-in-head": "error",
        "nextjs/no-styled-jsx-in-document": "error",
        "nextjs/no-sync-scripts": "error",
        "nextjs/no-title-in-document-head": "error",
        "nextjs/no-typos": "warn",
        "nextjs/no-unwanted-polyfillio": "error"
      }
    },
    {
      files: [
        "**/app/**/*.{j,t}s?(x)",
        "**/pages/**/*.{j,t}s?(x)",
        "**/middleware.{j,t}s?(x)",
        "**/next.config.{js,ts,mjs,mts,cjs,cts}"
      ],
      rules: {
        "import-x/no-default-export": "off",
        "import-x/no-anonymous-default-export": "off"
      }
    }
  ]
};
