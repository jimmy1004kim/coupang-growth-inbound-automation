-- CreateTable
CREATE TABLE "coupang_inbound_deliverable" (
    "id" TEXT NOT NULL,
    "coupang_seller_account_id" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "output_file_name" TEXT NOT NULL,
    "source_file_name" TEXT,
    "matched_count" INTEGER NOT NULL DEFAULT 0,
    "unmatched_count" INTEGER NOT NULL DEFAULT 0,
    "recorded_by_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupang_inbound_deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupang_inbound_deliverable_item" (
    "id" TEXT NOT NULL,
    "deliverable_id" TEXT NOT NULL,
    "product_barcode" TEXT NOT NULL,
    "coupang_option_id" BIGINT,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "coupang_inbound_deliverable_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_coupang_inbound_deliverable_seller_at" ON "coupang_inbound_deliverable"("coupang_seller_account_id", "recorded_at");

-- CreateIndex
CREATE INDEX "idx_coupang_inbound_deliverable_by_at" ON "coupang_inbound_deliverable"("recorded_by_id", "recorded_at");

-- CreateIndex
CREATE INDEX "idx_coupang_inbound_deliverable_item_deliverable" ON "coupang_inbound_deliverable_item"("deliverable_id");

-- CreateIndex
CREATE INDEX "idx_coupang_inbound_deliverable_item_barcode" ON "coupang_inbound_deliverable_item"("product_barcode");

-- AddForeignKey
ALTER TABLE "coupang_inbound_deliverable" ADD CONSTRAINT "coupang_inbound_deliverable_coupang_seller_account_id_fkey" FOREIGN KEY ("coupang_seller_account_id") REFERENCES "CoupangSellerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupang_inbound_deliverable" ADD CONSTRAINT "coupang_inbound_deliverable_recorded_by_id_fkey" FOREIGN KEY ("recorded_by_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupang_inbound_deliverable_item" ADD CONSTRAINT "coupang_inbound_deliverable_item_deliverable_id_fkey" FOREIGN KEY ("deliverable_id") REFERENCES "coupang_inbound_deliverable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
