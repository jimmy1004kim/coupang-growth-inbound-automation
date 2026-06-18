import { prisma } from "@/lib/db";
import type {
  CoupangInboundDeliverableListItem,
  ListCoupangInboundDeliverablesResult,
} from "@/services/deliverables/types";
import { normalizeShoplingInboundDeliverablePageSize } from "@/services/deliverables/types";

type RawCoupangInboundItem = {
  productBarcode: string;
  coupangOptionId: bigint | null;
  quantity: number;
};

type RawCoupangInboundDeliverableRow = {
  id: string;
  outputFileName: string;
  sourceFileName: string | null;
  matchedCount: number;
  unmatchedCount: number;
  recordedAt: Date;
  coupangSellerAccount: { displayName: string };
  recordedBy: { name: string | null; email: string } | null;
  items: RawCoupangInboundItem[];
};

export function mapCoupangInboundDeliverableRow(
  row: RawCoupangInboundDeliverableRow,
): CoupangInboundDeliverableListItem {
  const itemCount = row.items.length;
  const totalQuantity = row.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: row.id,
    outputFileName: row.outputFileName,
    sourceFileName: row.sourceFileName,
    sellerDisplayName: row.coupangSellerAccount.displayName,
    recordedAt: row.recordedAt.toISOString(),
    recordedByName: row.recordedBy?.name ?? row.recordedBy?.email ?? null,
    matchedCount: row.matchedCount,
    unmatchedCount: row.unmatchedCount,
    itemCount,
    totalQuantity,
    items: row.items.map((item) => ({
      productBarcode: item.productBarcode,
      coupangOptionId: item.coupangOptionId?.toString() ?? null,
      quantity: item.quantity,
    })),
  };
}

type ListCoupangInboundDeliverablesOptions = {
  page?: number;
  pageSize?: number;
  exportAll?: boolean;
};

export async function listCoupangInboundDeliverables(
  options: ListCoupangInboundDeliverablesOptions = {},
): Promise<ListCoupangInboundDeliverablesResult> {
  const pageSize = normalizeShoplingInboundDeliverablePageSize(options.pageSize);
  const page = Math.max(1, options.page ?? 1);
  const exportAll = options.exportAll === true;
  const skip = (page - 1) * pageSize;

  const [rowCount, rows] = await Promise.all([
    prisma.coupangInboundDeliverable.count(),
    prisma.coupangInboundDeliverable.findMany({
      orderBy: { recordedAt: "desc" },
      ...(exportAll
        ? {}
        : {
            skip,
            take: pageSize,
          }),
      select: {
        id: true,
        outputFileName: true,
        sourceFileName: true,
        matchedCount: true,
        unmatchedCount: true,
        recordedAt: true,
        coupangSellerAccount: {
          select: {
            displayName: true,
          },
        },
        recordedBy: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            productBarcode: true,
            coupangOptionId: true,
            quantity: true,
          },
          orderBy: [{ productBarcode: "asc" }, { id: "asc" }],
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(rowCount / pageSize));

  return {
    rowCount,
    page,
    pageSize,
    totalPages,
    rows: rows.map(mapCoupangInboundDeliverableRow),
  };
}
