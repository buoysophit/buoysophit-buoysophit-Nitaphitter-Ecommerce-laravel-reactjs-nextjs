import { LogoutIcon } from '@components/icons/my-account/logout';
import Link from '@components/ui/link';
import { Listbox, Transition } from '@headlessui/react';
import { ROUTES } from '@lib/routes';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useSettings } from '@framework/settings';
import { isStripeAvailable } from '@lib/is-stripe-available';

type Option = {
  name: string;
  slug: string;
  icon?: JSX.Element;
};

export default function AccountNavMobile({ options }: { options: Option[] }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname } = router;
  const { data: settings } = useSettings();
  const currentSelectedItem = pathname
    ? options.find((o) => o.slug === pathname)!
    : options[0];
  const [selectedItem, setSelectedItem] = useState<Option>(currentSelectedItem);
  useEffect(() => {
    setSelectedItem(currentSelectedItem);
  }, [currentSelectedItem]);

  function handleItemClick(slugs: any) {
    setSelectedItem(slugs);
    router.push(slugs.slug);
  }

  return (
    <Listbox value={selectedItem} onChange={handleItemClick}>
      {({ open }) => (
        <div className="relative w-full font-body">
          <Listbox.Button className="relative w-full p-4 md:p-5 ltr:text-left rtl:text-right rounded focus:outline-none cursor-pointer border border-gray-300 bg-gray-200 flex items-center">
            {selectedItem?.icon}
            <span className="flex truncate items-center text-sm md:text-[15px] ltr:pl-2.5 rtl:pr-2.5 relative text-heading font-semibold">
              {t(selectedItem?.name)}
            </span>
            <span className="absolute inset-y-0 ltr:right-4 ltr:md:right-5 rtl:left-4 rtl:md:left-5 flex items-center pointer-events-none">
              <FaChevronDown
                className="w-3 md:w-3.5 h-3 md:h-3.5 text-base text-opacity-70"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              static
              className="absolute z-20 w-full py-2.5 mt-1.5 overflow-auto bg-white rounded-md shadow-dropDown max-h-72 focus:outline-none text-sm md:text-[15px]"
            >
              {options?.map((option, index) => {
                const enableMyCardRoute = isStripeAvailable(settings?.options);
                if (
                  option?.slug === ROUTES.ACCOUNT_CARDS &&
                  !enableMyCardRoute
                ) {
                  return null;
                }
                return (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `cursor-pointer relative py-3 px-4 md:px-5 ${
                        active
                          ? 'text-md md:text-base bg-gray-200'
                          : 'text-md md:text-base'
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <span className="flex items-center">
                        {option?.icon}
                        <span
                          className={`block truncate ltr:pl-2.5 rtl:pr-2.5 ltr:md:pl-3 rtl:md:pr-3 ${
                            selected
                              ? 'font-semibold text-heading'
                              : 'font-normal'
                          }`}
                        >
                          {t(option?.name)}
                        </span>
                        {selected ? (
                          <span
                            className={`${active && 'text-amber-600'}
                                 absolute inset-y-0 ltr:left-0 rtl:right-0 flex items-center ltr:pl-3 rtl:pr-3`}
                          />
                        ) : null}
                      </span>
                    )}
                  </Listbox.Option>
                );
              })}
              <Link
                className="w-full flex items-center text-sm lg:text-[15px] py-3 px-4 md:px-5 cursor-pointer focus:outline-none hover:bg-gray-200"
                href={`${ROUTES?.LOGOUT}`}
              >
                <span className="flex-shrink-0 flex justify-center">
                  <LogoutIcon className="text-lg md:text-xl" />
                </span>
                <span className="block truncate ltr:pl-2.5 rtl:pr-2.5 ltr:md:pl-3 rtl:md:pr-3">
                  {t('text-logout')}
                </span>
              </Link>
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
}
