-- 입고 작업대·재고현황 조회: 최신 샵플링 스냅샷 + 바코드 조인 가속
CREATE INDEX IF NOT EXISTS "idx_shopling_inv_snapshot_barcode"
  ON "shopling_inventory"("snapshot_date", "barcode");

-- 회전입고·실포장 집계: 판매자+바코드 선필터
CREATE INDEX IF NOT EXISTS "idx_inbound_record_seller_barcode"
  ON "coupang_inbound_record"("coupang_seller_account_id", "product_barcode")
  WHERE quantity > 0;
