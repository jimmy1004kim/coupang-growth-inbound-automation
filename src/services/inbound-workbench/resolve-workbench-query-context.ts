import { prisma } from "@/lib/db";
import type { WorkbenchQueryContext } from "@/services/inbound-workbench/inbound-workbench-query-sql";

export async function resolveWorkbenchQueryContext(
  sellerIds: string[],
): Promise<WorkbenchQueryContext | null> {
  if (sellerIds.length === 0) {
    return null;
  }

  const shopling = await prisma.shoplingInventory.aggregate({
    _max: { snapshotDate: true },
  });

  const template = await prisma.coupangGrowthInboundTemplate.aggregate({
    where: { coupangSellerAccountId: { in: sellerIds } },
    _max: { snapshotDate: true },
  });

  if (!template._max.snapshotDate) {
    return null;
  }

  return {
    sellerIds,
    shoplingSnapshotDate: shopling._max.snapshotDate,
  };
}
