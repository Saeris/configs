---
"@saeris/configs": minor
---

Broaden the test-file rule relaxations to cover more test-adjacent code and more
idiomatic test patterns.

- **Wider scope.** The test override globs are now a shared `TEST_FILES`
  constant (exported for consumers to reuse) covering spec/test files,
  Vitest `*.bench.{ts,tsx}` files, and anything under a `__tests__/` directory
  (helpers/fixtures that aren't named `.spec`/`.test`). Previously only
  `*.{spec,test}.*` matched.
- **More relaxed rules in tests.** Added `no-confusing-void-expression`,
  `no-mixed-enums`, and `explicit-module-boundary-types` to the off list, and
  dropped `no-unnecessary-condition` from `warn` to `off`.
  `explicit-module-boundary-types` is the exported-function sibling of
  `explicit-function-return-type`; relaxing only the latter left it firing on
  `export const` test helpers.

Source-code rule levels are unchanged — this only loosens test code, so
consumers see fewer errors, never more.
