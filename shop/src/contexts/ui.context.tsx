import React from 'react';
import { CartProvider } from '@store/quick-cart/cart.context';
import { DRAWER_VIEWS, drawerAtom } from '@store/drawer-atom';
import { useAtom } from 'jotai';

export interface State {
  displayModal: boolean;
  displayGallery: boolean;
  displaySearch: boolean;
  modalView: string;
  modalData: any;
  toastText: string;
}

const initialState = {
  displayModal: false,
  displayGallery: false,
  displaySearch: false,
  modalView: 'LOGIN_VIEW',
  modalData: null,
  toastText: '',
};

type Action =
  | {
      type: 'OPEN_SEARCH';
    }
  | {
      type: 'CLOSE_SEARCH';
    }
  | {
      type: 'SET_TOAST_TEXT';
      text: ToastText;
    }
  | {
      type: 'OPEN_MODAL';
    }
  | {
      type: 'CLOSE_MODAL';
    }
  | {
      type: 'SET_MODAL_VIEW';
      view: MODAL_VIEWS;
    }
  | {
      type: 'SET_MODAL_DATA';
      data: any;
    }
  | {
      type: 'SET_USER_AVATAR';
      value: string;
    }
  | {
      type: 'OPEN_GALLERY';
    }
  | {
      type: 'CLOSE_GALLERY';
    };

type MODAL_VIEWS =
  | 'SIGN_UP_VIEW'
  | 'LOGIN_VIEW'
  | 'FORGET_PASSWORD'
  | 'PRODUCT_VIEW'
  | 'ADDRESS_FORM_VIEW'
  | 'ADDRESS_DELETE_VIEW'
  | 'ADD_OR_UPDATE_CHECKOUT_CONTACT'
  | 'ADD_OR_UPDATE_PROFILE_CONTACT'
  | 'ADD_NEW_CARD'
  | 'USE_NEW_PAYMENT'
  | 'PAYMENT_MODAL'
  | 'GATEWAY_MODAL'
  | 'ADD_OR_UPDATE_GUEST_ADDRESS'
  | 'SELECT_PRODUCT_VARIATION'
  | 'DELETE_CARD_MODAL'
  | 'WISHLIST_MODAL'
  | 'GALLERY_VIEW'
  | 'NEWSLETTER_MODAL'
  | 'PROMO_POPUP_MODAL';
type ToastText = string;

export const UIContext = React.createContext<State | any>(initialState);

UIContext.displayName = 'UIContext';

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case 'OPEN_SEARCH': {
      return {
        ...state,
        displaySearch: true,
      };
    }
    case 'CLOSE_SEARCH': {
      return {
        ...state,
        displaySearch: false,
      };
    }
    case 'OPEN_MODAL': {
      return {
        ...state,
        displayModal: true,
        displaySidebar: false,
      };
    }
    case 'CLOSE_MODAL': {
      return {
        ...state,
        displayModal: false,
      };
    }
    case 'SET_MODAL_VIEW': {
      return {
        ...state,
        modalView: action.view,
      };
    }
    case 'SET_MODAL_DATA': {
      return {
        ...state,
        modalData: action.data,
      };
    }
    case 'SET_TOAST_TEXT': {
      return {
        ...state,
        toastText: action.text,
      };
    }
    case 'SET_USER_AVATAR': {
      return {
        ...state,
        userAvatar: action.value,
      };
    }
    case 'OPEN_GALLERY': {
      return {
        ...state,
        displayGallery: true,
      };
    }
    case 'CLOSE_GALLERY': {
      return {
        ...state,
        displayGallery: false,
        drawerView: null,
      };
    }
  }
}

export const UIProvider: React.FC<{ children?: React.ReactNode }> = (props) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState);
  const [_, setDrawerView] = useAtom(drawerAtom);
  const openSidebar = ({ view, data }: { view: DRAWER_VIEWS; data?: any }) =>
    setDrawerView({
      view,
      display: true,
      data,
    });
  const closeSidebar = () =>
    setDrawerView({
      view: '',
      display: false,
    });
  const openModal = () => dispatch({ type: 'OPEN_MODAL' });
  const closeModal = () => dispatch({ type: 'CLOSE_MODAL' });
  const openSearch = () => dispatch({ type: 'OPEN_SEARCH' });
  const closeSearch = () => dispatch({ type: 'CLOSE_SEARCH' });
  const openGallery = () => dispatch({ type: 'OPEN_GALLERY' });
  const closeGallery = () => dispatch({ type: 'CLOSE_GALLERY' });

  const setUserAvatar = (_value: string) =>
    dispatch({ type: 'SET_USER_AVATAR', value: _value });

  const setModalView = (view: MODAL_VIEWS) =>
    dispatch({ type: 'SET_MODAL_VIEW', view });
  const setModalData = (data: any) =>
    dispatch({ type: 'SET_MODAL_DATA', data });

  const value = React.useMemo(
    () => ({
      ...state,
      openSidebar,
      closeSidebar,
      openModal,
      closeModal,
      openSearch,
      closeSearch,
      setModalView,
      setUserAvatar,
      setModalData,
      openGallery,
      closeGallery,
    }),
    [state],
  );

  return <UIContext.Provider value={value} {...props} />;
};

export const useUI = () => {
  const context = React.useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};

export const ManagedUIContext: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <CartProvider>
    <UIProvider>{children}</UIProvider>
  </CartProvider>
);
