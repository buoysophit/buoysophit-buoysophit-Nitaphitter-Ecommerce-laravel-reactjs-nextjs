import { AddToCart } from "@components/product/add-to-cart/add-to-cart";
import Button from "@components/ui/button";
import Link from "@components/ui/link";
import { useUI } from "@contexts/ui.context";
import { useRemoveFromWishlist } from "@framework/wishlist";
import { productPlaceholder } from "@lib/placeholders";
import { ROUTES } from "@lib/routes";
import usePrice from "@lib/use-price";
import { Product } from '@type/index';
import classNames from 'classnames';
import Image from 'next/image';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { RemoveIcon } from '@components/icons/my-account/remove';

export default function WishlistItem({ product }: { product: Product }) {
  const { t } = useTranslation('common');
  const { openModal, setModalData, setModalView } = useUI();
  const { removeFromWishlist, isLoading } = useRemoveFromWishlist();
  const { price, basePrice } = usePrice({
    amount: product?.sale_price
      ? (product?.sale_price as number)
      : (product?.price as number),
    baseAmount: product?.price,
  });
  const { price: minPrice } = usePrice({
    amount: product?.min_price || 0,
  });
  const { price: maxPrice } = usePrice({
    amount: product?.max_price || 0,
  });

  const handleVariableProduct = useCallback(() => {
    setModalData(product);
    setModalView('WISHLIST_MODAL');
    return openModal();
  }, []);

  const buttonClassName =
    'rounded-lg bg-black text-white px-[1.375rem] py-[0.6875rem] inline-flex md:text-base font-semibold hover:bg-opacity-80 transition-colors duration-300';

  return (
    <div className="flex gap-6 first:pt-0 pt-8">
      <div
        className={classNames(
          'w-32 h-32 rounded-lg relative overflow-hidden shrink-0 hover:opacity-75 transition-opacity duration-300',
          product?.image?.thumbnail ? '' : 'border border-solid border-gray-100'
        )}
      >
        <Link
          href={`${ROUTES.PRODUCT}/${product?.slug}`}
          locale={product?.language}
          className={classNames(
            'h-full w-full',
            product?.image?.thumbnail ? 'block' : 'flex'
          )}
        >
          <Image
            src={product?.image?.thumbnail ?? productPlaceholder}
            alt="text"
            // fill
            width={128}
            height={128}
            className={classNames(
              'object-cover block',
              product?.image?.thumbnail ? '' : 'm-auto'
            )}
          />
        </Link>
      </div>

      <div className="w-full flex justify-between items-center md:flex-nowrap flex-wrap gap-3 md:gap-0">
        <div className="flex-1">
          <h2 className="md:text-2xl text-lg mb-2 font-semibold text-heading tracking-[-0.18px] hover:text-opacity-80 transition-colors duration-300">
            <Link
              href={`${ROUTES.PRODUCT}/${product?.slug}`}
              locale={product?.language}
            >
              {product?.name}
            </Link>
          </h2>

          <div className="mb-4 text-xl flex items-center font-bold gap-2 text-black tracking-[-0.24px] leading-none">
            {product?.product_type?.toLowerCase() === 'variable' ? (
              <>
                <span>{minPrice}</span>
                <span> - </span>
                <span>{maxPrice}</span>
              </>
            ) : (
              <>
                <span>{price}</span>
                {basePrice && (
                  <del className="text-base self-end font-normal opacity-30">
                    {basePrice}
                  </del>
                )}
              </>
            )}
          </div>

          {Number(product?.quantity) <= 0 && (
            <p className="text-red-500 text-sm mb-1 font-bold">
              {t('text-out-stock')}
            </p>
          )}

          <Link
            href={`${ROUTES.PRODUCT}/${product?.slug}`}
            className="text-[#666] text-sm tracking-[-0.14px] border-b border-current leading-none hover:text-opacity-80 transition-colors duration-300"
            locale={product?.language}
          >
            See Details
          </Link>
        </div>

        <div className="flex items-center gap-8 pr-2 w-full md:w-auto">
          {Number(product?.quantity) > 0 && (
            <>
              {/* {product?.product_type?.toLowerCase() === 'variable' ? (
                <Button
                  variant="text"
                  className={classNames(buttonClassName)}
                  onClick={handleVariableProduct}
                >
                  {t('text-add-to-cart')}
                </Button>
              ) : (
                <AddToCart
                  variant="text"
                  data={product}
                  className={classNames(buttonClassName)}
                />
              )} */}
              <Button
                variant="text"
                className={classNames(buttonClassName)}
                onClick={handleVariableProduct}
              >
                {t('text-add-to-cart')}
              </Button>
            </>
          )}

          {/* <span className="" />  */}
          <button
            className="text-2xl p-2 hover:bg-red-600 hover:text-white transition-colors duration-300 cursor-pointer text-[#929292] rounded-full"
            onClick={() => removeFromWishlist(product?.id as string)}
            disabled={isLoading}
          >
            <RemoveIcon />
          </button>
        </div>
      </div>
    </div>
  );
}