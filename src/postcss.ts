import type { pluginOptions as PresetEnvOptions } from "postcss-preset-env";

/**
 * The shape of a PostCSS config object as consumed by `postcss-load-config`
 * (the `postcss.config.*` file or the `postcss` key in `package.json`).
 */
interface PostcssConfig {
  plugins: {
    "postcss-preset-env": PresetEnvOptions;
  };
}

/**
 * Shared PostCSS config for modern CSS — native nesting, CSS Modules, and the
 * rest of the stable feature set — driven entirely by your project's
 * browserslist.
 *
 * One plugin, `postcss-preset-env`:
 * - `stage: 3` enables the stable, widely-shipping feature set.
 * - `nesting-rules: true` polyfills **spec** CSS Nesting (the `&`/bare-nesting
 *   syntax). This replaces `postcss-nested` entirely — `postcss-nested`
 *   implements the older Sass-style semantics, which can diverge from native
 *   nesting, so the two should never be combined.
 * - Autoprefixer is built in and reads your browserslist; there's no separate
 *   `autoprefixer` plugin or browser list to maintain here.
 *
 * Browser targets are intentionally **not** set here — `postcss-preset-env`
 * discovers them from your `browserslist` (`package.json` key or
 * `.browserslistrc`), which is the one genuinely per-project input. See the
 * README for a recommended target for ~2-year / older-phone support.
 *
 * `postcss-preset-env` is a peer dependency; install it alongside this package.
 *
 * @example Consume from a one-line `postcss.config.mjs`:
 * ```js
 * export { postcss as default } from "@saeris/configs/postcss";
 * ```
 *
 * @example Add per-project features (e.g. preserve relative-color output):
 * ```js
 * import { postcss } from "@saeris/configs/postcss";
 * export default postcss({
 *   features: { "relative-color-syntax": { preserve: true } }
 * });
 * ```
 */
export const postcss = (overrides: PresetEnvOptions = {}): PostcssConfig => {
  const { features, ...rest } = overrides;
  return {
    plugins: {
      "postcss-preset-env": {
        stage: 3,
        ...rest,
        features: {
          "nesting-rules": true,
          // Consumer features merge on top, so a project can enable/disable or
          // configure any feature without losing the nesting default.
          ...features
        }
      }
    }
  };
};
