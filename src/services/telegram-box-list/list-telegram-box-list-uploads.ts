import "server-only";

import { prisma } from "@/lib/db";

export type TelegramBoxListUploadListItem = {
  id: string;
  outputFileName: string;
  rowCount: number;
  imageCount: number;
  status: "processing" | "completed" | "failed";
  errorMessage: string | null;
  telegramUserName: string | null;
  telegramCaption: string | null;
  createdAt: string;
  completedAt: string | null;
};

export async function listTelegramBoxListUploads(input?: {
  limit?: number;
}): Promise<TelegramBoxListUploadListItem[]> {
  const limit = input?.limit ?? 20;

  const rows = await prisma.telegramBoxListUpload.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      outputFileName: true,
      rowCount: true,
      imageCount: true,
      status: true,
      errorMessage: true,
      telegramUserName: true,
      telegramCaption: true,
      createdAt: true,
      completedAt: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    outputFileName: row.outputFileName,
    rowCount: row.rowCount,
    imageCount: row.imageCount,
    status: row.status,
    errorMessage: row.errorMessage,
    telegramUserName: row.telegramUserName,
    telegramCaption: row.telegramCaption,
    createdAt: row.createdAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
  }));
}
