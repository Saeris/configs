import type { OxfmtConfig } from "vite-plus/fmt";

/**
 * Default formatting config for Oxfmt. Opinionated defaults shared across
 * projects: 80-column width, two-space indent, double quotes, semicolons,
 * no trailing commas.
 */
export const fmt: OxfmtConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  sortPackageJson: false,
  ignorePatterns: ["CHANGELOG.md"]
};
