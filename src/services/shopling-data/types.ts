export type ShoplingInventoryRowView = {
  goodsKey: string;
  ptnGoodsCd: string | null;
  saleStatus: string | null;
  goodsTp: string | null;
  barcode: string;
  optionTitle: string | null;
  optionValue: string | null;
  availableStock: number;
  optStatus: string | null;
  location: string | null;
};

export type ListShoplingInventoryResult = {
  snapshotDate: string | null;
  totalCount: number;
  rows: ShoplingInventoryRowView[];
};

export const SHOPLING_INVENTORY_PAGE_SIZE_OPTIONS = [25, 50, 100, 200] as const;
export const SHOPLING_INVENTORY_DEFAULT_PAGE_SIZE = 50;

/** @deprecated Use SHOPLING_INVENTORY_DEFAULT_PAGE_SIZE */
export const SHOPLING_INVENTORY_PAGE_SIZE = SHOPLING_INVENTORY_DEFAULT_PAGE_SIZE;

export function normalizeShoplingInventoryPageSize(value?: number): number {
  if (
    value !== undefined &&
    SHOPLING_INVENTORY_PAGE_SIZE_OPTIONS.includes(
      value as (typeof SHOPLING_INVENTORY_PAGE_SIZE_OPTIONS)[number],
    )
  ) {
    return value;
  }

  return SHOPLING_INVENTORY_DEFAULT_PAGE_SIZE;
}

export type ShoplingNewOptionProductRowView = {
  goodsKey: string;
  optId: string;
  ptnGoodsCd: string | null;
  optionValue: string | null;
  barcode: string;
  firstAddedDate: string;
};

export type ListNewOptionProductsResult = {
  hasInventoryHistory: boolean;
  from: string;
  to: string;
  days: number | null;
  totalCount: number;
  rows: ShoplingNewOptionProductRowView[];
};

export {
  NEW_OPTION_PRODUCTS_DAY_PRESETS,
  NEW_OPTION_PRODUCTS_DEFAULT_DAYS,
  type NewOptionProductsDayPreset,
} from "@/services/shopling-data/resolve-new-option-products-date-range";
