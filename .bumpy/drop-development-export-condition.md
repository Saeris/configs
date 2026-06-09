---
"@saeris/configs": patch
---

Drop the `development` export condition from the `"."` entry so the package
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
