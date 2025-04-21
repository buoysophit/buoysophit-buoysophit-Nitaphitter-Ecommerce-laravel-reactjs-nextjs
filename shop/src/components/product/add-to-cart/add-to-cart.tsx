import Counter from "@components/common/counter";
import Button from "@components/ui/button";
import { useCart } from "@store/quick-cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import classNames from 'classnames';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

interface Props {
  data: any;
  variant?:
    | 'flat'
    | 'text'
    | 'slim'
    | 'slimSmall'
    | 'smoke'
    | 'normal'
    | 'outline'
    | 'custom';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
  className?: string;
}

export const AddToCart = ({
  data,
  variant = 'flat',
  counterClass,
  variation,
  disabled,
  className,
}: Props) => {
  const { t } = useTranslation('common');
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
  } = useCart();
  const item = generateCartItem(data, variation);
  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    addItemToCart(item, 1);
  };
  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };
  const outOfStock = isInCart(item?.id) && !isInStock(item.id);

  return !isInCart(item?.id) ? (
    <div>
      {!data?.is_external || !data?.external_product_url ? (
        <>
          <Button
            onClick={handleAddClick}
            variant={variant}
            className={classNames(`w-full lg:w-6/12 xl:w-full`, className)}
            disabled={
              disabled || outOfStock || data.status.toLowerCase() != 'publish'
            }
          >
            {!outOfStock ? t('text-add-to-cart') : t('text-out-stock')}
          </Button>
        </>
      ) : (
        <Link
          href={data?.external_product_url}
          target="_blank"
          className={twMerge(
            classNames(
              'inline-flex items-center justify-center font-semibold text-sm leading-none rounded outline-none transition duration-300 ease-in-out focus:outline-0 focus:shadow focus:ring-1 focus:ring-accent-700 bg-accent text-light border border-transparent hover:bg-accent-hover px-5 py-0 h-10 !shrink',
              className
            )
          )}
        >
          {data?.external_product_button_text}
        </Link>
      )}
    </div>
  ) : (
    <>
      <Counter
        variant="dark"
        quantity={getItemFromCart(item.id).quantity}
        onIncrement={handleAddClick}
        onDecrement={handleRemoveClick}
        className={counterClass}
        // disableDecrement={getItemFromCart(item.id).quantity <= 1}
        disableIncrement={outOfStock}
      />
    </>
  );
};