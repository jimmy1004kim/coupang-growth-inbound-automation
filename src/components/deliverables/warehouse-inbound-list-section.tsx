"use client";

import { useState } from "react";

import { DeliverablesSection } from "@/components/deliverables/deliverables-section";
import { Button } from "@/components/ui/button";

type WarehouseInboundListSectionProps = {
  sellerId: string;
};

export function WarehouseInboundListSection({
  sellerId,
}: WarehouseInboundListSectionProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const hasSeller = sellerId.trim().length > 0;

  function handleDownloadClick() {
    setNotice("준비 중입니다. 다운로드 기능은 곧 연동됩니다.");
  }

  return (
    <DeliverablesSection
      title="창고 전송용 입고리스트 생성"
      description="대시보드 입고추천 수량 기준, 샵플링 로케이션·바코드가 반영된 창고 전달용 엑셀입니다."
      variant="plain"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          스냅샷 · 다운로드 가능 건수: {hasSeller ? "준비 중" : "-"}
        </p>
        <Button
          type="button"
          size="sm"
          disabled={!hasSeller}
          onClick={handleDownloadClick}
        >
          다운로드
        </Button>
      </div>

      {!hasSeller ? (
        <p className="mt-3 text-sm text-muted-foreground">
          판매자 계정을 선택해 주세요.
        </p>
      ) : null}

      {notice ? (
        <p className="mt-3 text-sm text-muted-foreground" role="status">
          {notice}
        </p>
      ) : null}
    </DeliverablesSection>
  );
}
