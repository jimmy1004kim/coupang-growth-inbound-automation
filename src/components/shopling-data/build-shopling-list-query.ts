type BuildShoplingListQueryOptions = {
  q?: string;
  page?: number;
  pageSize?: number;
  defaultPageSize?: number;
  from?: string;
  to?: string;
  days?: number | null;
};

export function buildShoplingListQuery({
  q,
  page,
  pageSize,
  defaultPageSize = 50,
  from,
  to,
  days,
}: BuildShoplingListQueryOptions): string {
  const params = new URLSearchParams();

  const trimmed = q?.trim();
  if (trimmed) {
    params.set("q", trimmed);
  }

  if (days !== undefined && days !== null) {
    params.set("days", String(days));
  } else {
    if (from) {
      params.set("from", from);
    }

    if (to) {
      params.set("to", to);
    }
  }

  if (page !== undefined && page > 1) {
    params.set("page", String(page));
  }

  if (pageSize !== undefined && pageSize !== defaultPageSize) {
    params.set("pageSize", String(pageSize));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}
