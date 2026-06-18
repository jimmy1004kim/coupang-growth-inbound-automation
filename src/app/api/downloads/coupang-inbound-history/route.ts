import { requireApiProfile } from "@/lib/api/auth";
import { buildExcelDownloadResponse } from "@/lib/api/download-helpers";
import { logRouteError } from "@/lib/api/log-route-error";
import { jsonError } from "@/lib/api/response";
import {
  buildCoupangInboundHistoryFilename,
  generateCoupangInboundHistoryBuffer,
} from "@/lib/excel/generators/coupang-inbound-history-export";
import { listCoupangInboundDeliverables } from "@/services/deliverables/list-coupang-inbound-deliverables";

export async function GET() {
  try {
    const auth = await requireApiProfile();

    if ("response" in auth) {
      return auth.response;
    }

    const data = await listCoupangInboundDeliverables({ exportAll: true });

    if (data.rowCount === 0) {
      return jsonError("다운로드할 쿠팡그로스 입고 이력이 없습니다.", 400);
    }

    const buffer = generateCoupangInboundHistoryBuffer(data.rows);

    return buildExcelDownloadResponse(
      buffer,
      buildCoupangInboundHistoryFilename(),
    );
  } catch (error) {
    logRouteError(error, {
      route: "/api/downloads/coupang-inbound-history",
      method: "GET",
    });

    const message =
      error instanceof Error
        ? error.message
        : "쿠팡그로스 입고 이력 엑셀 다운로드에 실패했습니다.";

    return jsonError(message, 500);
  }
}
