import { drawerAtom } from '@store/drawer-atom';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Drawer from '@components/ui/drawer';
const CollectionFilterSidebar = dynamic(
  () => import('@components/collection/collection-filter-sidebar'),
);
const FilterSidebar = dynamic(() => import('@components/shop/filter-sidebar'));
const MobileMenu = dynamic(
  () => import('@components/layout/header/mobile-menu'),
);
const ShopSidebarDrawer = dynamic(
  () => import('@components/shops/shop-sidebar-drawer'),
);
const Cart = dynamic(() => import('@components/cart/cart'));
const MaintenanceMoreInfo = dynamic(
  () => import('@components/maintenance/more-info'),
);

export default function ManagedDrawer() {
  const [{ display, view, data }, setDrawerState] = useAtom(drawerAtom);
  return (
    <Drawer
      open={display}
      onClose={() => setDrawerState({ display: false, view: '' })}
      variant={
        ['DISPLAY_CART', 'DISPLAY_MAINTENANCE_MORE_INFO'].includes(view)
          ? 'right'
          : 'left'
      }
      className={
        ['DISPLAY_MAINTENANCE_MORE_INFO']?.includes(view)
          ? 'max-w-sm md:max-w-xl'
          : ''
      }
    >
      {view === 'DISPLAY_COLLECTION_FILTER' ? (
        <CollectionFilterSidebar data={data} />
      ) : (
        ''
      )}
      {view === 'DISPLAY_FILTER' ? <FilterSidebar data={data} /> : ''}
      {view === 'DISPLAY_MOBILE_MENU' ? <MobileMenu /> : ''}
      {view === 'DISPLAY_SHOP_SINGLE_SIDE_BAR' ? (
        <ShopSidebarDrawer data={data} />
      ) : (
        ''
      )}
      {view === 'DISPLAY_CART' ? <Cart /> : ''}
      {view === 'DISPLAY_MAINTENANCE_MORE_INFO' ? <MaintenanceMoreInfo /> : ''}
    </Drawer>
  );
}
