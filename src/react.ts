import type { OxlintConfig } from "vite-plus/lint";

/**
 * React config: rules from the `react`, `react-perf`, and `jsx-a11y` plugins.
 *
 * In oxlint the `react` plugin folds in what were three separate ESLint plugins
 * (`eslint-plugin-react`, `eslint-plugin-react-hooks`, and
 * `eslint-plugin-react-refresh`), so the hooks rules live under `react/*` here
 * (`react/rules-of-hooks`, `react/exhaustive-deps`).
 *
 * `react/react-in-jsx-scope` is left off because this targets the modern JSX
 * transform, where importing `React` into scope is unnecessary. Layout-only
 * concerns (JSX indentation, spacing) are intentionally absent — those belong
 * to {@link "./fmt".fmt}, not the linter.
 *
 * Scoped to `**\/*.{j,t}s?(x)` and enables the browser environment.
 */
export const react: OxlintConfig = {
  plugins: ["react", "react-perf", "jsx-a11y"],
  env: {
    browser: true
  },
  overrides: [
    {
      files: ["**/*.{j,t}s?(x)"],
      rules: {
        // ── react ──────────────────────────────────────────────────────
        "react/rules-of-hooks": "error",
        "react/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off",
        "react/button-has-type": "error",
        "react/checked-requires-onchange-or-readonly": "error",
        "react/display-name": "off",
        "react/forward-ref-uses-ref": "warn",
        "react/hook-use-state": "warn",
        "react/iframe-missing-sandbox": "error",
        "react/jsx-boolean-value": ["warn", "never"],
        "react/jsx-key": "error",
        "react/jsx-no-comment-textnodes": "error",
        "react/jsx-no-constructed-context-values": "warn",
        "react/jsx-no-duplicate-props": "error",
        "react/jsx-no-script-url": "error",
        "react/jsx-no-target-blank": "error",
        "react/jsx-no-undef": "error",
        "react/jsx-no-useless-fragment": "warn",
        "react/jsx-pascal-case": "warn",
        "react/jsx-props-no-spread-multi": "error",
        "react/no-array-index-key": "warn",
        "react/no-children-prop": "error",
        "react/no-danger-with-children": "error",
        "react/no-direct-mutation-state": "error",
        "react/no-find-dom-node": "error",
        "react/no-is-mounted": "error",
        "react/no-namespace": "error",
        "react/no-object-type-as-default-prop": "warn",
        "react/no-render-return-value": "error",
        "react/no-string-refs": "error",
        "react/no-this-in-sfc": "error",
        "react/no-unescaped-entities": "warn",
        "react/no-unknown-property": "error",
        "react/no-unsafe": "warn",
        "react/no-unstable-nested-components": "warn",
        "react/self-closing-comp": "warn",
        "react/style-prop-object": "warn",
        "react/void-dom-elements-no-children": "error",
        // ── react-perf ─────────────────────────────────────────────────
        "react-perf/jsx-no-jsx-as-prop": "warn",
        "react-perf/jsx-no-new-array-as-prop": "warn",
        "react-perf/jsx-no-new-function-as-prop": "warn",
        "react-perf/jsx-no-new-object-as-prop": "warn",
        // ── jsx-a11y ───────────────────────────────────────────────────
        "jsx-a11y/alt-text": "error",
        "jsx-a11y/anchor-ambiguous-text": "warn",
        "jsx-a11y/anchor-has-content": "error",
        "jsx-a11y/anchor-is-valid": "error",
        "jsx-a11y/aria-activedescendant-has-tabindex": "error",
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-proptypes": "error",
        "jsx-a11y/aria-role": "error",
        "jsx-a11y/aria-unsupported-elements": "error",
        "jsx-a11y/autocomplete-valid": "error",
        "jsx-a11y/click-events-have-key-events": "warn",
        "jsx-a11y/control-has-associated-label": "warn",
        "jsx-a11y/heading-has-content": "error",
        "jsx-a11y/html-has-lang": "error",
        "jsx-a11y/iframe-has-title": "error",
        "jsx-a11y/img-redundant-alt": "error",
        "jsx-a11y/interactive-supports-focus": "error",
        "jsx-a11y/label-has-associated-control": "error",
        "jsx-a11y/lang": "error",
        "jsx-a11y/media-has-caption": "warn",
        "jsx-a11y/mouse-events-have-key-events": "error",
        "jsx-a11y/no-access-key": "error",
        "jsx-a11y/no-aria-hidden-on-focusable": "error",
        "jsx-a11y/no-autofocus": "warn",
        "jsx-a11y/no-distracting-elements": "error",
        "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
        "jsx-a11y/no-noninteractive-element-interactions": "warn",
        "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
        "jsx-a11y/no-noninteractive-tabindex": "error",
        "jsx-a11y/no-redundant-roles": "error",
        "jsx-a11y/no-static-element-interactions": "warn",
        "jsx-a11y/prefer-tag-over-role": "warn",
        "jsx-a11y/role-has-required-aria-props": "error",
        "jsx-a11y/role-supports-aria-props": "error",
        "jsx-a11y/scope": "error",
        "jsx-a11y/tabindex-no-positive": "warn"
      }
    }
  ]
};
