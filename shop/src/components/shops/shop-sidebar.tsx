import Image from 'next/image';
import Text from '@components/ui/text';
import * as socialIcons from '@components/icons/social';
import { formatAddress } from '@lib/format-address';
import { getIcon } from '@lib/get-icon';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import { productPlaceholder } from '@lib/placeholders';
import ReadMore from '@components/ui/truncate';
import Link from '@components/ui/link';
import { useSettings } from '@framework/settings';
import { ROUTES } from '@lib/routes';
import { Shop } from '@type/index';
import dayjs from 'dayjs';
import { ShopFaqIcon } from '@components/icons/shop/faq';
import { ShopWebIcon } from '@components/icons/shop/web';
import { ShopContactIcon } from '@components/icons/shop/contact';
import { ShopTermsIcon } from '@components/icons/shop/terms';
import { ShopCouponIcon } from '@components/icons/shop/coupon';
import { ShopHomeIcon } from '@components/icons/shop/home';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import classNames from 'classnames';

interface ShopSidebarProps {
  data: Shop;
  className?: string;
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({ data, className }) => {
  const { t } = useTranslation();
  const { asPath } = useRouter();

  const { data: settingsData } = useSettings();

  const isTermsEnabled = useMemo(() => {
    return settingsData?.options?.enableTerms ?? false;
  }, [settingsData?.options?.enableTerms]);

  const isCouponsEnabled = useMemo(() => {
    return settingsData?.options?.enableCoupons ?? false;
  }, [settingsData?.options?.enableCoupons]);

  return (
    <div className={cn('flex flex-col pt-10 lg:pt-14 px-6', className)}>
      <div className="w-full pb-8 border-b border-gray-300">
        <div className="flex items-center justify-start mb-4">
          <div className="flex items-center justify-center w-24 h-24 border border-gray-300 rounded-full shrink-0">
            <div className="relative w-[calc(100%-8px)] h-[calc(100%-8px)] overflow-hidden bg-gray-300 rounded-full">
              <Image
                alt={data?.name}
                src={data?.logo?.original! ?? productPlaceholder}
                fill
                sizes="(max-width: 768px) 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="ltr:pl-2.5 rtl:pr-2.5 ">
            <div className="text-sm text-gray-400">
              {t('text-since')} {dayjs(data?.created_at).format('YYYY')}
            </div>
            <h3 className="mb-2 overflow-hidden text-lg font-semibold truncate text-heading">
              {data?.name}
            </h3>

            <div className="flex flex-wrap text-sm rounded gap-x-4">
              <div className="flex justify-center gap-1.5 text-gray-800">
                <div className="font-medium text-heading">
                  {data?.products_count}
                </div>
                {t('text-products')}
              </div>
            </div>
          </div>
        </div>

        {data?.description && (
          <Text>
            <ReadMore character={70}>{data?.description}</ReadMore>
          </Text>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(70px,1fr))] text-sm gap-1.5 py-6">
        <Link
          className={classNames(
            'flex flex-col items-center justify-center p-2 pt-3.5 pb-3 text-gray-600 rounded group hover:text-heading hover:bg-heading/10 transition-all',
            asPath === `${ROUTES.SHOP_URL(data?.slug)}`
              ? 'bg-gray-100'
              : 'bg-gray-200',
          )}
          href={`${ROUTES.SHOP_URL(data?.slug)}`}
        >
          <ShopHomeIcon className="w-7 h-7" />
          <span className="pt-2 text-sm">{t('text-shop')}</span>
        </Link>

        {isCouponsEnabled ? (
          <Link
            className={classNames(
              'flex flex-col items-center justify-center p-2 pt-3.5 pb-3 text-gray-600 rounded group hover:text-heading hover:bg-heading/10 transition-all',
              asPath === `${ROUTES.SHOP_URL(data?.slug)}/offers`
                ? 'bg-gray-100'
                : 'bg-gray-200',
            )}
            href={`${ROUTES.SHOP_URL(data?.slug)}/offers`}
          >
            <ShopCouponIcon className="w-7 h-7" />
            <span className="pt-2 text-sm">{t('menu:menu-offers')}</span>
          </Link>
        ) : (
          ''
        )}

        <Link
          href={`${ROUTES.SHOP_URL(data?.slug)}/contact-us`}
          className={classNames(
            'flex flex-col items-center justify-center p-2 pt-3.5 pb-3 text-gray-600 rounded group hover:text-heading hover:bg-heading/10 transition-all',
            asPath === `${ROUTES.SHOP_URL(data?.slug)}/contact-us`
              ? 'bg-gray-100'
              : 'bg-gray-200',
          )}
        >
          <ShopContactIcon className="w-6 h-6" />
          <span className="pt-2 text-sm">{t('text-contact')}</span>
        </Link>
        {data?.settings?.website ? (
          <a
            href={data?.settings?.website}
            target="_blank"
            className={classNames(
              'flex flex-col items-center justify-center p-2 pt-3.5 pb-3 text-gray-600 bg-gray-200 rounded group hover:text-heading hover:bg-heading/10 transition-all',
            )}
            rel="noreferrer"
          >
            <ShopWebIcon className="w-6 h-6" />
            <span className="pt-2 text-sm"> {t('text-website')}</span>
          </a>
        ) : (
          ''
        )}

        {isTermsEnabled ? (
          <Link
            href={`${ROUTES.SHOP_URL(data?.slug)}/terms`}
            className={classNames(
              'flex flex-col items-center justify-center p-2 pt-3.5 pb-3 text-gray-600 rounded group hover:text-heading hover:bg-heading/10 transition-all',
              asPath === `${ROUTES.SHOP_URL(data?.slug)}/terms`
                ? 'bg-gray-100'
                : 'bg-gray-200',
            )}
          >
            <ShopTermsIcon className="w-[26px] h-[26px]" />
            <span className="pt-2 text-sm capitalize">{t('text-terms')}</span>
          </Link>
        ) : (
          ''
        )}

        <Link
          href={`${ROUTES.SHOP_URL(data?.slug)}/faq`}
          className={classNames(
            'flex flex-col items-center justify-center p-2 pt-3.5 pb-3 text-gray-600 rounded group hover:text-heading hover:bg-heading/10 transition-all',
            asPath === `${ROUTES.SHOP_URL(data?.slug)}/faq`
              ? 'bg-gray-100'
              : 'bg-gray-200',
          )}
        >
          <ShopFaqIcon className="w-7 h-7" />
          <span className="pt-2 text-sm">{t('menu:menu-faq')}</span>
        </Link>
      </div>

      <div className="py-6 border-t border-gray-300">
        <div className="flex flex-col mb-5 last:mb-0">
          <span className="mb-1.5 text-sm font-semibold text-heading">
            {t('text-address')}
          </span>
          <p className="text-sm text-body">
            {!isEmpty(formatAddress(data?.address))
              ? formatAddress(data?.address)
              : t('common:text-no-address')}
          </p>
        </div>
        {data?.settings?.contact ? (
          <div className="flex flex-col mb-5 last:mb-0">
            <span className="mb-1.5 text-sm font-semibold text-heading">
              {t('text-phone')}
            </span>
            <p className="text-sm text-body">
              {data?.settings?.contact
                ? data?.settings?.contact
                : t('text-no-contact')}
            </p>
          </div>
        ) : (
          ''
        )}

        {!isEmpty(data?.settings?.socials) ? (
          <div className="flex flex-col mb-5 last:mb-0">
            <span className="mb-2 text-sm font-semibold text-heading">
              {t('text-follow-us')}
            </span>
            <div className="flex items-center justify-start">
              {data?.settings?.socials?.map((item: any, index: number) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  className={`text-muted transition-colors duration-300 focus:outline-none ltr:mr-3.5 ltr:last:mr-0 rtl:ml-3.5 rtl:last:ml-0 hover:${item.hoverClass}`}
                  rel="noreferrer"
                >
                  {getIcon({
                    iconList: socialIcons,
                    iconName: item.icon,
                    className: 'transition-all hover:opacity-90 w-6 h-6',
                  })}
                </a>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ShopSidebar;
