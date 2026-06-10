import type { OxlintConfig } from "vite-plus/lint";
import { base } from "./base.js";
import { imports } from "./imports.js";
import { mergeLint } from "./merge.js";
import { promise } from "./promise.js";
import { typeAware } from "./type-aware.js";
import { typescript } from "./typescript.js";
import { vitest } from "./vitest.js";

export { mergeLint } from "./merge.js";
export { base } from "./base.js";
export { imports } from "./imports.js";
export { promise } from "./promise.js";
export { typescript } from "./typescript.js";
export { typeAware } from "./type-aware.js";
export { vitest } from "./vitest.js";
export { react } from "./react.js";
export { next } from "./next.js";
export { fmt } from "./fmt.js";
export { TEST_FILES } from "./globs.js";

/**
 * The sensible default lint config for most TypeScript library projects:
 * base + imports + promise + (syntactic) typescript + type-aware + vitest.
 *
 * Framework scopes (`react`, `next`) are intentionally *not* included — compose
 * them in yourself with {@link mergeLint} when you need them. Formatting/layout
 * is owned by {@link "./fmt".fmt} (oxlint has no stylistic plugin), so there is
 * nothing to add here for that.
 *
 * Drop it straight into `defineConfig`:
 *
 * ```ts
 * import { defineConfig } from "vite-plus";
 * import { lint, fmt } from "@saeris/configs";
 *
 * export default defineConfig({ lint, fmt });
 * ```
 *
 * To customise, compose fragments yourself with {@link mergeLint}:
 *
 * ```ts
 * import { mergeLint, base, typescript, react } from "@saeris/configs";
 *
 * export default defineConfig({ lint: mergeLint(base, typescript, react) });
 * ```
 */
export const lint: OxlintConfig = mergeLint(
  base,
  imports,
  promise,
  typescript,
  typeAware,
  vitest
);
