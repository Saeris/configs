---
"@saeris/configs": minor
---

Add seven hygiene compiler flags to the shared base tsconfig
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
