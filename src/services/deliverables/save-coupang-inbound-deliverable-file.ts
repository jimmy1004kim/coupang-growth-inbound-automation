import {
  getCoupangInboundDeliverableStoragePath,
  uploadExcelFile,
} from "@/lib/supabase/storage";

type SaveCoupangInboundDeliverableFileInput = {
  deliverableId: string;
  buffer: Buffer;
};

export async function saveCoupangInboundDeliverableFile(
  input: SaveCoupangInboundDeliverableFileInput,
): Promise<string> {
  const path = getCoupangInboundDeliverableStoragePath(input.deliverableId);

  await uploadExcelFile(
    path,
    input.buffer,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    { upsert: false },
  );

  return path;
}
