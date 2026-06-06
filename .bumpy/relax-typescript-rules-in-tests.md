---
"@saeris/configs": minor
---

Relax a defined set of type-aware `@typescript-eslint/*` rules for test files
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
