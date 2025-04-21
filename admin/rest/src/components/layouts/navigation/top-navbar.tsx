import { SearchIcon } from '@/components/icons/search-icon';
import LanguageSwitcher from '@/components/layouts/navigation/language-switcher';
import MessageBar from '@/components/layouts/topbar/message-bar';
import RecentOrderBar from '@/components/layouts/topbar/recent-order-bar';
import SearchBar from '@/components/layouts/topbar/search-bar';
import StoreNoticeBar from '@/components/layouts/topbar/store-notice-bar';
import VisitStore from '@/components/layouts/topbar/visit-store';
import Alert from '@/components/ui/alert';
import CountdownTimer from '@/components/ui/countdown-timer';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import Logo from '@/components/ui/logo';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useUI } from '@/contexts/ui.context';
import { useSettingsQuery } from '@/data/settings';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import {
  RESPONSIVE_WIDTH,
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
  miniSidebarInitialValue,
  searchModalInitialValues,
} from '@/utils/constants';
import cn from 'classnames';
import { isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import AuthorizedMenu from './authorized-menu';

export const isInArray = (array: Date[], value: Date) => {
  return !!array?.find((item) => {
    return item?.getDate() == value?.getDate();
  });
};

const Navbar = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useUI();
  const { permissions } = getAuthCredentials();
  const { enableMultiLang } = Config;
  const { locale, query } = useRouter();
  const { data } = useMeQuery();
  const { openModal } = useModalAction();
  const [searchModal, setSearchModal] = useAtom(searchModalInitialValues);
  const [miniSidebar, setMiniSidebar] = useAtom(miniSidebarInitialValue);
  const [isMaintenanceMode, setUnderMaintenance] = useAtom(
    checkIsMaintenanceModeComing,
  );
  const [isMaintenanceModeStart, setUnderMaintenanceStart] = useAtom(
    checkIsMaintenanceModeStart,
  );
  const { width } = useWindowSize();
  const { settings, loading } = useSettingsQuery({ language: locale! });

  const {
    data: shop,
    isLoading: shopLoading,
    error,
  } = useShopQuery(
    {
      slug: query?.shop as string,
    },
    { enabled: Boolean(query?.shop) },
  );

  useEffect(() => {
    if (
      settings?.options?.maintenance?.start &&
      settings?.options?.maintenance?.until &&
      settings?.options?.isUnderMaintenance
    ) {
      const beforeDay = isBefore(
        new Date(),
        new Date(settings?.options?.maintenance?.start as string),
      );
      // Calculate maintenance start time
      const maintenanceStartTime = new Date(
        settings?.options?.maintenance?.start as string,
      );
      const maintenanceEndTime = new Date(
        settings?.options?.maintenance?.until as string,
      );
      maintenanceStartTime.setMinutes(maintenanceStartTime.getMinutes());

      // Check if the current time has passed the maintenance start time
      const currentTime = new Date();
      const checkIsMaintenanceStart =
        currentTime >= maintenanceStartTime &&
        currentTime < maintenanceEndTime &&
        settings?.options?.isUnderMaintenance;
      const checkIsMaintenance =
        beforeDay && settings?.options?.isUnderMaintenance;
      setUnderMaintenance(checkIsMaintenance as boolean);
      setUnderMaintenanceStart(checkIsMaintenanceStart as boolean);
    }
  }, [
    settings?.options?.maintenance?.start,
    settings?.options?.maintenance?.until,
    settings?.options?.isUnderMaintenance,
  ]);

  useEffect(() => {
    if (
      query?.shop &&
      shop?.settings?.shopMaintenance?.start &&
      shop?.settings?.shopMaintenance?.until &&
      shop?.settings?.isShopUnderMaintenance
    ) {
      const beforeDay = isBefore(
        new Date(),
        new Date(shop?.settings?.shopMaintenance?.start as Date),
      );
      // Calculate maintenance start time
      const maintenanceStartTime = new Date(
        shop?.settings?.shopMaintenance?.start as Date,
      );
      const maintenanceEndTime = new Date(
        shop?.settings?.shopMaintenance?.until as Date,
      );
      maintenanceStartTime.setMinutes(maintenanceStartTime.getMinutes());

      // Check if the current time has passed the maintenance start time
      const currentTime = new Date();
      const checkIsMaintenanceStart =
        currentTime >= maintenanceStartTime &&
        currentTime < maintenanceEndTime &&
        shop?.settings?.isShopUnderMaintenance;
      const checkIsMaintenance =
        beforeDay && shop?.settings?.isShopUnderMaintenance;
      setUnderMaintenance(checkIsMaintenance as boolean);
      setUnderMaintenanceStart(checkIsMaintenanceStart as boolean);
    }
  }, [
    query?.shop,
    shop?.settings?.shopMaintenance?.start,
    shop?.settings?.shopMaintenance?.until,
    shop?.settings?.isShopUnderMaintenance,
  ]);

  if (loading || shopLoading) {
    return <Loader showText={false} />;
  }

  const { options } = settings!;

  function handleClick() {
    openModal('SEARCH_VIEW');
    setSearchModal(true);
  }

  return (
    <header className="fixed top-0 z-40 w-full bg-white shadow">
      {width >= RESPONSIVE_WIDTH && isMaintenanceMode ? (
        <Alert
          message={
            (settings?.options?.isUnderMaintenance &&
              `Site ${t('text-maintenance-mode-title')}`) ||
            (shop?.settings?.isShopUnderMaintenance &&
              `${shop?.name} ${t('text-maintenance-mode-title')}`)
          }
          variant="info"
          className="sticky top-0 left-0 z-50"
          childClassName="flex justify-center items-center w-full gap-4 font-bold"
        >
          <CountdownTimer
            date={
              (settings?.options?.isUnderMaintenance &&
                new Date(options?.maintenance?.start)) ||
              (shop?.settings?.isShopUnderMaintenance &&
                new Date(shop?.settings?.shopMaintenance?.start as Date))
            }
            className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
          />
        </Alert>
      ) : (
        ''
      )}
      {width >= RESPONSIVE_WIDTH && isMaintenanceModeStart ? (
        <Alert
          message={t('text-maintenance-mode-start-title')}
          className="py-[1.375rem]"
          childClassName="text-center w-full font-bold"
        />
      ) : (
        ''
      )}
      <nav className="flex items-center px-5 md:px-8">
        <div className="relative flex w-full flex-1 items-center">
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={toggleSidebar}
              className="group flex h-5 w-5 shrink-0 cursor-pointer flex-col justify-center space-y-1 me-4 focus:text-accent focus:outline-none lg:hidden"
            >
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-2/4',
                )}
              />
              <span className="h-0.5 w-full rounded-full bg-gray-600 group-hover:bg-accent" />
              <span className="h-0.5 w-3/4 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent" />
            </motion.button>
            <div
              className={cn(
                'flex h-16 shrink-0 transition-[width] duration-300 me-4 lg:h-[76px] lg:border-solid lg:border-gray-200/80 lg:me-8 lg:border-e',
                miniSidebar ? 'lg:w-[65px]' : 'lg:w-[257px]',
              )}
            >
              <Logo />
            </div>
            <button
              className="group hidden h-5 w-5 shrink-0 cursor-pointer flex-col justify-center space-y-1 me-6 lg:flex"
              onClick={() => setMiniSidebar(!miniSidebar)}
            >
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-2/4',
                )}
              />
              <span className="h-0.5 w-full rounded-full bg-gray-600 group-hover:bg-accent" />
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-3/4',
                )}
              />
            </button>
          </div>
          <div
            className="relative ml-auto mr-1.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-50 py-4 text-gray-600 hover:border-transparent hover:border-gray-200 hover:bg-white hover:text-accent sm:mr-6 lg:hidden xl:hidden"
            onClick={handleClick}
          >
            <SearchIcon className="h-4 w-4" />
          </div>
          <div className="relative hidden w-full max-w-[710px] py-4 me-6 lg:block 2xl:me-auto">
            <SearchBar />
          </div>

          <div className="flex shrink-0 grow-0 basis-auto items-center">
            {hasAccess(adminAndOwnerOnly, permissions) && (
              <>
                <div className="hidden border-gray-200/80 px-6 py-5 border-e 2xl:block">
                  <LinkButton
                    href={Routes.shop.create}
                    size="small"
                    className="px-3.5"
                  >
                    {t('common:text-create-shop')}
                  </LinkButton>
                </div>

                <div className="hidden px-6 py-5 2xl:block">
                  <VisitStore />
                </div>

                {options?.pushNotification?.all?.order ||
                options?.pushNotification?.all?.message ||
                options?.pushNotification?.all?.storeNotice ? (
                  <div className="flex items-center gap-3 px-0.5 py-3 sm:relative sm:border-gray-200/80 sm:py-3.5 sm:px-6 sm:border-s lg:py-5">
                    {options?.pushNotification?.all?.order ? (
                      <RecentOrderBar user={data} />
                    ) : (
                      ''
                    )}

                    {options?.pushNotification?.all?.message ? (
                      <MessageBar user={data} />
                    ) : (
                      ''
                    )}

                    {!hasAccess(adminOnly, permissions) ? (
                      options?.pushNotification?.all?.storeNotice ? (
                        <StoreNoticeBar user={data} />
                      ) : (
                        ''
                      )
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {enableMultiLang ? <LanguageSwitcher /> : null}

          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
