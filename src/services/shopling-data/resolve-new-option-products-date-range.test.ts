import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NEW_OPTION_PRODUCTS_DEFAULT_DAYS,
  resolveNewOptionProductsDateRange,
} from "@/services/shopling-data/resolve-new-option-products-date-range";

const TODAY = new Date("2026-06-17T00:00:00.000Z");

describe("resolveNewOptionProductsDateRange", () => {
  it("defaults to the last 7 days inclusive", () => {
    const result = resolveNewOptionProductsDateRange({}, TODAY);

    assert.equal(result.from, "2026-06-11");
    assert.equal(result.to, "2026-06-17");
    assert.equal(result.days, NEW_OPTION_PRODUCTS_DEFAULT_DAYS);
  });

  it("supports day presets", () => {
    const result = resolveNewOptionProductsDateRange({ days: 30 }, TODAY);

    assert.equal(result.from, "2026-05-19");
    assert.equal(result.to, "2026-06-17");
    assert.equal(result.days, 30);
  });

  it("prefers valid custom from/to over presets", () => {
    const result = resolveNewOptionProductsDateRange(
      {
        from: "2026-06-01",
        to: "2026-06-10",
        days: 90,
      },
      TODAY,
    );

    assert.equal(result.from, "2026-06-01");
    assert.equal(result.to, "2026-06-10");
    assert.equal(result.days, null);
  });

  it("falls back to default when custom range is invalid", () => {
    const result = resolveNewOptionProductsDateRange(
      {
        from: "2026-06-10",
        to: "2026-06-01",
      },
      TODAY,
    );

    assert.equal(result.days, NEW_OPTION_PRODUCTS_DEFAULT_DAYS);
    assert.equal(result.to, "2026-06-17");
  });
});
