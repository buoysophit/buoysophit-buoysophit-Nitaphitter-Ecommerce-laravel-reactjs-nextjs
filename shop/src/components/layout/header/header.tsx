import SearchIcon from '@components/icons/search-icon';
import HeaderMenu from '@components/layout/header/header-menu';
import Alert from '@components/ui/alert';
import CountdownTimer from '@components/ui/countdown-timer';
import LanguageSwitcher from '@components/ui/language-switcher';
import Logo from '@components/ui/logo';
import { useSettings } from '@contexts/settings.context';
import { useUI } from '@contexts/ui.context';
import { menu } from '@data/static/menus';
import { useShop, useShopMaintenanceEvent } from '@framework/shops';
import {
  RESPONSIVE_WIDTH,
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
  checkIsScrollingStart,
  checkIsShopMaintenanceModeComing,
  checkIsShopMaintenanceModeStart,
  isMultiLangEnable,
} from '@lib/constants';
import { addActiveScroll } from '@utils/add-active-scroll';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'react-use';
const CartButton = dynamic(() => import('@components/cart/cart-button'), {
  ssr: false,
});
const LoginButton = dynamic(
  () => import('@components/layout/header/login-button'),
  {
    ssr: false,
  },
);
interface Props {
  variant?: 'default' | 'modern';
}

type DivElementRef = React.MutableRefObject<HTMLDivElement>;
const Header: React.FC<Props> = ({ variant = 'default' }) => {
  const { t } = useTranslation();
  const { openSearch, openSidebar } = useUI();
  const siteHeaderRef = useRef() as DivElementRef;
  addActiveScroll(siteHeaderRef);
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const { data: shopData, isLoading } = useShop({
    slug: slug as string,
    enabled: Boolean(slug),
  });
  const { width } = useWindowSize();
  const handleMobileMenu = useCallback(() => {
    return openSidebar({
      view: 'DISPLAY_MOBILE_MENU',
    });
  }, []);

  const { settings } = useSettings();
  const [underMaintenanceIsComing] = useAtom(checkIsMaintenanceModeComing);
  const [shopUnderMaintenanceIsComing] = useAtom(
    checkIsShopMaintenanceModeComing,
  );

  const { createShopMaintenanceEventRequest } = useShopMaintenanceEvent();
  const [__, setUnderMaintenanceStart] = useAtom(checkIsMaintenanceModeStart);
  const [___, setShopUnderMaintenanceStart] = useAtom(
    checkIsShopMaintenanceModeStart,
  );

  const [isScrolling] = useAtom(checkIsScrollingStart);
  const isAlertMessage =
    (width >= RESPONSIVE_WIDTH &&
      underMaintenanceIsComing &&
      !isScrolling &&
      !shopUnderMaintenanceIsComing) ||
    (width >= RESPONSIVE_WIDTH &&
      !underMaintenanceIsComing &&
      !isScrolling &&
      shopUnderMaintenanceIsComing &&
      !isLoading &&
      shopData);
  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className={classNames("w-full relative z-20", !isAlertMessage? "h-16 sm:h-20 lg:h-24": "custom-height-control")}
    >
      {width >= RESPONSIVE_WIDTH &&
      underMaintenanceIsComing &&
      !isScrolling &&
      !shopUnderMaintenanceIsComing ? (
        <Alert
          message={`Site ${t('text-maintenance-mode-title')}`}
          variant="info"
          className="sticky top-0 left-0 z-50 top-bar-counter"
          childClassName="flex justify-center font-bold items-center w-full gap-4"
        >
          <CountdownTimer
            date={new Date(settings?.maintenance?.start as string)}
            className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
            onComplete={() => setUnderMaintenanceStart(true)}
          />
        </Alert>
      ) : (
        ''
      )}
      {width >= RESPONSIVE_WIDTH &&
      !underMaintenanceIsComing &&
      !isScrolling &&
      shopUnderMaintenanceIsComing &&
      !isLoading &&
      shopData ? (
        <Alert
          message={`${shopData?.name} ${t('text-maintenance-mode-title')}`}
          variant="info"
          className="sticky top-0 left-0 z-50 top-bar-counter"
          childClassName="flex justify-center items-center font-bold w-full gap-4"
        >
          <CountdownTimer
            date={
              new Date(shopData?.settings?.shopMaintenance?.start as string)
            }
            className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
            onComplete={() => {
              setShopUnderMaintenanceStart(true);
              createShopMaintenanceEventRequest({
                shop_id: shopData?.id,
                isMaintenance: true,
                isShopUnderMaintenance: Boolean(
                  shopData?.settings?.isShopUnderMaintenance,
                ),
              });
            }}
          />
        </Alert>
      ) : (
        ''
      )}
      <div className="innerSticky text-gray-700 body-font fixed bg-white w-full h-16 sm:h-20 lg:h-24 z-20 ltr:pl-4 ltr:lg:pl-6 ltr:pr-4 ltr:lg:pr-6 rtl:pr-4 rtl:lg:pr-6 rtl:pl-4 rtl:lg:pl-6 transition duration-200 ease-in-out">
        <div className="flex items-center justify-center mx-auto max-w-[1920px] h-full w-full">
          <button
            aria-label="Menu"
            className={`menuBtn md:flex ${
              variant !== 'modern'
                ? 'hidden lg:hidden px-5 2xl:px-7'
                : 'ltr:pr-7 rtl:pl-7 hidden md:block'
            } flex-col items-center justify-center flex-shrink-0 h-full outline-none focus:outline-none`}
            onClick={handleMobileMenu}
          >
            <span className="menuIcon">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
          </button>
          <Logo />

          {isMultiLangEnable ? (
            <div className="flex-shrink-0 ltr:ml-auto rtl:mr-auto md:hidden flex">
              <LanguageSwitcher />
            </div>
          ) : (
            ''
          )}

          {variant !== 'modern' ? (
            <HeaderMenu
              data={menu}
              className="hidden lg:flex ltr:md:ml-6 ltr:xl:ml-10 rtl:md:mr-6 rtl:xl:mr-10"
            />
          ) : (
            ''
          )}

          <div className="hidden md:flex justify-end items-center space-x-6 lg:space-x-5 xl:space-x-8 2xl:space-x-10 rtl:space-x-reverse ltr:ml-auto rtl:mr-auto flex-shrink-0">
            {isMultiLangEnable ? (
              <div className="ms-auto flex-shrink-0">
                <LanguageSwitcher />
              </div>
            ) : (
              ''
            )}
            <button
              className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
              onClick={openSearch}
              aria-label="search-button"
            >
              <SearchIcon />
            </button>
            {/* <div className="-mt-0.5 flex-shrink-0">
							<AuthMenu
								isAuthorized={isAuthorize}
								href={ROUTES.ACCOUNT}
								className="text-sm xl:text-base text-heading font-semibold"
								btnProps={{
									className:
										"text-sm xl:text-base text-heading font-semibold focus:outline-none",
									children: t("text-sign-in"),
									onClick: handleLogin,
								}}
							>
								{t("text-page-my-account")}
							</AuthMenu>
						</div> */}

            <CartButton />
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
