import { Fragment } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { InboundTrendsRowView } from "@/services/inbound-trends/types";

type TrendsTableProps = {
  rows: InboundTrendsRowView[];
  dates: string[];
};

function formatCell(value: string | null | undefined): string {
  if (!value || value.trim().length === 0) {
    return "-";
  }

  return value;
}

function formatQty(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "-";
  }

  return value.toLocaleString();
}

function formatDateHeader(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

const STICKY_CELL_CLASS =
  "sticky z-10 bg-background after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border";

export function TrendsTable({ rows, dates }: TrendsTableProps) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              <TableHead
                rowSpan={2}
                className={cn(STICKY_CELL_CLASS, "left-0 min-w-[120px]")}
              >
                쿠팡상품아이디
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn(STICKY_CELL_CLASS, "left-[120px] min-w-[100px]")}
              >
                옵션아이디
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn(STICKY_CELL_CLASS, "left-[220px] min-w-[110px]")}
              >
                자사상품코드
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn(STICKY_CELL_CLASS, "left-[330px] min-w-[140px]")}
              >
                샵플링 옵션 벨류
              </TableHead>
              <TableHead
                rowSpan={2}
                className={cn(STICKY_CELL_CLASS, "left-[470px] min-w-[120px]")}
              >
                바코드
              </TableHead>
              {dates.map((date) => (
                <TableHead
                  key={date}
                  colSpan={2}
                  className="border-l border-border text-center"
                >
                  {formatDateHeader(date)}
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="hover:bg-transparent">
              {dates.map((date) => (
                <Fragment key={date}>
                  <TableHead className="min-w-[72px] border-l border-border text-right text-xs">
                    {formatDateHeader(date)}(완)
                  </TableHead>
                  <TableHead className="min-w-[72px] text-right text-xs">
                    {formatDateHeader(date)}
                  </TableHead>
                </Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.rowKey}>
                <TableCell className={cn(STICKY_CELL_CLASS, "left-0")}>
                  {formatCell(row.registeredProductId)}
                </TableCell>
                <TableCell className={cn(STICKY_CELL_CLASS, "left-[120px]")}>
                  {formatCell(row.optionId)}
                </TableCell>
                <TableCell className={cn(STICKY_CELL_CLASS, "left-[220px]")}>
                  {formatCell(row.ptnGoodsCd)}
                </TableCell>
                <TableCell className={cn(STICKY_CELL_CLASS, "left-[330px]")}>
                  {formatCell(row.shoplingOptionValue)}
                </TableCell>
                <TableCell className={cn(STICKY_CELL_CLASS, "left-[470px]")}>
                  {formatCell(row.productBarcode)}
                </TableCell>
                {dates.map((date) => {
                  const values = row.dateValues[date];

                  return (
                    <Fragment key={date}>
                      <TableCell className="border-l border-border text-right tabular-nums">
                        {formatQty(values?.coupang)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatQty(values?.warehouse)}
                      </TableCell>
                    </Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
