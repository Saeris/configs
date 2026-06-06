import type { OxlintConfig } from "vite-plus/lint";

/**
 * Next.js config: rules from the `nextjs` plugin (fonts, scripts, `<Image>`,
 * document/head conventions).
 *
 * Intended to be composed *after* {@link "./react".react}, since Next is React:
 *
 * ```ts
 * mergeLint(base, imports, promise, typescript, react, next)
 * ```
 *
 * The default-export exception for Next route files (`app/`, `pages/`,
 * `middleware`, `next.config`) lives in {@link "./imports".imports}, not here —
 * it's an import-rule concern that applies whether or not these Next-specific
 * plugin rules are in use.
 */
export const next: OxlintConfig = {
  plugins: ["nextjs"],
  overrides: [
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
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
    }
  ]
};
