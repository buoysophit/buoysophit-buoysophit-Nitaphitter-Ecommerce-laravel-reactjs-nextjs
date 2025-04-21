import { atom } from 'jotai';

export type DRAWER_VIEWS =
  | 'DISPLAY_COLLECTION_FILTER'
  | 'DISPLAY_FILTER'
  | 'DISPLAY_MOBILE_MENU'
  | 'DISPLAY_SHOP_SINGLE_SIDE_BAR'
  | 'DISPLAY_CART'
  | 'DISPLAY_MAINTENANCE_MORE_INFO'
  | '';

interface DrawerState {
  display: boolean;
  view: DRAWER_VIEWS;
  data?: any;
}

export const drawerAtom = atom<DrawerState>({
  display: false,
  view: '',
  data: null,
});
