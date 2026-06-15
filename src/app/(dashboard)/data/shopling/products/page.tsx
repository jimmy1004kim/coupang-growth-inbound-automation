import { ShoplingProductsPanel } from "@/components/shopling-data/shopling-products-panel";
import { requireProfile } from "@/lib/auth/profile";
import { listShoplingInventory } from "@/services/shopling-data/list-shopling-inventory";
import { SHOPLING_INVENTORY_PAGE_SIZE } from "@/services/shopling-data/types";

type ShoplingProductsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ShoplingProductsPage({
  searchParams,
}: ShoplingProductsPageProps) {
  await requireProfile();

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const data = await listShoplingInventory({ page });

  return (
    <ShoplingProductsPanel
      data={data}
      page={page}
      pageSize={SHOPLING_INVENTORY_PAGE_SIZE}
    />
  );
}
