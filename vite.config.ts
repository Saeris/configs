import { defineConfig } from "vite-plus";
import manifest from "./package.json" with { type: "json" };
import { fmt, lint } from "./src/index.js";

export default defineConfig({
  // ── Linting (Oxlint) ────────────────────────────────────────────────
  lint,
  // ── Formatting (Oxfmt) ──────────────────────────────────────────────
  fmt,
  // ── Builds (tsdown) ─────────────────────────────────────────────────
  pack: {
    entry: [`./src/index.ts`],
    clean: true,
    format: [`esm`],
    dts: true,
    outDir: `./dist`
  },
  // ── Testing (Vitest) ────────────────────────────────────────────────
  test: {
    name: manifest.name,
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    environment: "node",
    passWithNoTests: true
  }
});
