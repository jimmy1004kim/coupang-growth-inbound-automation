import { requireProfile } from "@/lib/auth/profile";

export default async function ShoplingProductsPage() {
  await requireProfile();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">상품정보</h1>
      <p className="text-muted-foreground">
        샵플링 동기화 재고·상품 정보를 조회합니다.
      </p>
    </div>
  );
}
