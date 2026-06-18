import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildCoupangInboundDeliverableItemCreates,
  buildCoupangInboundRecordCreates,
} from "@/services/deliverables/build-coupang-inbound-deliverable-items";
import {
  buildCoupangInboundHistoryFilename,
  generateCoupangInboundHistoryBuffer,
} from "@/lib/excel/generators/coupang-inbound-history-export";

describe("buildCoupangInboundDeliverableItemCreates", () => {
  it("maps aggregated items to deliverable item rows", () => {
    const items = buildCoupangInboundDeliverableItemCreates("del-1", [
      {
        productBarcode: "123",
        coupangOptionId: "987654321",
        quantity: 5,
      },
    ]);

    assert.equal(items.length, 1);
    assert.equal(items[0]?.deliverableId, "del-1");
    assert.equal(items[0]?.productBarcode, "123");
    assert.equal(items[0]?.coupangOptionId, 987654321n);
    assert.equal(items[0]?.quantity, 5);
  });
});

describe("buildCoupangInboundRecordCreates", () => {
  it("uses deliverable id as batch id", () => {
    const records = buildCoupangInboundRecordCreates(
      "del-1",
      "seller-1",
      "profile-1",
      [
        {
          productBarcode: "123",
          coupangOptionId: null,
          quantity: 2,
        },
      ],
    );

    assert.equal(records[0]?.batchId, "del-1");
    assert.equal(records[0]?.coupangSellerAccountId, "seller-1");
    assert.equal(records[0]?.recordedById, "profile-1");
  });
});

describe("generateCoupangInboundHistoryBuffer", () => {
  it("writes history and detail sheets", () => {
    const buffer = generateCoupangInboundHistoryBuffer([
      {
        id: "del-1",
        outputFileName: "쿠팡_입고템플릿_생성.xlsx",
        sourceFileName: "box.xlsx",
        sellerDisplayName: "테스트 판매자",
        recordedAt: "2026-06-17T03:00:00.000Z",
        recordedByName: "홍길동",
        matchedCount: 2,
        unmatchedCount: 1,
        itemCount: 1,
        totalQuantity: 10,
        items: [
          {
            productBarcode: "111",
            coupangOptionId: "222",
            quantity: 10,
          },
        ],
      },
    ]);

    assert.ok(buffer.length > 0);
    assert.match(buildCoupangInboundHistoryFilename(), /^쿠팡그로스_입고이력_/);
  });
});
