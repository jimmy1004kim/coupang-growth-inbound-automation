import * as XLSX from "xlsx";

import { convertVisionDataToBoxItems } from "@/lib/vision/convert-vision-to-box-items";
import type { VisionExtractedData } from "@/lib/vision/types";

export const BOX_LIST_EXCEL_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export function buildBoxListExcelFilename(prefix = "box-list-from-image") {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19);

  return `${prefix}-${timestamp}.xlsx`;
}

export function buildBoxListExcelBytes(
  visionData: VisionExtractedData,
): Uint8Array {
  const { items } = convertVisionDataToBoxItems(visionData);

  const rows = items.map((item) => ({
    바코드: item.barcode,
    수량: item.quantity,
    ...(item.productName ? { 등록상품명: item.productName } : {}),
    ...(item.optionName ? { 옵션: item.optionName } : {}),
    ...(item.location ? { location: item.location } : {}),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return XLSX.write(workbook, { type: "array", bookType: "xlsx" });
}

export function buildBoxListExcelBuffer(
  visionData: VisionExtractedData,
): Buffer {
  return Buffer.from(buildBoxListExcelBytes(visionData));
}
