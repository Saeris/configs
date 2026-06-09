# Changelog





## 1.3.1
<sub>2026-06-09</sub>

- [#10](https://github.com/Saeris/configs/pull/10)  *(patch)* Thanks [@Saeris](https://github.com/Saeris)! - Drop the `development` export condition from the `"."` entry so the package
  always resolves to the built `dist`, never the raw TypeScript source.
  The condition pointed `@saeris/configs` at `./src/index.ts` whenever a
  consumer's resolver ran under the `development` condition (which `vp` activates).
  The Oxc VSCode extension's standalone oxfmt loader then tried to evaluate that
  TS source — including its `.js`-specifier imports of sibling `.ts` files — which
  plain Node ESM can't resolve. Loading failed silently and on-save formatting
  fell back to oxfmt defaults, diverging from `vp check --fix` (which bundles the
  config and resolves TS correctly).
  For a lint/format config package the `development`-to-source condition buys
  nothing (there's no dev-time HMR of config), so removing it is a clean fix:
  editor formatting now matches `vp check --fix`. No public API change — the same
  symbols export, resolved from `dist`.

## 1.3.0
<sub>2026-06-06</sub>

- [#8](https://github.com/Saeris/configs/pull/8)  *(minor)* Thanks [@Saeris](https://github.com/Saeris)! - Reset print width to 80 from 120 to better support IDE format on save behavior and remove broken vitest globals due to resolution errors.

## 1.2.0
<sub>2026-06-06</sub>

- [#6](https://github.com/Saeris/configs/pull/6)  *(minor)* Thanks [@Saeris](https://github.com/Saeris)! - Relax a defined set of type-aware `@typescript-eslint/*` rules for test files
  in the `vitest` preset. These fire on idiomatic test patterns that aren't bugs
  in the test context, and were forcing every consumer to re-declare the same
  per-file overrides.
  Scoped to `**/*.{spec,test}.{js,jsx,ts,tsx}` (the `vitest` preset's existing
  spec override, which is composed after `typeAware` so the relaxations win):
  - **off** — `no-unsafe-type-assertion`, `require-await`, `no-deprecated`
    (casts to shape mocks/fixtures, structural `async` mocks, and deliberately
    exercising `@deprecated` APIs are all normal in tests).
  - **warn** — `no-unnecessary-condition`, `array-type`, `prefer-includes`
    (kept visible but non-blocking).
  Source-code rule levels are unchanged; this only loosens test files, so
  consumers should see _fewer_ errors, never more.

## 1.1.0
<sub>2026-06-06</sub>

- [#3](https://github.com/Saeris/configs/pull/3)  *(minor)* Thanks [@Saeris](https://github.com/Saeris)! - Fix two latent bugs that caused configured rules to silently never apply.
  **Import rule prefixes (`import-x/` → `import/`).** Every import-plugin rule
  was configured under the `import-x/` prefix (from `eslint-plugin-import-x`),
  but Oxlint registers its native import plugin under `import/`. Oxlint silently
  ignores unknown prefixes, so all of these rules were no-ops — including the
  `no-default-export` ban and its exceptions.
  **Override file globs (extglob → brace expansion).** Override `files` patterns
  used extglob groups like `?(x)` and `?(m|c)`, which Oxlint silently drops
  ([oxc#21525](https://github.com/oxc-project/oxc/issues/21525)) — the whole
  override is ignored, so its scoped rules never apply. All globs now use brace
  expansion (`{js,jsx,ts,tsx}`), the supported equivalent.
  **Default-export exceptions moved to the `imports` scope.** The exceptions for
  files that conventionally default-export (build/tool configs, Storybook
  stories, and Next.js route files: `app/`, `pages/`, `middleware`,
  `next.config`) now live in `imports` instead of `base`/`next`. They apply
  whenever `imports` is composed, independent of the framework rule scopes.
  Also removed the dead `settings` block from `imports` (Oxlint uses its own
  module resolver and ignores `eslint-plugin-import-x` resolver settings).
  > **Behavior change:** rules that were previously no-ops now fire, so lint
  > output will change. Most commonly you'll see new `import/no-default-export`
  > warnings on barrel re-exports and source files that default-export. Next.js
  > consumers will see _fewer_ warnings on route files, which are now correctly
  > exempted (they weren't before). Config and `*.stories.*` files are exempt too.
- [#5](https://github.com/Saeris/configs/pull/5)  *(minor)* Thanks [@Saeris](https://github.com/Saeris)! - Add seven hygiene compiler flags to the shared base tsconfig
  (`@saeris/configs/tsconfig`):
  - `noUnusedLocals`, `noUnusedParameters` — flag dead locals/params.
  - `noFallthroughCasesInSwitch` — catch missing `break`/`return` in switches.
  - `noImplicitReturns` — flag functions that only return on some branches.
  - `noImplicitOverride` — require the `override` keyword on overriding methods.
  - `noErrorTruncation` — show full type signatures in errors (DX only).
  - `verbatimModuleSyntax` — require explicit `import type`; pairs with the
    already-enabled `isolatedModules` and the lint config's
    `consistent-type-imports` rule.
  > **Behavior change:** the hygiene flags surface existing dead code, missing
  > returns/overrides, and switch fall-through that previously compiled — expect
  > new errors on first build after upgrading. `verbatimModuleSyntax` requires
  > type-only imports to be marked `import type`; this is autofixable via the
  > lint config's `@typescript-eslint/consistent-type-imports`. Set any flag to
  > `false` in your project's `compilerOptions` to opt out.
  >
  > Project-shaped options stay project-side: `lib: ["DOM"]` (browser targets),
  > `customConditions` (monorepos), and `importHelpers` (libraries) are
  > intentionally not in the base.

## 1.0.1
<sub>2026-06-05</sub>

- [#1](https://github.com/Saeris/configs/pull/1)  *(patch)* Thanks [@Saeris](https://github.com/Saeris)! - Fix package resolution by flattening the export map so bundlers can resolve @saeris/configs under both import and require conditions (resolves 'ESM only but loaded by require' errors in consumer vite configs)
