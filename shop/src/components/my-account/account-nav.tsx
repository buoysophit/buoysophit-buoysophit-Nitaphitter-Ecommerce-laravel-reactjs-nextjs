import { useRouter } from "next/router";
import { IoLogOutOutline } from "react-icons/io5";
import { ROUTES } from "@lib/routes";
import { useTranslation } from "next-i18next";
import Link from "@components/ui/link";
import { isStripeAvailable } from '@lib/is-stripe-available';
import { useSettings } from '@framework/settings';
import { LogoutIcon } from '@components/icons/my-account/logout';
import classNames from 'classnames';

type Option = {
  name: string;
  slug: string;
  icon?: JSX.Element;
};
export default function AccountNav({ options }: { options: Option[] }) {
  const { pathname } = useRouter();
  const newPathname = pathname?.split('/')?.slice(2, 3);
  const mainPath = `/${newPathname[0]}`;
  const { t } = useTranslation('common');
  let { data } = useSettings();
  return (
    <nav className="flex flex-col justify-between h-full">
      <div className="space-y-2">
        {options?.map((item) => {
          const menuPathname = item?.slug?.split('/')?.slice(2, 3);
          const menuPath = `/${menuPathname[0]}`;
          const enableMyCardRoute = isStripeAvailable(data?.options);
          if (
            item?.slug === ROUTES?.ACCOUNT_CARDS &&
            !enableMyCardRoute
          ) {
            return null;
          }
          return (
            <Link
              key={item?.slug}
              href={item?.slug}
              className={classNames(
                'text-base font-normal flex items-center py-[0.8125rem] rounded-lg px-4 gap-3',
                menuPath === mainPath
                  ? 'bg-black text-white font-semibold'
                  : 'text-heading'
              )}
            >
              {item?.icon}
              <span className="leading-none">{t(`${item?.name}`)}</span>
            </Link>
          );
        })}
        <Link
          href={`${ROUTES?.LOGOUT}`}
          className="text-base font-normal flex items-center py-[0.8125rem] rounded-lg px-4 gap-3 text-heading"
        >
          <LogoutIcon className="text-lg md:text-xl" />
          <span className="leading-none">{t('text-logout')}</span>
        </Link>
      </div>
      {/* <div className="border-t border-[#E6E6E6] border-solid pt-[3.125rem]">
        <Link
          href={`${ROUTES?.LOGOUT}`}
          className="text-base font-normal flex items-center py-[0.8125rem] rounded-lg px-4 gap-3 text-heading"
        >
          <LogoutIcon className="text-lg md:text-xl" />
          <span className="leading-none">{t('text-logout')}</span>
        </Link>
      </div> */}
    </nav>
  );
}
