export const FREE_DELIVERY_THRESHOLD = 2000;

export const DELIVERY_FEE = 100;

export const COUPONS: Record<string, { label: string; amount: number; minSubtotal: number }> = {
  SNT100: { label: 'Rs. 100 off orders above Rs. 1,500', amount: 100, minSubtotal: 1500 },
  PAYJC: { label: 'Rs. 150 off with JazzCash or Easypaisa', amount: 150, minSubtotal: 1000 },
};
