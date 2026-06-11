import postcssEngine from "postcss";
import presetEnv from "postcss-preset-env";
import { describe, expect, it } from "vitest";
import { postcss } from "../postcss.js";

/**
 * Behavioral test: feed CSS through the actual plugin chain our config
 * describes and assert the transform, rather than re-asserting config literals.
 * Browsers are forced here for determinism (real consumers get them from
 * browserslist).
 */
const transform = async (css: string, overrides = {}): Promise<string> => {
  const config = postcss({ browsers: ["last 2 versions"], ...overrides });
  const options = config.plugins["postcss-preset-env"];
  const result = await postcssEngine([presetEnv(options)]).process(css, {
    from: undefined
  });
  return result.css;
};

describe("postcss config", () => {
  it("flattens spec CSS nesting (the `&` syntax)", async () => {
    const out = await transform(`.card {\n  & .title { color: red; }\n}\n`);
    expect(out).toContain(".card .title");
    expect(out).not.toContain("&");
  });

  it("flattens bare nesting without an explicit `&`", async () => {
    // Spec nesting allows omitting `&`; postcss-nested's Sass semantics differ,
    // which is why we use preset-env's nesting-rules and not postcss-nested.
    const out = await transform(`.menu {\n  .item { color: blue; }\n}\n`);
    expect(out).toContain(".menu .item");
  });

  it("lets a consumer add features without losing the nesting default", async () => {
    // Merging `features` must not clobber `nesting-rules`.
    const out = await transform(`.a {\n  & .b { color: red; }\n}\n`, {
      features: { "relative-color-syntax": { preserve: true } }
    });
    expect(out).toContain(".a .b");
  });

  it("defaults to stage 3", () => {
    expect(postcss().plugins["postcss-preset-env"].stage).toBe(3);
  });
});
