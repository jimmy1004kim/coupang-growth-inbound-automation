import { requireApiProfile } from "@/lib/api/auth";
import { logRouteError } from "@/lib/api/log-route-error";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { listTelegramBoxListUploads } from "@/services/telegram-box-list/list-telegram-box-list-uploads";

export async function GET(request: Request) {
  try {
    const auth = await requireApiProfile();

    if ("response" in auth) {
      return auth.response;
    }

    const url = new URL(request.url);
    const limitRaw = url.searchParams.get("limit");
    const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 20;

    const uploads = await listTelegramBoxListUploads({
      limit: Number.isFinite(limit) ? limit : 20,
    });

    return jsonSuccess({ uploads });
  } catch (error) {
    logRouteError(error, {
      route: "/api/telegram/box-list-uploads",
      method: "GET",
    });

    const message =
      error instanceof Error
        ? error.message
        : "텔레그램 업로드 목록 조회에 실패했습니다.";

    return jsonError(message, 500);
  }
}
