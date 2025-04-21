import { BellIcon } from '@components/icons/bell-icon';
import { CloseIconNew } from '@components/icons/close-icon';
import { LangIcon } from '@components/icons/lang-icon';
import { LongArrowIcon } from '@components/icons/long-arrow-icon';
import Button from '@components/ui/button';
import CountdownTimer from '@components/ui/countdown-timer/maintenance';
import Logo from '@components/ui/logo';
import { useUI } from '@contexts/ui.context';
import { useSettings } from '@framework/settings';
import { isMultiLangEnable } from '@lib/constants';
import { languageMenu } from '@lib/locals';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const MaintenanceMode = () => {
  const { data: settings } = useSettings();
  const { openModal, setModalView, setModalData, openSidebar } = useUI();
  const { t } = useTranslation('common');
  const [langOnClick, setLangOnClick] = useState<boolean>(false);
  const router = useRouter();
  const { locale, asPath, locales } = router;

  let filterItem = useMemo(() => {
    return languageMenu?.filter((element) => locales?.includes(element?.value));
  }, [languageMenu, locales]);

  const currentSelectedItem = useMemo(() => {
    return locale
      ? filterItem?.find((o) => o?.value === locale)!
      : filterItem[2];
  }, [locale, filterItem]);
  const [selectedItem, setSelectedItem] = useState(currentSelectedItem?.value);

  const openNewsLetterModal = useCallback(() => {
    setModalData({
      title: settings?.options?.maintenance?.newsLetterTitle as string,
      description: settings?.options?.maintenance
        ?.newsLetterDescription as string,
    });
    setModalView('NEWSLETTER_MODAL');
    return openModal();
  }, []);

  const handleItemClick = useCallback((item: string) => {
    Cookies.set('NEXT_LOCALE', item, { expires: 365 });
    setSelectedItem(item);
    router.push(asPath, undefined, {
      locale: item,
    });
  }, []);

  const handleSidebar = useCallback((view: string) => {
    return openSidebar({
      view,
    });
  }, []);

  return (
    <div className="relative w-full bg-[#e6e5eb] text-center lg:h-screen lg:min-h-[43.75rem]">
      <div className="relative z-20 mx-auto max-w-7xl p-8 lg:h-[calc(100%-70px)]">
        <div className="flex items-center justify-center pt-8">
          <Logo />
        </div>
        <div className="relative mt-8 lg:mt-16">
          <div>
            {settings?.options?.maintenance?.title ? (
              <h1 className="mb-4 text-xl font-bold tracking-tight text-black lg:mb-8 lg:text-6xl">
                {settings?.options?.maintenance?.title}
              </h1>
            ) : (
              ''
            )}
            {settings?.options?.maintenance?.description ? (
              <p className="m-0 mx-auto max-w-5xl text-base leading-8 text-black lg:text-lg">
                {settings?.options?.maintenance?.description}
              </p>
            ) : (
              ''
            )}
            <div className="mt-7 lg:mt-14">
              <CountdownTimer
                date={
                  new Date(
                    settings?.options?.maintenance?.start
                      ? (settings?.options?.maintenance?.until as string)
                      : (settings?.options?.maintenance?.start as string),
                  )
                }
              />
            </div>
            {settings?.options?.maintenance?.buttonTitleOne ||
            settings?.options?.maintenance?.buttonTitleTwo ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:mt-16">
                {settings?.options?.maintenance?.buttonTitleOne ? (
                  <Button
                    onClick={openNewsLetterModal}
                    className="notify-button"
                  >
                    {settings?.options?.maintenance?.buttonTitleOne}
                    <span className="notify-button-icon ltr:ml-3 rtl:mr-3">
                      <BellIcon className="text-lg" />
                    </span>
                  </Button>
                ) : (
                  ''
                )}
                {settings?.options?.maintenance?.buttonTitleTwo ? (
                  <Button
                    onClick={() =>
                      handleSidebar('DISPLAY_MAINTENANCE_MORE_INFO')
                    }
                    className="info-button"
                  >
                    {settings?.options?.maintenance?.buttonTitleTwo}
                    <span className="info-button-icon ltr:ml-3 rtl:mr-3 rotate-180 transform rtl:rotate-0">
                      <LongArrowIcon className="text-lg" />
                    </span>
                  </Button>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {settings?.options?.maintenance?.image?.original ? (
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-no-repeat">
          <Image
            src={settings?.options?.maintenance?.image?.original}
            alt="maintenance image"
            fill
            className="object-contain object-bottom"
          />
        </div>
      ) : (
        ''
      )}
      {settings?.options?.maintenance?.isOverlayColor ? (
        <div
          style={{
            backgroundColor: settings?.options?.maintenance
              ?.overlayColor as string,
            opacity: settings?.options?.maintenance
              ?.overlayColorRange as string,
          }}
          className="absolute top-0 left-0 z-10 h-full w-full"
        />
      ) : (
        ''
      )}
      {isMultiLangEnable && !isEmpty(filterItem) ? (
        <div className="fixed bottom-5 right-5 z-50">
          {langOnClick ? (
            <div className="absolute bottom-16 right-1 max-w-md overflow-hidden rounded-2xl bg-white shadow-lg md:bottom-24">
              <div className="bg-[#f0f4f8] px-4 py-5 text-left text-lg font-bold leading-none text-black md:px-8">
                <h3>{t('text-title-change-language')}</h3>
              </div>
              <div className="flex gap-2 px-4 pt-5 pb-2 md:px-8">
                {filterItem?.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={twMerge(
                        classNames(
                          'relative block h-9 w-9 shrink-0 overflow-hidden rounded-full border-4 border-transparent object-cover transition-all duration-300 md:h-12 md:w-12 [&>svg]:left-0 [&>svg]:top-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-full',
                          selectedItem === item?.value
                            ? 'border-border-200'
                            : '',
                        ),
                      )}
                      onClick={() => handleItemClick(item?.value)}
                    >
                      {item?.icon}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-1 px-5 pt-2 pb-5 text-left text-base md:px-9">
                <span className="font-medium">{t('text-title-language')}</span>:
                <span className="font-bold">{currentSelectedItem?.name}</span>
              </div>
            </div>
          ) : (
            ''
          )}
          <button
            className={twMerge(
              classNames(
                'fixed right-5 bottom-8 z-50 flex h-10 w-10 cursor-pointer rounded-full bg-heading text-xl text-white md:h-16 md:w-16 md:text-3xl',
                langOnClick ? '' : 'lang-switch-icon',
              ),
            )}
            onClick={() => setLangOnClick(!langOnClick)}
          >
            {langOnClick ? (
              <CloseIconNew className="m-auto" />
            ) : (
              <LangIcon className="m-auto" />
            )}
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default MaintenanceMode;
