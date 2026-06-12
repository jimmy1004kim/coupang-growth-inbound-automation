export type ShoplingApiConfigView = {
  loginId: string;
  companyId: string;
  apiAuthKeyMasked: string;
  hasConfig: boolean;
  updatedAt: string | null;
};

export type UpsertShoplingApiConfigInput = {
  loginId: string;
  companyId: string;
  apiAuthKey?: string;
};

export type ShoplingApiConfigSecret = {
  loginId: string;
  companyId: string;
  apiAuthKey: string;
};

export type ShoplingApiConfigResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
