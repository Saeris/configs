---
"@saeris/configs": patch
---

Fix consumer overrides being unable to disable or relax `vitest/*` rules.

The `vitest` plugin was enabled only inside the test-file override, not at the
top level like every other fragment. oxlint scopes plugin activation
per-override, so a _consumer's_ own override (which doesn't re-declare the
plugin) had no `vitest` plugin in scope — its rule settings were inert, and a
later `vitest/expect-expect: off` silently failed to win over the preset. (This
was reported as a `mergeLint`/oxlint precedence bug; the real cause is plugin
scoping.)

Enable the `vitest` plugin at the top level so consumer overrides work, and turn
the two default-on vitest rules (`expect-expect`, `no-focused-tests`) off at the
top level so enabling the plugin globally doesn't make them fire on non-test
source. The test-file override still re-enables the full rule set. Net: vitest
rules fire only on test files (unchanged), and consumers can now disable/relax
any vitest rule from their own override without re-declaring `plugins`.
