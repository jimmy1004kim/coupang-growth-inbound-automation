import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildBoxListExcelBuffer } from "@/lib/vision/build-box-list-excel-buffer";
import type { VisionExtractedData } from "@/lib/vision/types";

describe("buildBoxListExcelBuffer", () => {
  it("creates an xlsx buffer with barcode and quantity columns", () => {
    const visionData: VisionExtractedData = {
      columns: ["바코드", "수량"],
      rows: [
        { 바코드: "8801234567890", 수량: "3" },
        { 바코드: "8809876543210", 수량: "1" },
      ],
    };

    const buffer = buildBoxListExcelBuffer(visionData);

    assert.ok(Buffer.isBuffer(buffer));
    assert.ok(buffer.length > 0);
    assert.equal(buffer.subarray(0, 2).toString("utf8"), "PK");
  });
});
