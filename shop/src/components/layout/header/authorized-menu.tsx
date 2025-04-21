import Avatar from '@components/common/avatar';
import Scrollbar from '@components/common/scrollbar';
import Link from '@components/ui/link';
import { useLogout, useUser } from '@framework/auth';
import { Menu, Transition } from '@headlessui/react';
import { siteSettings } from '@settings/site.settings';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { Fragment } from 'react';
import { twMerge } from 'tailwind-merge';

const AuthorizedMenu: React.FC<{ minimal?: boolean }> = ({ minimal }) => {
  const { mutate: logout } = useLogout();
  const { me } = useUser();
  const { t } = useTranslation('common');

  return (
    <Menu
      as="div"
      className="relative inline-block ltr:text-left rtl:text-right"
    >
      <Menu.Button className="flex items-center focus:outline-0" as="div">
        <Avatar
          src={
            me?.profile?.avatar?.thumbnail ?? siteSettings?.avatar?.placeholder
          }
          title="user name"
          className="h-[38px] w-[38px] border-border-200"
        />
        <span className="sr-only">{t('user-avatar')}</span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="div"
          className={cn(
            'absolute mt-5 w-48 rounded bg-white py-4 shadow-700 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left h-56 max-h-56 min-h-40 sm:max-h-72 lg:h-72 2xl:h-auto 2xl:max-h-screen'
          )}
        >
          <Scrollbar
            className="h-full w-full"
            options={{
              scrollbars: {
                autoHide: 'never',
              },
            }}
          >
            {siteSettings?.accountMenu?.map(({ slug, name }, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div>
                    <Link
                      href={slug}
                      className={twMerge(
                        cn(
                          'block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-white hover:bg-black focus:outline-0 ltr:text-left rtl:text-right',
                          active ? 'text-white bg-black' : 'text-heading'
                        )
                      )}
                    >
                      {t(name)}
                    </Link>
                  </div>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
              <button
                onClick={() => logout()}
                className={cn(
                  'block w-full py-2.5 px-6 text-sm font-semibold capitalize text-heading transition duration-200 hover:text-white hover:bg-black focus:outline-0 ltr:text-left rtl:text-right'
                )}
              >
                {t('auth-menu-logout')}
              </button>
            </Menu.Item>
          </Scrollbar>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default AuthorizedMenu;
