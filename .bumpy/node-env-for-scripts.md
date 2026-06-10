---
"@saeris/configs": minor
---

Enable the Node environment and allow `console` for Node-shaped files. Build and
tooling scripts (`scripts/**`), standalone `*.{mjs,cjs}` files, and config files
now get Node globals (`process`, `__dirname`, `URL`, …) so `no-undef` no longer
fires on them, and `no-console` is off there since logging is a script's job.

Scoped via an override rather than enabled globally: `src/**` keeps `builtin`-only
globals and the `no-console: warn` default, so `no-undef` still catches an
accidental `process` reference in browser/isomorphic library code. A Node-targeted
library can opt all of its source into Node globals with its own top-level
`env: { node: true }` (oxlint env is additive — it coexists with the `browser`
env from the `react` scope).

Fixes the `no-undef` cluster (`console`, `process`, `URL`) reported when linting
committed Node CLI scripts.
