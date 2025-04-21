import Link from '@components/ui/link';
import { FaChevronDown } from 'react-icons/fa';
import MegaMenu from '@components/ui/mega-menu';
import classNames from 'classnames';
import ListMenu from '@components/ui/list-menu';
import { useTranslation } from 'next-i18next';
import {
  RESPONSIVE_WIDTH,
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
  checkIsScrollingStart,
  checkIsShopMaintenanceModeComing,
  checkIsShopMaintenanceModeStart,
} from '@lib/constants';
import { useWindowSize } from 'react-use';
import Alert from '@components/ui/alert';
import CountdownTimer from '@components/ui/countdown-timer';
import { useAtom } from 'jotai';
import { useSettings } from '@contexts/settings.context';
import { useShop } from '@framework/shops';
import { useRouter } from 'next/router';

interface MenuProps {
  data: any;
  className?: string;
}

const HeaderMenu: React.FC<MenuProps> = ({ data, className }) => {
  const { t } = useTranslation('menu');
  // const router = useRouter();
  // console.log('aaaaaaaaa', router.query);
  // const {
  //   query: { slug },
  // } = router;
  // const { data: shopData, isLoading } = useShop({
  //   slug: slug as string,
  //   enabled: Boolean(slug),
  // });
  const [underMaintenanceIsComing] = useAtom(checkIsMaintenanceModeComing);
  const [__, setUnderMaintenanceStart] = useAtom(checkIsMaintenanceModeStart);
  // const [shopUnderMaintenanceIsComing] = useAtom(
  //   checkIsShopMaintenanceModeComing,
  // );
  // const [___, setShopUnderMaintenanceStart] = useAtom(
  //   checkIsShopMaintenanceModeStart,
  // );
  const [isScrolling] = useAtom(checkIsScrollingStart);
  const { settings } = useSettings();
  const { width } = useWindowSize();
  return (
    <>
      {width >= RESPONSIVE_WIDTH && underMaintenanceIsComing && !isScrolling ? (
        <>
          <Alert
            message={t('text-maintenance-mode-title')}
            variant="info"
            className="sticky top-0 left-0 z-50"
            childClassName="flex justify-center items-center w-full gap-4"
          >
            <CountdownTimer
              date={new Date(settings?.maintenance?.start as string)}
              className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
              onComplete={() => setUnderMaintenanceStart(true)}
            />
          </Alert>
        </>
      ) : (
        ''
      )}
      {/* {width >= RESPONSIVE_WIDTH &&
      !underMaintenanceIsComing &&
      !isScrolling &&
      shopUnderMaintenanceIsComing &&
      !isLoading ? (
        <Alert
          message={`${shopData?.name} ${t('text-maintenance-mode-title')}`}
          variant="info"
          className="sticky top-0 left-0 z-50"
          childClassName="flex justify-center items-center font-bold w-full gap-4"
        >
          <CountdownTimer
            date={
              new Date(shopData?.settings?.shopMaintenance?.start as string)
            }
            className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
            onComplete={() => setShopUnderMaintenanceStart(true)}
          />
        </Alert>
      ) : (
        ''
      )} */}

      <nav className={classNames(`headerMenu flex w-full relative`, className)}>
        {data?.map((item: any) => (
          <div
            className={`menuItem group cursor-pointer py-7 ${
              item.subMenu ? 'relative' : ''
            }`}
            key={item.id}
          >
            <Link
              href={item.path}
              className="relative inline-flex items-center px-3 py-2 text-sm font-normal before:rtl:right-0 before:ltr:left-0 xl:text-base text-heading xl:px-4 group-hover:text-black"
            >
              {t(item.label)}
              {(item?.columns || item.subMenu) && (
                <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                  <FaChevronDown className="transition duration-300 ease-in-out transform group-hover:-rotate-180" />
                </span>
              )}
            </Link>

            {item?.columns && Array.isArray(item.columns) && (
              <MegaMenu columns={item.columns} />
            )}

            {item?.subMenu && Array.isArray(item.subMenu) && (
              <div className="absolute bg-gray-200 opacity-0 subMenu shadow-header ltr:left-0 rtl:right-0 group-hover:opacity-100">
                <ul className="py-5 text-sm text-body">
                  {item.subMenu.map((menu: any, index: number) => {
                    const dept: number = 1;
                    const menuName: string = `sidebar-menu-${dept}-${index}`;

                    return (
                      <ListMenu
                        dept={dept}
                        data={menu}
                        hasSubMenu={menu.subMenu}
                        menuName={menuName}
                        key={menuName}
                        menuIndex={index}
                      />
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};

export default HeaderMenu;
