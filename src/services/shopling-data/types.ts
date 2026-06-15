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

export const SHOPLING_INVENTORY_PAGE_SIZE = 50;
