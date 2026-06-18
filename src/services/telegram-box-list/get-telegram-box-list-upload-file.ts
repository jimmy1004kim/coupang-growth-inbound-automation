import "server-only";

import { prisma } from "@/lib/db";
import { downloadExcelFile } from "@/lib/supabase/storage";

type TelegramBoxListUploadFileResult =
  | {
      ok: true;
      data: {
        buffer: Buffer;
        outputFileName: string;
      };
    }
  | {
      ok: false;
      error: string;
    };

export async function getTelegramBoxListUploadFile(
  uploadId: string,
): Promise<TelegramBoxListUploadFileResult> {
  const upload = await prisma.telegramBoxListUpload.findUnique({
    where: { id: uploadId },
    select: {
      status: true,
      storagePath: true,
      outputFileName: true,
    },
  });

  if (!upload) {
    return { ok: false, error: "업로드 기록을 찾을 수 없습니다." };
  }

  if (upload.status !== "completed" || !upload.storagePath) {
    return { ok: false, error: "다운로드할 수 있는 파일이 없습니다." };
  }

  const buffer = await downloadExcelFile(upload.storagePath);

  if (!buffer) {
    return { ok: false, error: "Storage에서 파일을 찾을 수 없습니다." };
  }

  return {
    ok: true,
    data: {
      buffer,
      outputFileName: upload.outputFileName,
    },
  };
}
