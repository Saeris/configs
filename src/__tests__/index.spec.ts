import type { OxlintConfig } from "vite-plus/lint";
import { describe, expect, it } from "vitest";
import tsconfig from "../tsconfig.base.json" with { type: "json" };
import {
  base,
  fmt,
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

  it("exposes a fmt config with the shared house style", () => {
    expect(fmt.printWidth).toBe(120);
    expect(fmt.singleQuote).toBe(false);
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
  // The shared base is a static JSON asset (published via the ./tsconfig
  // export). This contract test guards against a flag being silently dropped
  // from the base — the realistic regression. (Behavioral per-flag
  // `tsc --noEmit` fixtures would additionally catch TypeScript-version
  // semantic drift, but at a much higher cost; add them only if a flag's
  // meaning is observed to shift across TS releases.)
  const { compilerOptions } = tsconfig;

  const EXPECTED_HYGIENE_FLAGS = [
    "noUnusedLocals",
    "noUnusedParameters",
    "noFallthroughCasesInSwitch",
    "noImplicitReturns",
    "noImplicitOverride",
    "noErrorTruncation",
    "verbatimModuleSyntax"
  ] as const;

  it.each(EXPECTED_HYGIENE_FLAGS)("enables %s", (flag) => {
    expect(compilerOptions[flag]).toBe(true);
  });

  it("keeps strict mode on, which the hygiene flags build upon", () => {
    expect(compilerOptions.strict).toBe(true);
  });
});

describe("vitest test-file relaxations", () => {
  const specOverride = vitest.overrides?.find((override) =>
    override.files.some((glob) => glob.includes("spec"))
  );
  const specRules = specOverride?.rules ?? {};

  // How each override in the merged lint sets require-await, in order. The
  // relaxations only take effect if vitest's spec override (which sets `off`)
  // is appended *after* typeAware's TS override (which sets `error`); later
  // overrides win for matching files. Computed here, outside the assertions.
  const requireAwaitLevels = (lint.overrides ?? []).map(
    (override) => override.rules?.["@typescript-eslint/require-await"]
  );

  it.each([
    ["@typescript-eslint/no-unsafe-type-assertion", "off"],
    ["@typescript-eslint/require-await", "off"],
    ["@typescript-eslint/no-deprecated", "off"],
    ["@typescript-eslint/no-unnecessary-condition", "warn"],
    ["@typescript-eslint/array-type", "warn"],
    ["@typescript-eslint/prefer-includes", "warn"]
  ] as const)("relaxes %s to %s in spec files", (rule, level) => {
    expect(specRules[rule]).toBe(level);
  });

  it("orders vitest after typeAware in the default lint so the relaxations win", () => {
    expect(requireAwaitLevels).toContain("error");
    expect(requireAwaitLevels.lastIndexOf("off")).toBeGreaterThan(
      requireAwaitLevels.indexOf("error")
    );
  });
});
