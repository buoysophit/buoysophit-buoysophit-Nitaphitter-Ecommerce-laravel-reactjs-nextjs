import Counter from '@components/common/counter';
import { ProductAttributes } from '@components/product/product-attributes';
import VariationPrice from '@components/product/product-variant-price';
import Button from '@components/ui/button';
import Gallery from '@components/ui/gallery/gallery';
import Link from '@components/ui/link';
import { useUI } from '@contexts/ui.context';
import { useUser } from '@framework/auth';
import { getVariations } from '@framework/utils/get-variations';
import { ROUTES } from '@lib/routes';
import usePrice from '@lib/use-price';
import { useCart } from '@store/quick-cart/cart.context';
import { Attachment, Product } from '@type/index';
import { generateCartItem } from '@utils/generate-cart-item';
import classNames from 'classnames';
import { isArray } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isMatch from 'lodash/isMatch';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const FavoriteButton = dynamic(
  () => import('@components/product/favorite-button'),
  { ssr: false },
);

type Props = {
  data: Product;
};

const WishlistModal: React.FC<Props> = ({ data: product }) => {
  const { t } = useTranslation('common');
  const { closeModal, openSidebar } = useUI();
  const openCart = useCallback(() => {
    return openSidebar({
      view: 'DISPLAY_CART',
    });
  }, []);

  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [viewCartBtn, setViewCartBtn] = useState<boolean>(false);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const { me } = useUser();

  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });

  const variations = getVariations(product?.variations!);

  const isSelected = useMemo(() => {
    return !isEmpty(variations)
      ? !isEmpty(attributes) &&
          Object.keys(variations).every((variation) =>
            attributes.hasOwnProperty(variation),
          )
      : true;
  }, [attributes, variations]);

  let selectedVariation: any = useMemo(() => {
    if (isSelected) {
      return product?.variation_options?.find((o: any) =>
        isEqual(
          o.options.map((v: any) => v.value).sort(),
          Object.values(attributes).sort(),
        ),
      );
    }
    return {};
  }, [isSelected, product?.variation_options, attributes]);

  const addToCart = useCallback(() => {
    if (!isSelected) return;
    // to show btn feedback while product carting
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
      setViewCartBtn(true);
    }, 600);
    // @ts-ignore
    const item = generateCartItem(product!, selectedVariation);
    addItemToCart(item, quantity);

    toast(t('add-to-cart'), {
      //@ts-ignore
      type: 'dark',
      progressClassName: 'fancy-progress-bar',
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }, [isSelected]);

  const navigateToProductPage = useCallback(() => {
    closeModal();
  }, []);

  const handleAttribute = useCallback((attribute: any) => {
    // Reset Quantity
    if (!isMatch(attributes, attribute)) {
      setQuantity(1);
    }

    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }, []);

  const handleClearAttribute = useCallback(() => {
    setAttributes(() => ({}));
  }, []);

  const navigateToCartPage = useCallback(() => {
    closeModal();
    setTimeout(() => {
      openCart();
    }, 300);
  }, []);

  const productImage = useMemo(() => {
    return !isEmpty(selectedVariation)
      ? isEmpty(selectedVariation?.image)
        ? product?.image
        : selectedVariation?.image
      : product?.image;
  }, [selectedVariation, product?.image]);

  const priceClassName =
    'text-2xl font-bold text-black tracking-[-0.24px] leading-none';

  const imageGallery = useMemo(() => {
    if (isArray(product?.gallery) && !isEmpty(product?.gallery)) {
      let gallery: Attachment[] = [];
      if (!isEmpty(product?.image)) {
        gallery = [product?.image].concat(product?.gallery);
      } else {
        gallery = product?.gallery;
      }
      return gallery;
    }

    return [];
  }, [product?.image, product?.gallery]);

  return (
    <div className="bg-white rounded-md">
      <div className="flex flex-col w-full sm:w-[22.125rem] mx-auto overflow-hidden p-6">
        <div className="relative h-[19.125rem] rounded-lg overflow-hidden w-full mb-4">
          <Link
            href={`${ROUTES.PRODUCT}/${product?.slug}`}
            onClick={navigateToProductPage}
            title={product?.name as string}
            className="block w-full h-full"
          >
            <Image
              height={306}
              width={306}
              src={
                productImage?.original ??
                '/assets/placeholder/products/product-thumbnail.svg'
              }
              alt={product?.name as string}
              className="object-cover h-full w-full object-top"
              sizes="(max-width: 768px) 100vw"
            />
          </Link>
          <div className="absolute top-2 right-2 flex gap-4 items-center">
            {me && (
              <FavoriteButton
                productId={product?.id as string}
                className="bg-white w-9 h-9 border-none shadow-variationButton text-black text-base"
              />
            )}
            {!isEmpty(product?.gallery) ? (
              <Gallery gallery={imageGallery as Attachment[]} />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-black text-lg font-semibold mb-2">
            <Link
              href={`${ROUTES.PRODUCT}/${product?.slug}`}
              onClick={navigateToProductPage}
              title={product?.name as string}
            >
              {product?.name}
            </Link>
          </h2>
          <div
            className={classNames(
              'flex gap-2 mb-6 items-center',
              priceClassName,
            )}
          >
            {!isEmpty(variations) ? (
              <VariationPrice
                selectedVariation={selectedVariation}
                minPrice={product?.min_price as number}
                maxPrice={product.max_price as number}
                basePriceClassName={priceClassName}
                discountPriceClassName="text-base self-end font-normal opacity-30"
              />
            ) : (
              <>
                <p>{price}</p>

                {basePrice && (
                  <del className="text-base self-end font-normal opacity-30">
                    {basePrice}
                  </del>
                )}
              </>
            )}
          </div>

          {!isEmpty(Object.keys(variations)) ? (
            <div className="space-y-6">
              {Object.keys(variations).map((variation) => {
                return (
                  <ProductAttributes
                    key={`popup-attribute-key${variation}`}
                    title={variation}
                    attributes={variations[variation]}
                    active={attributes[variation]}
                    onClick={handleAttribute}
                    clearAttribute={handleClearAttribute}
                    className="mb-0"
                    variant="wishlist"
                  />
                );
              })}
            </div>
          ) : (
            ''
          )}

          <div className="w-full mt-6">
            <div className="space-y-4">
              {isEmpty(variations) && (
                <>
                  {Number(product?.quantity) > 0 ? (
                    <Counter
                      quantity={quantity}
                      onIncrement={() => setQuantity((prev) => prev + 1)}
                      onDecrement={() =>
                        setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                      }
                      disableDecrement={quantity === 1}
                      disableIncrement={Number(product?.quantity) === quantity}
                    />
                  ) : (
                    <p className="text-red-500 text-sm mb-1 font-bold">
                      {t('text-out-stock')}
                    </p>
                  )}
                </>
              )}

              {!isEmpty(selectedVariation) && (
                <>
                  {selectedVariation?.is_disable ||
                  selectedVariation?.quantity === 0 ? (
                    <p className="text-red-500 text-sm mb-1 font-bold">
                      {t('text-out-stock')}
                    </p>
                  ) : (
                    <Counter
                      quantity={quantity}
                      onIncrement={() => setQuantity((prev) => prev + 1)}
                      onDecrement={() =>
                        setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                      }
                      disableDecrement={quantity === 1}
                      disableIncrement={
                        Number(selectedVariation?.quantity) === quantity
                      }
                    />
                  )}
                </>
              )}

              {viewCartBtn && (
                <button
                  onClick={navigateToCartPage}
                  className="w-full rounded-lg bg-[#F1F1F1] border border-[#E6E6E6] text-black font-semibold leading-none focus:outline-none hover:bg-[#E6E6E6] focus:bg-[#E6E6E6] transition-colors duration-300 text-base py-4"
                >
                  {t('text-view-cart')}
                </button>
              )}
            </div>

            <div className="flex w-full justify-between gap-2 mt-6">
              <Link
                href={`${ROUTES.PRODUCT}/${product?.slug}`}
                onClick={navigateToProductPage}
                title={product?.name as string}
                className="w-1/2 bg-[#F1F1F1] border-[#E6E6E6] border border-solid rounded-lg flex hover:bg-[#E6E6E6] transition-colors duration-300 font-semibold text-black py-3"
              >
                <span className="m-auto">{t('text-view-details')}</span>
              </Link>
              <Button
                onClick={addToCart}
                className="rounded-lg md:text-base lg:px-0 w-1/2 lg:py-3"
                disabled={
                  !isSelected ||
                  !product?.quantity ||
                  (!isEmpty(selectedVariation) &&
                    !selectedVariation?.quantity) ||
                  (!isEmpty(selectedVariation) && selectedVariation?.is_disable)
                }
                loading={addToCartLoader}
              >
                {product?.quantity ||
                (!isEmpty(selectedVariation) && selectedVariation?.quantity)
                  ? t('text-add-to-cart')
                  : t('text-out-stock')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistModal;
