import { CoupangInboundRecordHistorySection } from "@/components/deliverables/coupang-inbound-record-history-section";
import { requireProfile } from "@/lib/auth/profile";
import { listCoupangInboundDeliverables } from "@/services/deliverables/list-coupang-inbound-deliverables";
import { normalizeShoplingInboundDeliverablePageSize } from "@/services/deliverables/types";

type DashboardCoupangInboundPageProps = {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
};

export default async function DashboardCoupangInboundPage({
  searchParams,
}: DashboardCoupangInboundPageProps) {
  await requireProfile();

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = normalizeShoplingInboundDeliverablePageSize(
    Number(params.pageSize),
  );
  const history = await listCoupangInboundDeliverables({ page, pageSize });

  return <CoupangInboundRecordHistorySection data={history} />;
}
