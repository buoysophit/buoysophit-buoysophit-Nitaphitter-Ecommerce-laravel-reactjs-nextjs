import CartItem from '@components/cart/cart-item';
import EmptyCart from '@components/cart/empty-cart';
import Scrollbar from '@components/common/scrollbar';
import Link from '@components/ui/link';
import { useUI } from '@contexts/ui.context';
import { ROUTES } from '@lib/routes';
import usePrice from '@lib/use-price';
import { useCart } from '@store/quick-cart/cart.context';
import { fadeInOut } from '@utils/motion/fade-in-out';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { IoClose } from 'react-icons/io5';

export default function Cart() {
  const { t } = useTranslation('common');
  const { items, total, isEmpty } = useCart();
  const { price: cartTotal } = usePrice({
    amount: total,
  });
  const { closeSidebar } = useUI();

  return (
    <div className="flex flex-col justify-between w-full h-full cart-drawer-main">
      <div className="w-full flex justify-between items-center relative ltr:pl-5 rtl:pr-5 ltr:md:pl-7 rtl:md:pr-7 py-0.5 border-b border-gray-100">
        <h2 className="m-0 text-xl font-bold md:text-2xl text-heading">
          {t('text-shopping-cart')}
        </h2>
        <button
          className="flex items-center justify-center px-4 py-6 text-2xl text-gray-500 transition-opacity md:px-6 lg:py-8 focus:outline-none hover:opacity-60"
          onClick={closeSidebar}
          aria-label="close"
        >
          <IoClose className="text-black mt-1 md:mt-0.5" />
        </button>
      </div>
      {!isEmpty ? (
        <Scrollbar className="flex-grow w-full cart-scrollbar">
          <div className="w-full px-5 md:px-7">
            {items?.map((item) => <CartItem item={item} key={item.id} />)}
          </div>
        </Scrollbar>
      ) : (
        <motion.div
          // layout
          initial="from"
          animate="to"
          exit="from"
          variants={fadeInOut(0.25)}
          className="flex flex-col items-center justify-center px-5 pt-8 pb-5 md:px-7"
        >
          <EmptyCart />
          <h3 className="pt-8 text-lg font-bold text-heading">
            {t('text-empty-cart')}
          </h3>
        </motion.div>
      )}

      <div
        className="flex flex-col px-5 pt-2 pb-5 md:px-7 md:pb-7"
        onClick={() => closeSidebar({ display: false, view: '' })}
      >
        <Link
          href={isEmpty === false ? ROUTES.CHECKOUT : '/'}
          className={cn(
            'w-full px-5 py-3 md:py-4 flex items-center justify-center bg-heading rounded-md text-sm sm:text-base text-white focus:outline-none transition duration-300 hover:bg-gray-600',
            {
              'cursor-not-allowed bg-gray-400 hover:bg-gray-400': isEmpty,
            },
          )}
        >
          <span className="w-full ltr:pr-5 rtl:pl-5 -mt-0.5 py-0.5">
            {t('text-proceed-to-checkout')}
          </span>
          <span className="ltr:ml-auto rtl:mr-auto flex-shrink-0 -mt-0.5 py-0.5 rtl:flex">
            <span className="ltr:border-l rtl:border-r border-white ltr:pr-5 rtl:pl-5 py-0.5" />
            {cartTotal}
          </span>
        </Link>
      </div>
    </div>
  );
}
