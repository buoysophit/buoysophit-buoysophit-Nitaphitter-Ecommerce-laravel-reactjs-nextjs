import CartIcon from "@components/icons/cart-icon";
import { useUI } from "@contexts/ui.context";
import { useCart } from '@store/quick-cart/cart.context';
import { useCallback } from 'react';

const CartButton = () => {
  const { totalItems } = useCart();
  const { openSidebar } = useUI();
  const handleMobileMenu = useCallback(() => {
    return openSidebar({
      view: 'DISPLAY_CART',
    });
  }, []);

  return (
    <button
      className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
      onClick={handleMobileMenu}
      aria-label="cart-button"
    >
      <CartIcon />
      <span className="cart-counter-badge flex items-center justify-center bg-heading text-white absolute -top-3 ltr:-right-2.5 ltr:xl:-right-3 rtl:-left-2.5 rtl:xl:-left-3 rounded-full font-bold">
        {totalItems}
      </span>
    </button>
  );
};

export default CartButton;
