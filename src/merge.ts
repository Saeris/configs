import type { OxlintConfig } from "vite-plus/lint";

/**
 * Compose multiple {@link OxlintConfig} fragments into a single config.
 *
 * Oxlint uses one config object (not an array of configs like flat-config
 * ESLint), so composition is field-aware rather than a simple spread:
 *
 * - `plugins` are unioned and de-duplicated. Oxlint *replaces* the base plugin
 *   set whenever `plugins` is present, so a naive merge would drop plugins
 *   declared by earlier fragments.
 * - `overrides` are concatenated in argument order. Later overrides win for
 *   files they both match, so order is significant. Note: an override can only
 *   change a *plugin* rule (e.g. `vitest/*`, `react/*`) for files where that
 *   plugin is enabled — oxlint scopes plugin activation per-override. Every
 *   fragment here enables its plugin at the top level, so a consumer override
 *   can freely disable/relax any rule without re-declaring `plugins`.
 * - `categories`, `env`, `globals`, `rules`, `settings`, and `options` are
 *   shallow-merged, with later fragments overriding earlier keys.
 * - `ignorePatterns` are concatenated and de-duplicated.
 *
 * @example Compose your own config from scoped fragments:
 * ```ts
 * import { defineConfig } from "vite-plus";
 * import { mergeLint, base, typescript, react } from "@saeris/configs";
 *
 * export default defineConfig({ lint: mergeLint(base, typescript, react) });
 * ```
 *
 * @example Override the default `lint` config. Because the last fragment wins,
 * pass `lint` first and your overrides last. Top-level `rules` apply to every
 * file; scope file-specific tweaks with an `overrides` entry instead:
 * ```ts
 * import { defineConfig } from "vite-plus";
 * import { mergeLint, lint } from "@saeris/configs";
 *
 * export default defineConfig({
 *   lint: mergeLint(lint, {
 *     // turn a default rule off everywhere
 *     rules: { "no-console": "off" },
 *     // ...or only for certain files (appended after the defaults, so it wins)
 *     overrides: [{ files: ["scripts/**"], rules: { "no-console": "off" } }]
 *   })
 * });
 * ```
 */
export const mergeLint = (...configs: OxlintConfig[]): OxlintConfig =>
  configs.reduce<OxlintConfig>((acc, config) => {
    const merged: OxlintConfig = {
      ...acc,
      ...config
    };

    if (acc.plugins ?? config.plugins) {
      merged.plugins = [
        ...new Set([...(acc.plugins ?? []), ...(config.plugins ?? [])])
      ];
    }

    if (acc.categories ?? config.categories) {
      merged.categories = { ...acc.categories, ...config.categories };
    }

    if (acc.env ?? config.env) {
      merged.env = { ...acc.env, ...config.env };
    }

    if (acc.globals ?? config.globals) {
      merged.globals = { ...acc.globals, ...config.globals };
    }

    if (acc.rules ?? config.rules) {
      merged.rules = { ...acc.rules, ...config.rules };
    }

    if (acc.settings ?? config.settings) {
      merged.settings = { ...acc.settings, ...config.settings };
    }

    if (acc.options ?? config.options) {
      merged.options = { ...acc.options, ...config.options };
    }

    if (acc.overrides ?? config.overrides) {
      merged.overrides = [
        ...(acc.overrides ?? []),
        ...(config.overrides ?? [])
      ];
    }

    if (acc.ignorePatterns ?? config.ignorePatterns) {
      merged.ignorePatterns = [
        ...new Set([
          ...(acc.ignorePatterns ?? []),
          ...(config.ignorePatterns ?? [])
        ])
      ];
    }

    return merged;
  }, {});
