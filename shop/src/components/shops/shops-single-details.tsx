import Container from '@components/ui/container';
import Text from '@components/ui/text';
import { useUI } from '@contexts/ui.context';
import { useShopMaintenanceEvent } from '@framework/shops';
import {
  checkIsShopMaintenanceModeComing,
  checkIsShopMaintenanceModeStart,
} from '@lib/constants';
import { productPlaceholder } from '@lib/placeholders';
import { data } from '@type/index';
import { eachMinuteOfInterval, isBefore } from 'date-fns';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import StickyBox from 'react-sticky-box';
import ShopSidebar from './shop-sidebar';
import dynamic from 'next/dynamic';
import CountdownTimer from '@components/ui/countdown-timer/maintenance';
import { useWindowSize } from 'react-use';

const CartCounterButton = dynamic(
  () => import('@components/card/cart-counter-button'),
  { ssr: false },
);

type Props = {
  data: data;
  children: React.ReactNode;
};

const ShopsSingleDetails: React.FC<Props> = ({ data, children }) => {
  const { t } = useTranslation();
  const { openSidebar } = useUI();

  const { locale, query, asPath } = useRouter();
  const handleSidebar = useCallback((view: string) => {
    return openSidebar({
      view,
      data,
    });
  }, []);

  const { createShopMaintenanceEventRequest } = useShopMaintenanceEvent();

  const [_, setUnderMaintenanceIsComing] = useAtom(
    checkIsShopMaintenanceModeComing,
  );
  const [underMaintenanceStart, setUnderMaintenanceStart] = useAtom(
    checkIsShopMaintenanceModeStart,
  );

  const isGerman = locale === 'de';
  const isBook = asPath.includes('/book');

  const { width } = useWindowSize();
  // Use useMemo to avoid recomputing the date interval on every render

  const dateInterVal = useMemo(() => {
    if (
      data?.settings?.shopMaintenance?.start &&
      data?.settings?.shopMaintenance?.until &&
      data?.settings?.isShopUnderMaintenance
    ) {
      return eachMinuteOfInterval({
        start: new Date(data?.settings?.shopMaintenance?.start),
        end: new Date(data?.settings?.shopMaintenance?.until),
      });
    }
    return [];
  }, [
    data?.settings?.shopMaintenance?.start,
    data?.settings?.shopMaintenance?.until,
    data?.settings?.isShopUnderMaintenance,
  ]);

  // Use useCallback to avoid creating new functions on every render
  const handleMaintenanceCheck = useCallback(() => {
    if (dateInterVal?.length > 0 && query?.slug) {
      const beforeDay = isBefore(
        new Date(),
        new Date(data?.settings?.shopMaintenance?.start as string),
      );
      // Calculate maintenance start time
      const maintenanceStartTime = new Date(
        data?.settings?.shopMaintenance?.start as string,
      );
      const maintenanceEndTime = new Date(
        data?.settings?.shopMaintenance?.until as string,
      );
      maintenanceStartTime.setMinutes(maintenanceStartTime.getMinutes());
      // Check if the current time has passed the maintenance start time
      const currentTime = new Date();
      const checkIsMaintenanceStart =
        currentTime >= maintenanceStartTime &&
        currentTime < maintenanceEndTime &&
        data?.settings?.isShopUnderMaintenance;
      const checkIsMaintenance =
        beforeDay && data?.settings?.isShopUnderMaintenance;
      setUnderMaintenanceStart(checkIsMaintenanceStart as boolean);
      setUnderMaintenanceIsComing(checkIsMaintenance as boolean);
    }
  }, [
    dateInterVal,
    data?.settings?.isShopUnderMaintenance,
    data?.settings?.shopMaintenance?.start,
    data?.settings?.shopMaintenance?.until,
  ]);
  useEffect(() => {
    handleMaintenanceCheck();
  }, [handleMaintenanceCheck]);

  return (
    <>
      <div className="flex items-center px-8 py-4 mb-4 border-b border-gray-300 lg:hidden">
        <div className="flex flex-shrink-0">
          <Image
            src={data?.logo?.original! ?? productPlaceholder}
            alt={data?.name}
            width={62}
            height={62}
            className="rounded-md"
          />
        </div>
        <div className="ltr:pl-4 rtl:pr-4">
          <Text variant="heading">{data?.name}</Text>
          <button
            className="text-sm font-semibold transition-all text-heading opacity-80 hover:opacity-100"
            onClick={() => handleSidebar('DISPLAY_data_SINGLE_SIDE_BAR')}
          >
            {t('text-more-info')}
          </button>
        </div>
      </div>
      <Container>
        <div className="flex flex-col pb-16 lg:flex-row lg:pt-7 lg:pb-20">
          <div className="flex-shrink-0 hidden lg:block lg:w-80 xl:w-96">
            <StickyBox offsetTop={50} offsetBottom={20}>
              <ShopSidebar
                data={data}
                className="w-full border border-gray-300 rounded-lg"
              />
            </StickyBox>
          </div>

          <div className="w-full ltr:lg:pl-7 rtl:lg:pr-7">
            {data?.cover_image?.original && (
              <div className="flex mb-4 lg:mb-7">
                <Image
                  src={data?.cover_image?.original!}
                  alt={data?.name}
                  width={2760}
                  height={1020}
                  className="bg-gray-300 rounded-xl"
                />
              </div>
            )}

            {!underMaintenanceStart ? (
              <>{children}</>
            ) : (
              <>
                <div className="p-12 mt-8 bg-[#040014] relative rounded flex">
                  <div className="m-auto space-y-8 max-w-2xl w-full text-center relative z-20 text-white">
                    <div className="uppercase">
                      <CountdownTimer
                        date={
                          new Date(
                            data?.settings?.shopMaintenance?.start
                              ? (data?.settings?.shopMaintenance
                                  ?.until as string)
                              : (data?.settings?.shopMaintenance
                                  ?.start as string),
                          )
                        }
                        onComplete={() =>
                          createShopMaintenanceEventRequest({
                            shop_id: data?.id,
                            isMaintenance: false,
                            isShopUnderMaintenance: Boolean(
                              data?.settings?.isShopUnderMaintenance,
                            ),
                          })
                        }
                      />
                    </div>
                    {data?.settings?.shopMaintenance?.title ? (
                      <h1 className="text-xl font-bold lg:mb-8 lg:text-5xl">
                        {data?.settings?.shopMaintenance?.title}
                      </h1>
                    ) : (
                      ''
                    )}
                    {data?.settings?.shopMaintenance?.description ? (
                      <p className="text-base leading-8 lg:text-lg">
                        {data?.settings?.shopMaintenance?.description}
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                  {data?.settings?.shopMaintenance?.image &&
                  data?.settings?.shopMaintenance?.image?.original ? (
                    <div className="absolute top-0 left-0 z-10 h-full w-full bg-no-repeat">
                      <Image
                        src={data?.settings?.shopMaintenance?.image?.original}
                        alt="maintenance image"
                        fill
                        className="object-contain object-bottom"
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default ShopsSingleDetails;
