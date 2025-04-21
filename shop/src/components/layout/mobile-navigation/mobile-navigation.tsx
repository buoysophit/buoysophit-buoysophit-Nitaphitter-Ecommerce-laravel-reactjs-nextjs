import HomeIcon from '@components/icons/home-icon';
import MenuIcon from '@components/icons/menu-icon';
import SearchIcon from '@components/icons/search-icon';
import UserIcon from '@components/icons/user-icon';
import Link from '@components/ui/link';
import { useUI } from '@contexts/ui.context';
import { ROUTES } from '@lib/routes';
import { authorizationAtom } from '@store/authorization-atom';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
const CartButton = dynamic(() => import('@components/cart/cart-button'), {
  ssr: false,
});
const AuthMenu = dynamic(() => import('@components/layout/header/auth-menu'), {
  ssr: false,
});

const BottomNavigation: React.FC = () => {
  const { openSearch, openModal, setModalView, openSidebar } = useUI();
  const [isAuthorize] = useAtom(authorizationAtom);

  const handleLogin = useCallback(() => {
    setModalView('LOGIN_VIEW');
    return openModal();
  }, []);

  const handleMobileMenu = useCallback(() => {
    return openSidebar({
      view: 'DISPLAY_MOBILE_MENU',
    });
  }, []);

  return (
    <>
      <div className="md:hidden fixed z-10 bottom-0 flex items-center justify-between shadow-bottomNavigation text-gray-700 body-font bg-white w-full h-14 sm:h-16 px-4">
        <button
          aria-label="Menu"
          className="menuBtn flex flex-col items-center justify-center flex-shrink-0 outline-none focus:outline-none"
          onClick={handleMobileMenu}
        >
          <MenuIcon />
        </button>
        <button
          className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
          onClick={openSearch}
          aria-label="search-button"
        >
          <SearchIcon />
        </button>
        <Link href="/" className="flex-shrink-0">
          <HomeIcon />
        </Link>
        <CartButton />
        <AuthMenu
          isAuthorized={isAuthorize}
          href={ROUTES.ACCOUNT}
          className="flex-shrink-0"
          btnProps={{
            className: 'flex-shrink-0 focus:outline-none',
            children: <UserIcon />,
            onClick: handleLogin,
          }}
        >
          <UserIcon />
        </AuthMenu>
      </div>
    </>
  );
};

export default BottomNavigation;
