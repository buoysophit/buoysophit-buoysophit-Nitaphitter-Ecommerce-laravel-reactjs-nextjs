import { ILFlag } from "@components/icons/ILFlag";
import { SAFlag } from "@components/icons/SAFlag";
import { CNFlag } from "@components/icons/CNFlag";
import { USFlag } from "@components/icons/USFlag";
import { DEFlag } from "@components/icons/DEFlag";
import { ESFlag } from "@components/icons/ESFlag";
import { ROUTES } from '@lib/routes';
import { CardsIcon } from '@components/icons/my-account/cards';
import { ChangePasswordIcon } from '@components/icons/my-account/change-password';
import { HomeIcon } from '@components/icons/my-account/home';
import { OrdersIcon } from '@components/icons/my-account/orders';
import {
  ProfileIcon,
  ProfileIconNew,
} from '@components/icons/my-account/profile';
import { WishlistIcon } from '@components/icons/my-account/wishlist';
import { DownloadsIcon } from '@components/icons/my-account/downloads';

export const siteSettings = {
  name: 'test',
  description:
    'Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS.',
  author: {
    name: 'rupp',
    websiteUrl: '/',
    address: '',
  },
  logo: {
    url: '/assets/images/logo.svg',
    alt: 'test',
    href: '/',
    width: 95,
    height: 30,
  },
  chatButtonUrl: '/',
  defaultLanguage: 'en',
  currency: 'USD',
  site_header: {
    languageMenu: [
      {
        id: 'ar',
        name: 'عربى - AR',
        value: 'ar',
        icon: <SAFlag width="20px" height="15px" />,
      },
      {
        id: 'zh',
        name: '中国人 - ZH',
        value: 'zh',
        icon: <CNFlag width="20px" height="15px" />,
      },
      {
        id: 'en',
        name: 'English - EN',
        value: 'en',
        icon: <USFlag width="20px" height="15px" />,
      },
      {
        id: 'de',
        name: 'Deutsch - DE',
        value: 'de',
        icon: <DEFlag width="20px" height="15px" />,
      },
      {
        id: 'he',
        name: 'rעברית - HE',
        value: 'he',
        icon: <ILFlag width="20px" height="15px" />,
      },
      {
        id: 'es',
        name: 'Español - ES',
        value: 'es',
        icon: <ESFlag width="20px" height="15px" />,
      },
    ],
  },
  product: {
    placeholderImage: (variant = 'list') => {
      return `/assets/placeholder/products/product-${variant}.svg`;
    },
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
  homePageBlocks: {
    flashSale: {
      slug: 'flash-sale',
    },
    featuredProducts: {
      slug: 'featured-products',
    },
    onSaleSettings: {
      slug: 'on-sale',
    },
  },
  accountMenu: [
    {
      slug: ROUTES.ACCOUNT,
      name: 'text-dashboard',
      icon: <HomeIcon className="text-lg md:text-xl" />,
    },
    {
      slug: ROUTES.ACCOUNT_CONTACT_NUMBER,
      name: 'text-contact-number',
      icon: <ProfileIconNew className="text-lg md:text-xl" />,
    },
    {
      slug: ROUTES.ACCOUNT_ORDERS,
      name: 'text-orders',
      icon: <OrdersIcon className="text-lg md:text-xl" />,
    },
    {
      slug: ROUTES.DOWNLOADS,
      name: 'text-downloads',
      icon: <DownloadsIcon className="text-lg md:text-xl" />,
    },
    {
      slug: ROUTES.WISHLISTS,
      name: 'text-wishlist',
      icon: <WishlistIcon className="text-lg md:text-xl" />,
    },
    {
      slug: ROUTES.ACCOUNT_CARDS,
      name: 'text-cards',
      icon: <CardsIcon className="text-lg md:text-xl" />,
    },
    {
      slug: ROUTES.ACCOUNT_ADDRESS,
      name: 'text-account-address',
      icon: <ProfileIcon className="text-lg md:text-xl" />,
    },
    {
      slug: ROUTES.ACCOUNT_CHANGE_PASSWORD,
      name: 'text-change-password',
      icon: <ChangePasswordIcon className="text-lg md:text-xl" />,
    },
  ],
};