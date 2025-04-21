import { Item } from '@store/quick-cart/cart.utils';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { QueryKey } from 'react-query';

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authenticationRequired?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};
export interface QueryOptions {
  language?: string;
  page?: number;
  limit?: number;
}

export interface GetParams {
  slug: string;
  language?: string;
}

export interface ParamsType extends QueryOptions {
  type?: string;
  text?: string;
  category?: string;
  tags?: string;
  variations?: string;
  status?: string;
  is_active?: string;
  shop_id?: string;
  limit?: number;
  sortedBy?: string;
  orderBy?: string;
  min_price?: string;
  max_price?: string;
  parent?: string | null;
}

export interface CategoriesQueryOptionsType extends QueryOptions {
  type?: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  parent?: string | null;
}

export type TypeQueryOptionsType = {
  limit?: number;
};

export type BrandsQueryParamsType = {
  limit?: number;
};

export interface ProductsQueryOptionsType extends QueryOptions {
  type?: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  shop_id?: number;
  sortedBy?: string;
  orderBy?: string;
  variations?: string;
  tags?: string;
  min_price?: string;
  max_price?: string;
}

export type TagsQueryOptionsType = {
  limit?: number;
};

export type ShopsQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
  is_active?: number;
};
export type OrdersQueryOptionsType = {
  tracking_number?: string;
  orderBy?: string;
  sortedBy?: string;
  customer_id?: number;
  shop_id?: number;
  first?: number;
  page?: number;
  limit?: number;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Banner = {
  title: string;
  description: string;
  image: {
    id: string;
    original: string;
    thumbnail: string;
  };
};

export declare type KeyBasedImage = {
  key: string;
  image: Attachment[];
};

export declare type Type = {
  id: number | string;
  name: string;
  slug: string;
  icon: string;
  banners: Banner[];
  promotional_sliders: any[];
  images: KeyBasedImage[];
  settings: {
    isHome: boolean;
    layoutType: string;
    productCard: string;
  };
  // products?: Maybe<ProductPaginator>;
  created_at: Date;
  updated_at: Date;
};

export declare type Category = {
  id: number | string;
  name: string;
  slug: string;
  parent?: number;
  parent_id?: number;
  products_count?: number;
  children: Category[];
  details?: string;
  image?: Attachment[];
  icon?: string;
  type: Type;
  products: Product[];
  created_at: Date;
  updated_at: Date;
  banner_image?: Attachment[];
};
export declare type Attachment = {
  id?: number | string;
  thumbnail?: string;
  original?: string;
};

export declare type AttributeValue = {
  id: string;
  attribute_id: string;
  value: string;
  meta?: string;
};

export declare type Attribute = {
  id: string;
  slug: string;
  name: string;
  values: [AttributeValue];
};

export declare type Variation = {
  id: string;
  options?: any;
};
export declare type Product = {
  id?: number | string;
  name?: string;
  slug?: string;
  type?: Type;
  categories?: Category[];
  variations: AttributeValue[];
  variation_options: Variation[];
  // pivot?: OrderProductPivot
  // orders: Order[]
  shop?: any;
  description?: string;
  in_stock?: boolean;
  is_taxable?: boolean;
  sale_price?: number;
  sku?: string;
  gallery?: Attachment[];
  image?: Attachment;
  // status?: ProductStatus
  height?: string;
  length?: string;
  width?: string;
  price?: number;
  min_price?: number;
  max_price?: number;
  related_products?: Product[];
  quantity?: number;
  unit?: string;
  product_type: string;
  created_at?: Date;
  updated_at?: Date;
  orders_count?: number;
  sold: number;
  language?: string;
  ratings?: number;
};

export declare type Tag = {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  details?: string;
};

export declare type UserAddress = {
  country?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export declare type Order = {
  id: number | string;
  tracking_number: string;
  customer_id: number | string;
  customer_name: string;
  customer_contact: string;
  customer?: User;
  status: any;
  amount: number;
  children: Order[];
  sales_tax: number;
  total: number;
  paid_total: number;
  payment_id?: string;
  payment_gateway?: string;
  coupon?: Coupon;
  discount?: number;
  delivery_fee?: number;
  delivery_time: string;
  products: Product[];
  created_at: Date;
  updated_at: Date;
  billing_address?: UserAddress;
  shipping_address?: UserAddress;
  payment_intent?: PaymentIntent;
  payment_status?: string;
  order_status?: string;
};
export interface TermsAndConditionsQueryOptions extends QueryOptions {
  title: string;
  issued_by: string;
  type: string;
  orderBy: string;
  sortedBy: string;
  shop_id: string;
  is_approved: boolean;
  config: any;
}
export interface TermsAndConditions {
  id: string;
  translated_languages: string[];
  title: string;
  description: string;
  shop_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  is_approved?: boolean;
  issued_by?: string;
  type?: string;
  shop?: Shop;
}

export interface PaymentIntent {
  id: number | string;
  order_id: number | string;
  payment_gateway: PaymentGateway;
  tracking_number: string;
  payment_intent_info: PaymentIntentInfo;
}

export type SettingsType = {
  id: number | string;
  options: SettingsOptions;
};

export type SettingsOptions = {
  siteTitle?: string;
  siteSubtitle?: string;
  currency?: string;
  logo?: Attachment;
  taxClass?: string;
  shippingClass?: string;
  enableCoupons?: boolean;
  contactDetails?: any;
  paymentGateway?: any;
  defaultPaymentGateway: string;
  isMultiCommissionRate: boolean;
};

export interface Card {
  expires: string;
  network: string;
  origin: string;
  owner_name: string;
  payment_gateway_id: number | string;
  default_card: number;
}

export interface PaymentIntentInfo {
  client_secret: string;
  payment_id: string;
  is_redirect: boolean;
  redirect_url: string;
  currency: string;
  amount: string;
}

export interface CreateOrderPaymentInput {
  tracking_number: string;
  payment_gateway: string;
}

export interface PaymentIntentCollection {
  tracking_number?: string;
  payment_intent_info?: PaymentIntentInfo;
  payment_gateway?: string;
}
export interface UserPaymentGateway {
  id: number | string;
  customer_id: string;
  gateway_name: PaymentGateway;
  user_id: number | string;
}

export type Shop = {
  [key: string]: any;
};

export type Address = {
  [key: string]: any;
};

export type Social = {
  url: string;
  icon: string;
  label: string;
};

export type Instagram = {
  id: string;
  media_url: string;
  media_type: string;
  permalink: string;
  caption: string;
};

export type StaticBanner = {
  id: number;
  title: string;
  slug: string;
  image: {
    mobile: StaticBannerImage;
    desktop: StaticBannerImage;
  };
};

export type StaticBannerImage = {
  url: string;
  width: number;
  height: number;
};

export type CollectionBanner = {
  id: number;
  slug: string;
  image: string;
  title: string;
  description?: string;
};

export type FeatureBanner = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

export type PaginatedTypes = {
  data: Type[];
  paginatorInfo: any;
};

export interface PaginatorInfo<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
  paginatorInfo?: any;
}

export type LoginInputType = {
  email: string;
  password: string;
};
export type RegisterUserInputType = {
  name: string;
  email: string;
  password: string;
};

export type ChangePasswordInputType = {
  oldPassword: string;
  newPassword: string;
};
export type ForgetPasswordInputType = {
  email: string;
};
export type ResetPasswordInputType = {
  email: string;
  token: string;
  password: string;
};
export type VerifyPasswordInputType = {
  email: string;
  token: string;
};
export type SocialLoginInputType = {
  provider: string;
  access_token: string;
};
export type SendOtpCodeInputType = {
  phone_number: string;
};
export type VerifyOtpInputType = {
  phone_number: string;
  code: string;
  otp_id: string;
};
export type OtpLoginInputType = {
  phone_number: string;
  code: string;
  otp_id: string;
  name?: string;
  email?: string;
};
export type UpdateContactInput = {
  phone_number: string;
  code: string;
  otp_id: string;
  user_id: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  wallet: {
    total_points: number;
    points_used: number;
    available_points: number;
  };
  profile: {
    id?: string;
    contact?: string;
    bio?: string;
    avatar?: Attachment;
  };
  address: Address[];
}

export type VerifyCheckoutInputType = {
  amount: number;
  products: any[];
  billing_address: any;
  shipping_address: any;
};

export type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  description: string;
};

export type VerifyCouponInputType = {
  code: string;
  sub_total: number;
  item: Item[];
};

export type CustomerType = {
  id: string;
  [key: string]: unknown;
};
export type ContactType = {
  name: string;
  email: string;
  subject: string;
  description: string;
};

export type OrderCreateInputType = {
  [key: string]: unknown;
};

export type SettingsResponse = {
  id: string;
  name: string;
  slug: string;
  options: {
    [key: string]: any;
  };
};
export interface Success {
  success: boolean;
  message: string;
}
export interface VerificationEmailUserInput extends Success {
  email: string;
}

export enum PhoneNumberStatus {
  NUMBER = 'PhoneNumber',
}

export enum PaymentGateway {
  STRIPE = 'STRIPE',
  COD = 'CASH_ON_DELIVERY',
  PAYPAL = 'PAYPAL',
  MOLLIE = 'MOLLIE',
  RAZORPAY = 'RAZORPAY',
  PAYSTACK = 'PAYSTACK',
  IYZICO = 'IYZICO',
}

export enum PaymentStatus {
  PENDING = 'payment-pending',
  PROCESSING = 'payment-processing',
  SUCCESS = 'payment-success',
  FAILED = 'payment-failed',
  REVERSAL = 'payment-reversal',
  COD = 'cash-on-delivery',
  AWAITING_FOR_APPROVAL = 'payment-awaiting-for-approval',
}

export enum OrderStatus {
  PENDING = 'order-pending',
  PROCESSING = 'order-processing',
  COMPLETED = 'order-completed',
  CANCELLED = 'order-cancelled',
  REFUNDED = 'order-refunded',
  FAILED = 'order-failed',
  AT_LOCAL_FACILITY = 'order-at-local-facility',
  OUT_FOR_DELIVERY = 'order-out-for-delivery',
}

export type NumberOrString = number | string;

export type PaginatedOrder = {
  data: Order[];
  paginatorInfo: any;
};

export interface GoogleMapLocation {
  lat?: number | string;
  lng?: number | string;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
  formatted_address?: string;
}

export interface Wishlist {
  id: string;
  product: Product;
  product_id: string;
  user: User[];
  user_id: string;
}

export interface SettingsQueryOptions extends QueryOptions {}
export interface AttributeQueryOptions extends QueryOptions {}
export interface WishlistQueryOptions extends QueryOptions {
  sortedBy?: string;
  orderBy?: string;
}

export interface CouponQueryOptions extends QueryOptions {
  name: string;
  orderBy: string;
  code: string;
  shop_id: string;
}

export interface VerifyCouponResponse {
  is_valid: boolean;
  coupon?: Coupon;
  message?: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  translated_languages: string[];
  orders: Order[];
  type: string;
  image: Attachment;
  amount: number;
  active_from: string;
  expire_at: string;
  created_at: string;
  updated_at: string;
  target?: boolean;
  shop_id?: string;
  is_approve?: boolean;
  is_valid?: boolean;
}

export interface TypePaginator extends PaginatorInfo<Type> {}
export interface CategoryPaginator extends PaginatorInfo<Category> {}
export interface CouponPaginator extends PaginatorInfo<Coupon> {}
export interface OrderPaginator extends PaginatorInfo<Order> {}
export interface ProductPaginator extends PaginatorInfo<Product> {}
export interface ShopPaginator extends PaginatorInfo<Shop> {}
export interface TagPaginator extends PaginatorInfo<Tag> {}
export interface WishlistPaginator extends PaginatorInfo<Wishlist> {}
export interface TermsAndConditionsPaginator
  extends PaginatorInfo<TermsAndConditions> {}

export interface FAQS {
  id: string;
  faq_title: string;
  faq_description: string;
  slug: string;
  faq_type: string;
  issued_by: string;
  language: string;
  shop_id?: Shop;
  user_id: User;
  translated_languages: string[];
  created_at: string;
  updated_at: string;
}

export interface FaqsPaginator extends PaginatorInfo<FAQS> {}

export interface FaqsQueryOptions extends QueryOptions {
  faq_title?: string;
  issued_by?: string;
  faq_type?: string;
  orderBy?: string;
  sortedBy?: string;
  shop_id?: string;
}

export interface OrderQueryOptions extends QueryOptions {
  name?: string;
  orderBy: string;
}

export interface DigitalFile {
  id: string;
  fileable: Product;
}
export interface DownloadableFile {
  id: string;
  purchase_key: string;
  digital_file_id: string;
  customer_id: string;
  file: DigitalFile;
  created_at: string;
  updated_at: string;
}
export interface DownloadableFilePaginator
  extends PaginatorInfo<DownloadableFile> {}

export interface UpdateEmailUserInput {
  email: string;
}

export interface EmailChangeResponse extends Success {}

export interface UpdateUserInput extends Partial<User> {
  id: string;
}

export interface CreateContactUsInput {
  name: string;
  email: string;
  subject: string;
  description: string;
}

export interface ShopMaintenanceEvent {
  shop_id: string;
  isMaintenance: boolean;
  isShopUnderMaintenance: boolean;
}

export interface BecomeSeller {
  commission: BecomeSellerCommission[];
  page_options: {
    page_options: BecomeSellerPageOptions;
  };
}

export interface BecomeSellerCommission {
  commission: number;
  description: string;
  image: Attachment;
  level: string;
  max_balance: string;
  min_balance: number;
  sub_level: string;
}

export interface BecomeSellerPageOptions {
  banner: BecomeSellerBanner;
  commissionDescription: string;
  commissionTitle: string;
  defaultCommissionDetails: string;
  defaultCommissionRate: number;
  faqDescription: string;
  faqTitle: string;
  isMultiCommissionRate: boolean;
  faqItems: {
    description: string;
    title: string;
  }[];
  purposeDescription: string;
  purposeItems: BusinessPurpose[];
  purposeTitle: string;
  sellingStepsDescription: string;
  sellingStepsItem: SellingStep[];
  sellingStepsTitle: string;
  dashboard: BecomeSellerDashboardShowcase;
  guidelineTitle: string;
  guidelineDescription: string;
  guidelineItems: {
    title: string;
    link?: string;
  }[];
  sellerOpportunity: BecomeSellerDashboardShowcase;
  userStoryTitle: string;
  userStoryDescription?: string;
  userStories: {
    title: string;
    description: string;
    link: string;
    thumbnail?: Attachment;
  }[];
  contact: {
    title: string;
    description: string;
  };
}
export interface BusinessPurpose {
  description: string;
  title: string;
  icon: {
    value: string;
  };
}
export interface BecomeSellerBanner {
  description: string;
  image: Attachment;
  newsTickerTitle: string;
  newsTickerURL: string;
  title: string;
  button1Name?: string;
  button1Link?: string;
  button2Name?: string;
  button2Link?: string;
}
export interface SellingStep {
  title: string;
  description: string;
  image: Attachment;
}
export interface BecomeSellerDashboardShowcase {
  title: string;
  description: string;
  image: Attachment;
  buttonName?: string;
  buttonLink?: string;
  button2Name?: string;
  button2Link?: string;
}

export interface Commission {
  commission: number;
  created_at?: Date;
  description: string;
  id?: number;
  image?: Attachment;
  language?: string;
  level?: string;
  max_balance?: string | number;
  min_balance?: string | number;
  sub_level?: string;
  updated_at?: Date;
}
export type AlertProps = {
  message: string | null;
  variant?:
    | 'info'
    | 'warning'
    | 'error'
    | 'success'
    | 'infoOutline'
    | 'warningOutline'
    | 'errorOutline'
    | 'successOutline';
  closeable?: boolean;
  onClose?: React.Dispatch<React.SetStateAction<any>>;
  className?: string;
  children?: React.ReactNode;
  childClassName?: string;
};