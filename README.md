<div align="center">

# ⚙️ @saeris/configs

[![npm version][npm_badge]][npm]
[![CI status][ci_badge]][ci]

Shared [Vite+][viteplus] configurations (Oxlint, Oxfmt, and TypeScript)

</div>

---

## 📦 Installation

```bash
vp add @saeris/configs
```

## 🔧 Usage

The package exposes two ready-to-use exports — `lint` and `fmt` — that drop
straight into `defineConfig`:

```ts
// vite.config.ts
import { defineConfig } from "vite-plus";
import { lint, fmt } from "@saeris/configs";

export default defineConfig({ lint, fmt });
```

- **`lint`** — the sensible default Oxlint config for a TypeScript library:
  `base` + `imports` + `promise` + `typescript` + `type-aware` + `vitest`.
- **`fmt`** — the shared Oxfmt house style (120 columns, two-space indent,
  double quotes, semicolons, no trailing commas).

> Oxlint has no stylistic/layout rules — formatting is owned entirely by Oxfmt.
> Everything the old ESLint "stylistic" ruleset did now lives in `fmt`.

## 🧩 Scoped configs

Each ruleset is also exported on its own so you can compose only what you need.
Every scoped export is an `OxlintConfig` _fragment_; combine them with
[`mergeLint`](#-composing-with-mergelint).

| Export       | Plugins                           | Notes                                                                     |
| ------------ | --------------------------------- | ------------------------------------------------------------------------- |
| `base`       | `oxc`, `unicorn`                  | Vanilla rules, `correctness` category, JS-file + Node-script overrides    |
| `imports`    | `import`                          | Import hygiene + default-export exceptions (config, stories, Next routes) |
| `promise`    | `promise`                         | Async / Promise correctness                                               |
| `typescript` | `typescript`                      | Syntactic TS rules (no type info required)                                |
| `typeAware`  | `typescript`                      | Typed TS rules; sets `options.typeAware`/`typeCheck`                      |
| `vitest`     | `vitest`                          | Test-file rules + type-aware relaxations, scoped to `TEST_FILES`          |
| `react`      | `react`, `react-perf`, `jsx-a11y` | React + hooks + a11y; **not** in the default `lint`                       |
| `next`       | `nextjs`                          | Next.js plugin rules (fonts, scripts, `<Image>`, head)                    |

`react` and `next` are framework-specific, so they are deliberately left out of
the default `lint`. Opt in by composing them yourself:

```ts
import { defineConfig } from "vite-plus";
import { mergeLint, lint, react, next } from "@saeris/configs";

// A Next.js app: defaults + React + Next (order matters — see below)
export default defineConfig({ lint: mergeLint(lint, react, next) });
```

> **Test files** get relaxed type-aware rules (casts, structural `async` mocks,
> `@deprecated` usage, void-schema assertions, no explicit return types, …). The
> scope is `TEST_FILES` — spec/test files, Vitest `*.bench.*` files, and anything
> under a `__tests__/` directory (helpers/fixtures). `TEST_FILES` is exported, so
> you can reuse the exact same set in your own overrides.
>
> **Node globals** (`process`, `__dirname`, …) and `no-console` are enabled only
> for Node-shaped files — `scripts/**`, standalone `*.{mjs,cjs}` tooling, and
> config files — not globally. This keeps `src/**` honest: `no-undef` still
> flags an accidental `process` in browser/isomorphic library code. A
> Node-targeted library opts in with its own top-level `env: { node: true }`
> (oxlint env is additive, so it coexists with the `browser` env from `react`).

## 🪢 Composing with `mergeLint`

Because Oxlint uses a single config object (not an array like flat-config
ESLint), `mergeLint` does a field-aware merge:

- **`plugins`** are unioned and de-duplicated.
- **`overrides`** are concatenated in argument order — **later overrides win**
  for files they both match.
- **`rules`, `categories`, `env`, `settings`, `options`** are shallow-merged;
  later fragments override earlier keys.
- **`ignorePatterns`** are concatenated and de-duplicated.

### Building a config from scratch

```ts
import { defineConfig } from "vite-plus";
import { mergeLint, base, imports, typescript } from "@saeris/configs";

export default defineConfig({ lint: mergeLint(base, imports, typescript) });
```

### Overriding the default `lint`

Pass `lint` **first** and your overrides **last**, so the last-writer-wins
ordering works in your favour. Top-level `rules` apply to every file; to change
a rule for only some files, append an `overrides` entry instead:

```ts
import { defineConfig } from "vite-plus";
import { mergeLint, lint } from "@saeris/configs";

export default defineConfig({
  lint: mergeLint(lint, {
    // turn a default rule off everywhere
    rules: { "no-console": "off" },
    // ...or only for certain files (appended after the defaults, so it wins)
    overrides: [{ files: ["scripts/**"], rules: { "no-console": "off" } }]
  })
});
```

The `imports` config uses this mechanism for known file conventions: its
route-file override (`app/`, `pages/`, `middleware`, `next.config`) and its
config/stories override disable the `import/no-default-export` ban for files
that conventionally default-export — but only those files. These exceptions
live in `imports` (not the `next` scope) so they apply whether or not you pull
in the framework-specific rules.

> Import rules use Oxlint's `import/` prefix, not `import-x/`. Oxlint registers
> its native import plugin under `import/`; the `import-x/` prefix is silently
> ignored. Confirm rule names with `vp lint --rules`.

## 📐 TypeScript config

A base `tsconfig` is published for `extends`:

```jsonc
// tsconfig.json
{
  "extends": "@saeris/configs/tsconfig",
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    // project-local paths live here, not in the shared base
    "outDir": "./dist",
    "rootDir": "."
  }
}
```

The base holds only portable `compilerOptions`: strict mode, `ESNext`
target/module, `bundler` resolution, declaration + source maps, the
`node`/`vitest/globals` ambient types, and a set of hygiene flags —
`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`,
`noImplicitReturns`, `noImplicitOverride`, `noErrorTruncation`, and
`verbatimModuleSyntax`. The last pairs with `isolatedModules` and matches the
lint config's `consistent-type-imports` rule (both push you toward
`import type`); it's autofixable if you adopt it on an existing project.

Set any flag to `false` in your project's `compilerOptions` to opt out. Path-
and file-selection options (`outDir`, `rootDir`, `include`, `exclude`), plus
project-shaped choices like `lib: ["DOM"]`, `customConditions`, and
`importHelpers`, are intentionally left to the consuming project — they're
either path-relative or depend on whether the project targets the browser, is
a monorepo, or ships a library.

## 🤝 Contributing

The project uses [Vite+][viteplus] as a unified toolchain (Oxlint + Oxfmt + tsdown + Vitest) and [Bumpy][bumpy] for versioning and release.

```bash
vp install           # install dependencies
vp check --fix       # format + lint + typecheck (with autofixes)
vp test              # run Vitest
yarn bumpy add       # create a bump file for your PR
```

## 🥂 License

Released under the [MIT license][license] © [Drake Costa][personal-website].

[npm_badge]: https://img.shields.io/npm/v/@saeris/configs?style=flat
[npm]: https://www.npmjs.com/package/@saeris/configs
[ci_badge]: https://github.com/Saeris/configs/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/Saeris/configs/actions/workflows/ci.yml
[viteplus]: https://viteplus.dev/
[bumpy]: https://bumpy.varlock.dev/
[license]: ./LICENSE.md
[personal-website]: https://saeris.gg
