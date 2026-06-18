-- CreateEnum
CREATE TYPE "TelegramBoxListUploadStatus" AS ENUM ('processing', 'completed', 'failed');

-- CreateTable
CREATE TABLE "telegram_box_list_upload" (
    "id" TEXT NOT NULL,
    "storage_path" TEXT,
    "output_file_name" TEXT NOT NULL,
    "telegram_chat_id" TEXT NOT NULL,
    "telegram_message_id" BIGINT NOT NULL,
    "telegram_update_id" BIGINT NOT NULL,
    "telegram_user_name" TEXT,
    "row_count" INTEGER NOT NULL DEFAULT 0,
    "image_count" INTEGER NOT NULL DEFAULT 1,
    "status" "TelegramBoxListUploadStatus" NOT NULL DEFAULT 'processing',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "telegram_box_list_upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "telegram_box_list_upload_telegram_update_id_key" ON "telegram_box_list_upload"("telegram_update_id");

-- CreateIndex
CREATE INDEX "idx_telegram_box_list_upload_created_at" ON "telegram_box_list_upload"("created_at");

-- CreateIndex
CREATE INDEX "idx_telegram_box_list_upload_status_at" ON "telegram_box_list_upload"("status", "created_at");
