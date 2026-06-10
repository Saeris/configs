import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import type { OxlintConfig } from "vite-plus/lint";

const require = createRequire(import.meta.url);
// oxlint doesn't expose ./bin/oxlint in its exports map, so resolve the package
// root via package.json and join the bin path from there.
const oxlintBin = join(
  dirname(require.resolve("oxlint/package.json")),
  "bin",
  "oxlint"
);

interface Diagnostic {
  code: string;
  filename: string;
}

/**
 * Run oxlint with a given config against a set of in-memory fixture files and
 * return the diagnostics. This exercises the REAL resolver — override globs,
 * ordering, env scoping — rather than re-asserting config literals, so it
 * catches the mistakes that matter: a rule landing on the wrong files, or an
 * override that doesn't win because of ordering.
 *
 * `files` maps a relative path (e.g. `"src/app.ts"`, `"x.spec.ts"`) to its
 * contents. Returns every diagnostic oxlint emitted, with its rule `code` and
 * the relative `filename` it fired on.
 */
export const lintFixture = (
  config: OxlintConfig,
  files: Record<string, string>
): Diagnostic[] => {
  const dir = mkdtempSync(join(tmpdir(), "saeris-configs-"));
  try {
    writeFileSync(join(dir, "oxlint.json"), JSON.stringify(config));
    // Type-aware rules (require-await, no-unnecessary-condition, …) only run
    // when oxlint can build a TS program, so the fixture needs a tsconfig that
    // includes the fixture files.
    writeFileSync(
      join(dir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          module: "ESNext",
          target: "ESNext",
          moduleResolution: "bundler"
        },
        include: ["**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"]
      })
    );
    const paths: string[] = [];
    for (const [relativePath, contents] of Object.entries(files)) {
      const full = join(dir, relativePath);
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, contents);
      paths.push(relativePath);
    }

    let stdout = "";
    try {
      stdout = execFileSync(
        process.execPath,
        [oxlintBin, "--format=json", "--config", "oxlint.json", ...paths],
        { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
      );
    } catch (error) {
      // oxlint exits non-zero when it finds errors; the JSON is still on stdout.
      stdout = (error as { stdout?: string }).stdout ?? "";
    }

    let parsed: { diagnostics?: { code: string; filename: string }[] };
    try {
      parsed = JSON.parse(stdout) as {
        diagnostics?: { code: string; filename: string }[];
      };
    } catch {
      throw new Error(
        `oxlint did not emit JSON. Raw output:\n${stdout || "(empty)"}`
      );
    }
    return (parsed.diagnostics ?? []).map((d) => ({
      code: d.code,
      // Normalize to forward-slash relative paths for stable assertions.
      filename: d.filename.replace(/\\/g, "/")
    }));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
};

/** True if any diagnostic for `ruleCode` fired on a file whose path includes `pathFragment`. */
export const fired = (
  diagnostics: Diagnostic[],
  ruleCode: string,
  pathFragment: string
): boolean =>
  diagnostics.some(
    (d) => d.code.includes(ruleCode) && d.filename.includes(pathFragment)
  );
