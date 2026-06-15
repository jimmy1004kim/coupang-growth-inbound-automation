import Link from "next/link";

import { buildProductsQuery } from "@/components/shopling-data/build-products-query";
import { ShoplingPageSizeSelect } from "@/components/shopling-data/shopling-page-size-select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ShoplingProductsToolbarProps = {
  search: string;
  page: number;
  pageSize: number;
  totalCount: number;
  hasSnapshot: boolean;
};

export function ShoplingProductsToolbar({
  search,
  page,
  pageSize,
  totalCount,
  hasSnapshot,
}: ShoplingProductsToolbarProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const showPagination = hasSnapshot && totalCount > 0;

  if (!hasSnapshot) {
    return null;
  }

  return (
    <div className="space-y-3">
      <form
        method="GET"
        action="/data/shopling/products"
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <Input
          name="q"
          type="search"
          defaultValue={search}
          placeholder="샵플링코드 · 자사상품코드 · 바코드 검색"
          className="sm:max-w-md"
        />
        <input type="hidden" name="pageSize" value={pageSize} />
        <Button type="submit" size="sm">
          조회
        </Button>
      </form>

      {showPagination ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ShoplingPageSizeSelect pageSize={pageSize} search={search} />

          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {page} / {totalPages} 페이지
            </p>
            <div className="flex gap-2">
              {hasPrev ? (
                <Link
                  href={`/data/shopling/products${buildProductsQuery({
                    q: search,
                    page: page - 1,
                    pageSize,
                  })}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  이전
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  이전
                </Button>
              )}
              {hasNext ? (
                <Link
                  href={`/data/shopling/products${buildProductsQuery({
                    q: search,
                    page: page + 1,
                    pageSize,
                  })}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  다음
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  다음
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
