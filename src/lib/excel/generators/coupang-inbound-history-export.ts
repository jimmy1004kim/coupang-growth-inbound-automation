import {
  generateMultiSheetListBuffer,
  type SimpleListColumn,
} from "@/lib/excel/generators/simple-list-export";
import type { CoupangInboundDeliverableListItem } from "@/services/deliverables/types";

const HISTORY_COLUMNS: SimpleListColumn[] = [
  { key: "recordedAt", header: "기록일시" },
  { key: "outputFileName", header: "산출물 파일명" },
  { key: "sellerDisplayName", header: "판매자" },
  { key: "sourceFileName", header: "원본 박스리스트" },
  { key: "recordedByName", header: "기록자" },
  { key: "matchedCount", header: "매칭" },
  { key: "unmatchedCount", header: "미매칭" },
  { key: "itemCount", header: "행 수" },
  { key: "totalQuantity", header: "수량 합" },
];

const DETAIL_COLUMNS: SimpleListColumn[] = [
  { key: "outputFileName", header: "산출물 파일명" },
  { key: "productBarcode", header: "바코드" },
  { key: "coupangOptionId", header: "옵션 ID" },
  { key: "quantity", header: "수량" },
];

function formatCell(value: string | null | undefined): string {
  return value?.trim() ? value : "";
}

function formatRecordedAt(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function buildCoupangInboundHistoryFilename(): string {
  return `쿠팡그로스_입고이력_${new Date().toISOString().slice(0, 10)}.xlsx`;
}

export function generateCoupangInboundHistoryBuffer(
  rows: CoupangInboundDeliverableListItem[],
): Buffer {
  const detailRows = rows.flatMap((row) =>
    row.items.map((item) => ({
      outputFileName: row.outputFileName,
      productBarcode: item.productBarcode,
      coupangOptionId: formatCell(item.coupangOptionId),
      quantity: item.quantity,
    })),
  );

  return generateMultiSheetListBuffer([
    {
      sheetName: "이력",
      columns: HISTORY_COLUMNS,
      rows: rows.map((row) => ({
        recordedAt: formatRecordedAt(row.recordedAt),
        outputFileName: row.outputFileName,
        sellerDisplayName: row.sellerDisplayName,
        sourceFileName: formatCell(row.sourceFileName),
        recordedByName: formatCell(row.recordedByName),
        matchedCount: row.matchedCount,
        unmatchedCount: row.unmatchedCount,
        itemCount: row.itemCount,
        totalQuantity: row.totalQuantity,
      })),
    },
    {
      sheetName: "상세",
      columns: DETAIL_COLUMNS,
      rows: detailRows,
    },
  ]);
}
