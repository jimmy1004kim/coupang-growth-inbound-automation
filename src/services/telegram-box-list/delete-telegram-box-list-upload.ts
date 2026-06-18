import { prisma } from "@/lib/db";
import { deleteExcelFile } from "@/lib/supabase/storage";

type DeleteTelegramBoxListUploadResult =
  | { ok: true; data: undefined }
  | { ok: false; error: string };

export async function deleteTelegramBoxListUpload(
  id: string,
): Promise<DeleteTelegramBoxListUploadResult> {
  if (!id.trim()) {
    return { ok: false, error: "id는 필수입니다." };
  }

  const upload = await prisma.telegramBoxListUpload.findUnique({
    where: { id },
    select: {
      id: true,
      storagePath: true,
    },
  });

  if (!upload) {
    return { ok: false, error: "업로드 기록을 찾을 수 없습니다." };
  }

  try {
    await prisma.telegramBoxListUpload.delete({ where: { id } });
  } catch {
    return { ok: false, error: "업로드 기록 삭제에 실패했습니다." };
  }

  if (upload.storagePath) {
    try {
      await deleteExcelFile(upload.storagePath);
    } catch {
      // DB 삭제 우선 — Storage 파일은 best-effort 정리
    }
  }

  return { ok: true, data: undefined };
}
