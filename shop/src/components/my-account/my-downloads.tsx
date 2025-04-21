import NotFound from '@components/404/not-found';
import Link from '@components/ui/link';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useGenerateDownloadableUrl } from '@framework/orders';
import { ROUTES } from '@lib/routes';
import { DownloadableFile } from '@type/index';
import { isEmpty } from 'lodash';
import Image from 'next/image';
import { isPaymentPending } from '@lib/is-payment-pending';
import { siteSettings } from '@settings/site.settings';
import dayjs from 'dayjs';
import Button from '@components/ui/button';
import { useTranslation } from 'next-i18next';

type MyDownloadsProps = {
  isLoading: boolean;
  downloads: DownloadableFile[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
};

const MyDownloads: React.FC<MyDownloadsProps> = ({
  isLoading,
  downloads,
  hasMore,
  isLoadingMore,
  loadMore,
}) => {
  const { t } = useTranslation();
  const { generateDownloadableUrl } = useGenerateDownloadableUrl();

  const isVariableProduct = (product: any) =>
    !isEmpty(product?.file?.fileable?.product);

  return (
    <>
      {isLoading ? (
        <Spinner className="!h-auto" showText={false} />
      ) : isEmpty(downloads) ? (
        <NotFound
          text={'No downloadable file found.'}
          className="mx-auto w-full md:w-7/12"
        />
      ) : (
        <>
          <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-3 xl:mb-5">
            {t('text-downloads')}
          </h2>
          {downloads?.map((item: any) => {
            return (
              <div
                key={item.purchase_key}
                className="flex w-full space-x-4 border-b border-gray-200 py-5 first:pt-0 last:border-0 last:pb-0 rtl:space-x-reverse sm:space-x-5"
              >
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
                  <Image
                    src={
                      isVariableProduct(item)
                        ? item?.file?.fileable?.product?.image?.original!
                        : item?.file?.fileable?.image?.original! ??
                          siteSettings?.product?.placeholderImage()
                    }
                    alt="text"
                    layout="fill"
                  />
                </div>

                <div className="flex w-full flex-col items-start sm:flex-row sm:justify-between sm:space-x-4 rtl:sm:space-x-reverse">
                  <div className="flex w-full flex-col space-y-1 sm:items-start">
                    <Link
                      href={`${ROUTES.PRODUCT}/${
                        isVariableProduct(item)
                          ? item?.file?.fileable?.product?.slug
                          : item?.file?.fileable?.slug
                      }`}
                      className="text-base font-semibold text-heading transition-colors hover:text-accent"
                    >
                      {!isVariableProduct(item) && item?.file?.fileable?.name}
                      {isVariableProduct(item) && (
                        <>
                          {item?.file?.fileable?.product?.name}
                          <span className="inline-block text-sm ltr:clear-left ltr:ml-1 rtl:clear-right rtl:mr-1">
                            ({item?.file?.fileable?.title})
                          </span>
                        </>
                      )}
                    </Link>

                    <p className="space-y-1 sm:space-x-1 sm:space-y-0 rtl:sm:space-x-reverse">
                      <span className="block text-sm font-semibold text-body-dark sm:inline-block sm:w-auto">
                        {t('text-key')}: {item?.purchase_key}
                      </span>
                      <span className="hidden text-sm text-body sm:inline-block">
                        |
                      </span>
                      <span className="block text-sm text-body sm:inline-block">
                        {t('text-purchased-on')}{' '}
                        {dayjs(item?.created_at).format('DD.MM.YYYY')}
                      </span>
                    </p>
                  </div>
                  {isPaymentPending(
                    item?.order?.payment_gateway,
                    item?.order?.order_status,
                    item?.order?.payment_status
                  ) ? (
                    <span className="order-2 mt-5 w-full max-w-full shrink-0 basis-full sm:order-1 lg:mt-0 lg:w-auto lg:max-w-none lg:basis-auto lg:ltr:ml-auto lg:rtl:mr-auto">
                      <Button variant="slim">
                        <Link
                          href={`${ROUTES.ORDER_WITH_TRACKING(
                            item?.tracking_number
                          )}/payment`}
                        >
                          {t('text-pay-now')}
                        </Link>
                      </Button>
                    </span>
                  ) : (
                    <Button
                      onClick={() =>
                        generateDownloadableUrl(item?.digital_file_id)
                      }
                      variant="slim"
                    >
                      {t('text-download')}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {hasMore && (
            <div className="mt-8 flex w-full justify-center">
              <Button
                disabled={isLoadingMore}
                loading={isLoadingMore}
                onClick={loadMore}
              >
                {t('text-load-more')}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MyDownloads;
