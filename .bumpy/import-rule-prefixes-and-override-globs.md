---
"@saeris/configs": minor
---

Fix two latent bugs that caused configured rules to silently never apply.

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
