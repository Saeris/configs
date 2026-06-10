import type { OxlintConfig } from "vite-plus/lint";
import { describe, expect, it } from "vitest";
import tsconfig from "../tsconfig.base.json" with { type: "json" };
import {
  base,
  imports,
  lint,
  mergeLint,
  next,
  promise,
  react,
  typeAware,
  typescript,
  vitest
} from "../index.js";
import { fired, lintFixture } from "./lintFixture.js";

describe("mergeLint", () => {
  it("unions and de-duplicates plugins so composing fragments never drops a base plugin", () => {
    // Oxlint *replaces* the plugin set when `plugins` is present, so a naive
    // last-writer-wins merge would silently lose the `import` plugin here.
    const merged = mergeLint(
      { plugins: ["oxc", "import"] },
      { plugins: ["import", "typescript"] }
    );

    expect(merged.plugins).toStrictEqual(["oxc", "import", "typescript"]);
  });

  it("concatenates overrides in argument order because later overrides win for shared files", () => {
    const merged = mergeLint(
      { overrides: [{ files: ["*.ts"], rules: { eqeqeq: "error" } }] },
      { overrides: [{ files: ["*.ts"], rules: { eqeqeq: "off" } }] }
    );

    expect(merged.overrides).toStrictEqual([
      { files: ["*.ts"], rules: { eqeqeq: "error" } },
      { files: ["*.ts"], rules: { eqeqeq: "off" } }
    ]);
  });

  it("shallow-merges rules so a later fragment can override an earlier rule's setting", () => {
    const merged = mergeLint(
      { rules: { eqeqeq: "error", "no-console": "warn" } },
      { rules: { "no-console": "off" } }
    );

    expect(merged.rules).toStrictEqual({
      eqeqeq: "error",
      "no-console": "off"
    });
  });

  it("omits fields that no fragment defines to keep the output minimal", () => {
    const merged = mergeLint({ rules: { eqeqeq: "error" } });

    expect(merged.plugins).toBeUndefined();
    expect(merged.overrides).toBeUndefined();
  });
});

describe("default exports", () => {
  it("assembles a lint config that wires up every scoped plugin", () => {
    // Guards the composition order/coverage the root config depends on: if a
    // scoped fragment stops contributing its plugin, this fails.
    expect(lint.plugins).toStrictEqual([
      "oxc",
      "unicorn",
      "import",
      "promise",
      "typescript"
    ]);
    expect(lint.options).toStrictEqual({ typeAware: true, typeCheck: true });
  });

  it("excludes framework scopes from the default lint so it stays library-generic", () => {
    // react/next are opt-in; the default must not pull them in implicitly.
    expect(lint.plugins).not.toContain("react");
    expect(lint.plugins).not.toContain("nextjs");
  });
});

describe("framework scopes", () => {
  it("react bundles the react, react-perf, and jsx-a11y plugins", () => {
    expect(react.plugins).toStrictEqual(["react", "react-perf", "jsx-a11y"]);
  });

  it("relaxes the default-export ban for Next route files via the imports scope", () => {
    // Why this matters: imports warns on `import/no-default-export`, but Next
    // route files (app/, pages/) MUST default-export. The exception lives in
    // `imports` (so it applies without the `next` rule scope) and must use the
    // `import/` prefix oxlint actually registers — `import-x/` is a silent
    // no-op. This guards both the location and the prefix.
    const routeOverride = lint.overrides?.findLast((override) =>
      override.files.some((glob) => glob.includes("app/"))
    );

    expect(routeOverride?.rules?.["import/no-default-export"]).toBe("off");
  });
});

describe("rule-name prefixes", () => {
  // Oxlint registers plugin rules under specific prefixes (e.g. `import/`, NOT
  // `import-x/`). A wrong prefix is not an error — oxlint silently drops the
  // rule — so this contract test is the only thing that catches the class of
  // bug where a rule is configured but never fires. Derived from oxlint's
  // config schema; regenerate via:
  //   grep -oE '"[a-z0-9@-]+/[a-z0-9-]+"' node_modules/oxlint/dist/index.d.ts
  const KNOWN_PLUGIN_PREFIXES = new Set([
    "@typescript-eslint",
    "eslint",
    "import",
    "jest",
    "jsdoc",
    "jsx-a11y",
    "nextjs",
    "node",
    "oxc",
    "promise",
    "react",
    "react-perf",
    "typescript",
    "unicorn",
    "vitest",
    "vue"
  ]);

  const collectRuleNames = (config: OxlintConfig): string[] => {
    const names: string[] = [];
    if (config.rules) names.push(...Object.keys(config.rules));
    for (const override of config.overrides ?? []) {
      if (override.rules) names.push(...Object.keys(override.rules));
    }
    return names;
  };

  const fragments: [string, OxlintConfig][] = [
    ["base", base],
    ["imports", imports],
    ["promise", promise],
    ["typescript", typescript],
    ["typeAware", typeAware],
    ["vitest", vitest],
    ["react", react],
    ["next", next]
  ];

  it.each(fragments)(
    "every rule in %s uses a prefix oxlint recognizes",
    (_name, fragment) => {
      // Bare names (no slash) are core ESLint rules, always valid; only check
      // prefixed names. Collect any offenders so a failure names them, and so
      // there's no conditional inside the assertion.
      const unknownPrefixed = collectRuleNames(fragment)
        .filter((ruleName) => ruleName.includes("/"))
        .filter(
          (ruleName) =>
            !KNOWN_PLUGIN_PREFIXES.has(ruleName.slice(0, ruleName.indexOf("/")))
        );

      // An empty array means every prefixed rule maps to a real oxlint plugin.
      // A non-empty array lists the rules oxlint would silently ignore.
      expect(unknownPrefixed).toStrictEqual([]);
    }
  );

  it("specifically guards against the import-x/ regression", () => {
    // The original bug: every import rule used `import-x/` (from
    // eslint-plugin-import-x) instead of oxlint's native `import/`.
    const importRules = collectRuleNames(imports);
    expect(importRules.some((name) => name.startsWith("import-x/"))).toBe(
      false
    );
    expect(importRules.some((name) => name.startsWith("import/"))).toBe(true);
  });
});

describe("override file globs", () => {
  // oxlint silently ignores extglob patterns like `?(x)` / `@(...)` in
  // `overrides[].files` (oxc#21525) — the whole override is dropped with no
  // error, so the scoped rules never apply. Brace expansion ({js,ts,...}) is
  // the supported equivalent. This guards every fragment's override globs
  // against reintroducing extglob, which is as silent as the import-x/ bug.
  const collectGlobs = (config: OxlintConfig): string[] =>
    (config.overrides ?? []).flatMap((override) => override.files);

  const fragments: [string, OxlintConfig][] = [
    ["base", base],
    ["imports", imports],
    ["typescript", typescript],
    ["typeAware", typeAware],
    ["vitest", vitest],
    ["react", react],
    ["next", next]
  ];

  it.each(fragments)(
    "%s uses no extglob (?()/@()) patterns oxlint ignores",
    (_name, fragment) => {
      for (const glob of collectGlobs(fragment)) {
        expect(
          glob,
          `glob "${glob}" uses an extglob group oxlint silently drops; use brace expansion`
        ).not.toMatch(/[?@!*+]\(/);
      }
    }
  );
});

describe("base tsconfig", () => {
  // Static JSON asset; no behavior to run. One guard against the realistic
  // regression — a hygiene flag silently dropped from the published base.
  it("keeps strict mode and the hygiene flags on", () => {
    expect(tsconfig.compilerOptions).toMatchObject({
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      noImplicitReturns: true,
      noImplicitOverride: true,
      verbatimModuleSyntax: true
    });
  });
});

// Behavioral tests: run oxlint against fixtures through the real resolver, so a
// rule landing on the wrong files (scoping) or an override that loses because
// of ordering (precedence) actually fails the test — unlike asserting config
// literals, which only restates the source. These use syntactic rules and
// compose without `typeAware`, so fixtures stay program-free (no @types/node or
// tsconfig coupling) and isolate the override behaviour under test.
describe("test-file scoping + override ordering (behavioral)", () => {
  // typescript sets the explicit return-type rules to `warn`, then its own test
  // override sets them `off`. Linting the typescript fragment alone exercises
  // that the later test-scoped override wins, and that the broadened TEST_FILES
  // globs (spec + bench + __tests__) all match.
  const diagnostics = lintFixture(typescript, {
    "src/app.ts": `export const f = () => 1;\n`,
    "src/app.spec.ts": `export const f = () => 1;\n`,
    "perf.bench.ts": `export const f = () => 1;\n`,
    "src/__tests__/helpers/cap.ts": `export const f = () => 1;\n`
  });

  it("fires both explicit return-type rules in src", () => {
    expect(
      fired(diagnostics, "explicit-function-return-type", "src/app.ts")
    ).toBe(true);
    // Sibling rule (exported-function variant) must fire too.
    expect(
      fired(diagnostics, "explicit-module-boundary-types", "src/app.ts")
    ).toBe(true);
  });

  it.each(["app.spec.ts", "perf.bench.ts", "helpers/cap.ts"])(
    "relaxes both explicit return-type rules for %s",
    (testFile) => {
      expect(
        fired(diagnostics, "explicit-function-return-type", testFile)
      ).toBe(false);
      expect(
        fired(diagnostics, "explicit-module-boundary-types", testFile)
      ).toBe(false);
    }
  );
});

describe("node-shaped files (behavioral)", () => {
  // base alone (no typeAware), so an undefined `process` surfaces as the
  // no-undef LINT rule rather than a TS-program error.
  const diagnostics = lintFixture(base, {
    "src/app.js": `export const x = process.env.NODE_ENV;\n`,
    "scripts/run.mjs": `console.log(process.argv);\n`,
    "tool.cjs": `console.log(process.cwd());\n`
  });

  it("leaves src on builtin-only globals (no-undef fires on process)", () => {
    expect(fired(diagnostics, "no-undef", "src/app.js")).toBe(true);
  });

  it.each(["scripts/run.mjs", "tool.cjs"])(
    "enables Node env + allows console for %s",
    (nodeFile) => {
      expect(fired(diagnostics, "no-undef", nodeFile)).toBe(false);
      expect(fired(diagnostics, "no-console", nodeFile)).toBe(false);
    }
  );
});

describe("property-based test relaxations (behavioral)", () => {
  // The vitest fragment must silence the conditional rules on test files so
  // property-based suites (fast-check) can branch on generated input inside the
  // property callback — the conditional adapting to randomized data is the test.
  const diagnostics = lintFixture(vitest, {
    "prop.spec.ts": `import { it, expect } from "vitest";
it("p", () => {
  const xs: number[] = [];
  if (Math.random() > 0.5) {
    xs.push(1);
    expect(xs).toContain(1);
  }
  expect(xs).toBeDefined();
});
`
  });

  it.each(["no-conditional-in-test", "no-conditional-expect"])(
    "relaxes vitest/%s for property-based test code",
    (rule) => {
      expect(fired(diagnostics, rule, "prop.spec.ts")).toBe(false);
    }
  );
});
