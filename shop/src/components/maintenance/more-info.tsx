import ContactForm from '@components/common/form/contact-form';
import Scrollbar from '@components/common/scrollbar';
import { CloseIcon } from '@components/icons/close-icon';
import { HomeIconNew } from '@components/icons/home-icon';
import { MapPinNew } from '@components/icons/map-pin';
import { MobileIconNew } from '@components/icons/mobile-icon';
import Link from '@components/ui/link';
import { useUI } from '@contexts/ui.context';
import { useContact } from '@framework/contact';
import { useSettings } from '@framework/settings';
import { CreateContactUsInput } from '@type/index';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { SubmitHandler } from 'react-hook-form';
const JoinButton = dynamic(
  () => import('@components/layout/header/login-button'),
  {
    ssr: false,
  },
);

const MoreInfo = () => {
  const { t } = useTranslation('common');
  const { mutate, isLoading } = useContact();
  const onSubmit: SubmitHandler<CreateContactUsInput> = (values) => {
    mutate(values);
  };
  const { data: settings } = useSettings();
  const { closeSidebar } = useUI();
  return (
    <>
      <div className="sticky top-0 left-0 flex w-full items-center justify-between border-b border-light-300 p-4 bg-white z-50">
        <button
          onClick={closeSidebar}
          aria-label="Close panel"
          className="-m-2 p-2 text-dark-800 outline-none transition-all hover:text-dark hover:dark:text-light-200"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-5 xs:gap-6 sm:gap-7">
          <JoinButton />
        </div>
      </div>
      <Scrollbar>
        <div className="p-5 pt-12 md:p-10">
          <div className="mb-12 text-center md:mb-24">
            {settings?.options?.maintenance?.aboutUsTitle ? (
              <h2 className="mb-5 text-3xl font-bold">
                {settings?.options?.maintenance?.aboutUsTitle}
              </h2>
            ) : (
              ''
            )}
            {settings?.options?.maintenance?.aboutUsDescription ? (
              <p className="mb-6 leading-8 text-dark dark:text-light">
                {settings?.options?.maintenance?.aboutUsDescription}
              </p>
            ) : (
              ''
            )}
          </div>

          <div className="mb-14 md:mb-32">
            {settings?.options?.maintenance?.contactUsTitle ? (
              <h2 className="mb-5 text-center text-3xl font-bold">
                {settings?.options?.maintenance?.contactUsTitle}
              </h2>
            ) : (
              ''
            )}
            <ContactForm onSubmit={onSubmit} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-3 gap-6 divide-y divide-dark text-center dark:divide-light md:gap-4 md:divide-y-0">
            <div className="col-span-full md:col-span-1">
              <div className="text-[rgb(191 187 199)] mb-4 text-3xl">
                <MapPinNew className="mx-auto" />
              </div>
              <h3 className="mb-3 text-base font-bold">{t('text-address')}</h3>
              {settings?.options?.contactDetails?.location?.formattedAddress ? (
                <Link
                  href={`https://www.google.com/maps/place/${settings?.options?.contactDetails?.location?.formattedAddress}`}
                  target="_blank"
                  title={
                    settings?.options?.contactDetails?.location
                      ?.formattedAddress
                  }
                  className="text-[rgb(79, 81, 93)] text-sm leading-7"
                >
                  {
                    settings?.options?.contactDetails?.location
                      ?.formattedAddress
                  }
                </Link>
              ) : (
                ''
              )}
            </div>
            <div className="col-span-full pt-6 md:col-span-1 md:pt-0">
              <div className="text-[rgb(191 187 199)] mb-4 text-3xl">
                <MobileIconNew className="mx-auto" />
              </div>
              <h3 className="mb-3 text-base font-bold">{t('text-phone')}</h3>
              {settings?.options?.contactDetails?.contact ? (
                <Link
                  href={`tel:${settings?.options?.contactDetails?.contact}`}
                  className="text-[rgb(79, 81, 93)] text-sm leading-7"
                >
                  {settings?.options?.contactDetails?.contact}
                </Link>
              ) : (
                ''
              )}
            </div>
            <div className="col-span-full pt-6 md:col-span-1 md:pt-0">
              <div className="text-[rgb(191 187 199)] mb-4 text-3xl">
                <HomeIconNew className="mx-auto" />
              </div>
              <h3 className="mb-3 text-base font-bold">{t('text-website')}</h3>
              {settings?.options?.contactDetails?.website ? (
                <Link
                  target="_blank"
                  href={settings?.options?.contactDetails?.website}
                  className="text-[rgb(79, 81, 93)] text-sm leading-7"
                >
                  {settings?.options?.contactDetails?.website}
                </Link>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </Scrollbar>
    </>
  );
};

export default MoreInfo;
