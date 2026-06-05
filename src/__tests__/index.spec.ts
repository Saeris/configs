import { describe, expect, it } from "vitest";
import { fmt, lint, mergeLint, next, react } from "../index.js";

describe("mergeLint", () => {
  it("unions and de-duplicates plugins so composing fragments never drops a base plugin", () => {
    // Oxlint *replaces* the plugin set when `plugins` is present, so a naive
    // last-writer-wins merge would silently lose the `import` plugin here.
    const merged = mergeLint({ plugins: ["oxc", "import"] }, { plugins: ["import", "typescript"] });

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
    const merged = mergeLint({ rules: { eqeqeq: "error", "no-console": "warn" } }, { rules: { "no-console": "off" } });

    expect(merged.rules).toStrictEqual({ eqeqeq: "error", "no-console": "off" });
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
    expect(lint.plugins).toStrictEqual(["oxc", "unicorn", "import", "promise", "typescript"]);
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

  it("next composed after the default lint re-enables default exports for route files", () => {
    // Why this matters: base/imports warn on `import-x/no-default-export`, but
    // Next route files (app/, pages/) MUST default-export. The override has to
    // come last so it wins — this guards that ordering contract.
    const composed = mergeLint(lint, react, next);
    const routeOverride = composed.overrides?.findLast((override) =>
      override.files.some((glob) => glob.includes("app/"))
    );

    expect(routeOverride?.rules?.["import-x/no-default-export"]).toBe("off");
  });
});
