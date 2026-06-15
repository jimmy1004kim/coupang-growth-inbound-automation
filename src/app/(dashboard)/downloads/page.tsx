import { DeliverablesPanel } from "@/components/deliverables/deliverables-panel";
import { requireProfile } from "@/lib/auth/profile";
import { resolveSellerAccountId } from "@/services/coupang-seller-accounts/get-default-seller-account-id";
import { listSellerAccounts } from "@/services/coupang-seller-accounts/list-seller-accounts";

type DownloadsPageProps = {
  searchParams: Promise<{ seller?: string }>;
};

export default async function DownloadsPage({
  searchParams,
}: DownloadsPageProps) {
  await requireProfile();

  const params = await searchParams;
  const accounts = await listSellerAccounts();
  const sellerId = resolveSellerAccountId(accounts, params.seller);

  return <DeliverablesPanel accounts={accounts} sellerId={sellerId} />;
}
