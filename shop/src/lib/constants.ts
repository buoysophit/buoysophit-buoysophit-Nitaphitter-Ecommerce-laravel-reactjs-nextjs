import { atom } from 'jotai';

export const CART_KEY = 'chawk-cart';
export const TOKEN = 'token';
export const AUTH_TOKEN = 'auth_token';
export const AUTH_PERMISSIONS = 'auth_permissions';
export const LIMIT = 10;
export const SUPER_ADMIN = 'super_admin';
export const CUSTOMER = 'customer';
export const CHECKOUT = 'chawkbazar-checkout';
export const RTL_LANGUAGES: ReadonlyArray<string> = ['ar', 'he'];
export const EMAIL_VERIFIED = 'EMAIL_VERIFIED';
export const AUTH_CRED = 'AUTH_CRED_SHOP';
export const STORE_OWNER = 'store_owner';
export const STAFF = 'staff';
export const isMultiLangEnable =
  process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
  !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;
export const checkIsMaintenanceModeComing = atom(false);
export const checkIsMaintenanceModeStart = atom(false);
export const checkIsShopMaintenanceModeComing = atom(false);
export const checkIsShopMaintenanceModeStart = atom(false);
export const checkIsScrollingStart = atom(false);
export const RESPONSIVE_WIDTH = 1024 as number;
export const NEWSLETTER_POPUP_MODAL_KEY = 'SEEN_POPUP';
export const ORDER_STATUS = [
  { name: 'Order Pending', status: 'order-pending', serial: 1 },
  { name: 'Order Processing', status: 'order-processing', serial: 2 },
  {
    name: 'Order At Local Facility',
    status: 'order-at-local-facility',
    serial: 3,
  },
  {
    name: 'Order Out For Delivery',
    status: 'order-out-for-delivery',
    serial: 4,
  },
  { name: 'Order Completed', status: 'order-completed', serial: 5 },
  { name: 'Order Cancelled', status: 'order-cancelled', serial: 5 },
  { name: 'Order Refunded', status: 'order-refunded', serial: 5 },
  { name: 'Order Failed', status: 'order-failed', serial: 5 },
];

export function getDirection(language: string | undefined) {
  if (!language) return 'ltr';
  return RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
}