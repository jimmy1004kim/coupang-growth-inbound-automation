import type { AggregatedInboundRecordItem } from "@/services/deliverables/types";

export function buildCoupangInboundDeliverableItemCreates(
  deliverableId: string,
  aggregated: AggregatedInboundRecordItem[],
) {
  return aggregated.map((item) => ({
    deliverableId,
    productBarcode: item.productBarcode,
    coupangOptionId: parseCoupangOptionId(item.coupangOptionId),
    quantity: item.quantity,
  }));
}

function parseCoupangOptionId(value: string | null): bigint | null {
  if (!value) {
    return null;
  }

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

export function buildCoupangInboundRecordCreates(
  deliverableId: string,
  coupangSellerAccountId: string,
  recordedById: string,
  aggregated: AggregatedInboundRecordItem[],
) {
  return aggregated.map((item) => ({
    coupangSellerAccountId,
    productBarcode: item.productBarcode,
    coupangOptionId: parseCoupangOptionId(item.coupangOptionId),
    quantity: item.quantity,
    recordedById,
    batchId: deliverableId,
  }));
}
