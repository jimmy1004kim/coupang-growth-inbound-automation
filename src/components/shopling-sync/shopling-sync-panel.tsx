"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ShoplingPackageMappingSyncCard } from "@/components/shopling-sync/shopling-package-mapping-sync-card";
import { apiPost } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ShoplingSyncRunResult,
  ShoplingSyncStatus,
  ShoplingSyncStoppedReason,
} from "@/services/shopling-sync/types";

type ShoplingSyncPanelProps = {
  initialStatus: ShoplingSyncStatus;
};

type InventorySyncDialogState =
  | { open: false }
  | { open: true; type: "success"; result: ShoplingSyncRunResult }
  | { open: true; type: "error"; message: string };

function formatYmd(ymd: string): string {
  if (ymd.length !== 8) {
    return ymd;
  }

  return `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
}

function formatStoppedReason(reason: ShoplingSyncStoppedReason): string {
  if (reason === "empty_streak") {
    return "연속 빈 청크 5회 도달";
  }

  return "최대 40청크 처리 완료";
}

export function ShoplingSyncPanel({ initialStatus }: ShoplingSyncPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<InventorySyncDialogState>({ open: false });

  const isDisabled = !initialStatus.hasApiConfig || loading;
  const { syncPolicy } = initialStatus;

  async function handleSync() {
    setDialog({ open: false });
    setLoading(true);

    const response = await apiPost<ShoplingSyncRunResult>(
      "/api/shopling-sync/run",
      {},
    );

    setLoading(false);

    if (!response.ok) {
      setDialog({ open: true, type: "error", message: response.error });
      return;
    }

    setDialog({ open: true, type: "success", result: response.data });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>동기화 상태</CardTitle>
          <CardDescription>
            오늘(KST)부터 3개월씩 과거로 최대 {syncPolicy.maxChunks}청크 조회 후
            당일 스냅샷으로 DB에 reload합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">조회 기준</dt>
              <dd>
                {syncPolicy.searchTp} · {syncPolicy.chunkMonths}개월 청크 · 최대{" "}
                {syncPolicy.maxChunks}회
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">중단 조건</dt>
              <dd>연속 빈 청크 {syncPolicy.emptyStop}회</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">스냅샷 기준일 (KST)</dt>
              <dd>{formatYmd(initialStatus.snapshotDate)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">오늘 적재 행 수 (재고)</dt>
              <dd>{initialStatus.todayRowCount.toLocaleString()}건</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">패키지 매핑 DB 행 수</dt>
              <dd>{initialStatus.packageMappingRowCount.toLocaleString()}건</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">마지막 동기화</dt>
              <dd>
                {initialStatus.lastIngestion
                  ? `${formatDateTime(initialStatus.lastIngestion.createdAt)} · ${initialStatus.lastIngestion.rowCount.toLocaleString()}건${
                      initialStatus.lastIngestion.uploadedByName
                        ? ` · ${initialStatus.lastIngestion.uploadedByName}`
                        : ""
                    }`
                  : "없음"}
              </dd>
            </div>
          </dl>

          {!initialStatus.hasApiConfig ? (
            <p className="text-muted-foreground">
              API 설정이 필요합니다.{" "}
              <Link
                href="/integrations/shopling"
                className="text-primary underline-offset-4 hover:underline"
              >
                외부 연동 &gt; 샵플링
              </Link>
              에서 인증 정보를 저장해 주세요.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>샵플링 재고 동기화</CardTitle>
          <CardDescription>
            등록일 기준으로 과거 방향 3개월 창을 연속 조회합니다. 청크 경계일은
            맞닿으며, 중복 SKU는 goods_key+barcode 기준으로 제거합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button type="button" disabled={isDisabled} onClick={handleSync}>
            {loading ? "샵플링 재고 동기화 중..." : "샵플링 재고 동기화"}
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={dialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setDialog({ open: false });
          }
        }}
      >
        <DialogContent
          className={
            dialog.open && dialog.type === "success" ? "sm:max-w-2xl" : undefined
          }
        >
          {dialog.open && dialog.type === "error" ? (
            <>
              <DialogHeader>
                <DialogTitle>샵플링 재고 동기화 실패</DialogTitle>
                <DialogDescription className="text-destructive">
                  {dialog.message}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setDialog({ open: false })}
                >
                  확인
                </Button>
              </DialogFooter>
            </>
          ) : null}

          {dialog.open && dialog.type === "success" ? (
            <>
              <DialogHeader>
                <DialogTitle>샵플링 재고 동기화 완료</DialogTitle>
                <DialogDescription>
                  조회·적재가 완료되었습니다. 아래 요약을 확인해 주세요.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                <dl className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">조회 기간</dt>
                    <dd>
                      {formatYmd(dialog.result.oldestStartDt)} ~{" "}
                      {formatYmd(dialog.result.newestEndDt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">스냅샷 기준일</dt>
                    <dd>{formatYmd(dialog.result.snapshotDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">처리 청크</dt>
                    <dd>{dialog.result.chunksProcessed}개</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">중단 사유</dt>
                    <dd>{formatStoppedReason(dialog.result.stoppedReason)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">상품 건수 (합계)</dt>
                    <dd>
                      {dialog.result.fetchedProductCount.toLocaleString()}건
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      적재 행 수 (dedupe 후)
                    </dt>
                    <dd>{dialog.result.rowCount.toLocaleString()}건</dd>
                  </div>
                </dl>

                {dialog.result.chunks.length > 0 ? (
                  <div className="max-h-64 overflow-x-auto overflow-y-auto rounded-md border border-border">
                    <table className="w-full min-w-[28rem] text-left text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="px-3 py-2 pr-3 font-medium">청크</th>
                          <th className="py-2 pr-3 font-medium">기간</th>
                          <th className="py-2 pr-3 font-medium">상품</th>
                          <th className="py-2 pr-3 font-medium">병합 행</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dialog.result.chunks.map((chunk) => (
                          <tr
                            key={chunk.chunkIndex}
                            className="border-b border-border/60"
                          >
                            <td className="px-3 py-2 pr-3">{chunk.chunkIndex}</td>
                            <td className="py-2 pr-3">
                              {formatYmd(chunk.startDt)} ~{" "}
                              {formatYmd(chunk.endDt)}
                            </td>
                            <td className="py-2 pr-3">{chunk.productCount}</td>
                            <td className="py-2 pr-3">{chunk.rowsMerged}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={() => setDialog({ open: false })}
                >
                  확인
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <ShoplingPackageMappingSyncCard
        hasApiConfig={initialStatus.hasApiConfig}
      />
    </div>
  );
}
