---
"@saeris/configs": minor
---

Relax `vitest/no-conditional-in-test` and `vitest/no-conditional-expect` from
`warn` to `off` in test files (`TEST_FILES`).

Property-based testing (fast-check et al.) branches on generated input inside
the property callback — the conditional that adapts to randomized data is the
test, not noise to split into deterministic cases. The rules' premise is
example-based only, so they fight a first-class testing pattern this config
endorses. `vitest/no-conditional-tests` (conditional `describe`/`it`
declarations) stays at `warn` — property-based testing doesn't require relaxing
it.

Source-code rules unchanged; consumers see fewer test warnings, never more.
