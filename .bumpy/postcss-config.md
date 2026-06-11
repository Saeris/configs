---
"@saeris/configs": minor
---

Add a shared PostCSS config, exported as `@saeris/configs/postcss`.

`postcss(overrides?)` returns a `postcss-load-config`-shaped object built on a
single plugin, `postcss-preset-env`: `stage: 3` features plus spec CSS Nesting
(`nesting-rules`) and built-in autoprefixing, all driven by the project's
browserslist. Consume it from a one-line `postcss.config.mjs`
(`export { postcss as default } from "@saeris/configs/postcss"`), and pass
`features`/options to the function to tweak per project without forking.

Notably this drops `postcss-nested` and standalone `autoprefixer` from the
previous hand-rolled configs: preset-env's `nesting-rules` is spec-compliant
(mixing it with `postcss-nested`'s Sass semantics risks divergence), and
autoprefixer is built in and browserslist-driven.

`postcss-preset-env` is an optional peer dependency (only needed if you use the
`./postcss` export). Browser targets and the `typescript-plugin-css-modules`
IDE plugin stay per-project — see the README.
