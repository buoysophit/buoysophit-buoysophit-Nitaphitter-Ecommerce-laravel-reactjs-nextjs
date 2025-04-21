import { useMemo, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { AddToCart } from './add-to-cart/add-to-cart';
import { getVariations } from '@framework/utils/get-variations';
import { isVariationSelected } from '@lib/is-variation-selected';
import { useProduct } from '@framework/products';
import { Product } from '@type/index';
import { ProductAttributes } from './product-attributes';
import { isEmpty, isMatch } from 'lodash';
import VariationPrice from './product-variant-price';
import usePrice from '@lib/use-price';
import Spinner from '@components/ui/loaders/spinner/spinner';

interface Props {
  product: Product;
}

const Variation = ({ product }: Props) => {
  const [, setQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const { price, basePrice } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price!,
    baseAmount: product?.price,
  });
  const variations = useMemo(
    () => getVariations(product?.variations),
    [product?.variations]
  );
  const isSelected = isVariationSelected(variations, attributes);
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  function handleAttribute(attribute: any) {
    // Reset Quantity
    if (!isMatch(attributes, attribute)) {
      setQuantity(1);
    }

    setAttributes((prev) => ({
      ...prev,
      ...attribute,
    }));
  }

  function handleClearAttribute() {
    setAttributes(() => ({}));
  }

  return (
    <div className="w-[95vw] max-w-lg rounded-md bg-white p-8">
      <h3 className="mb-2 text-center text-2xl font-semibold text-heading">
        {product?.name}
      </h3>
      <div className="flex items-center justify-center my-3">
        {!isEmpty(variations) ? (
          <VariationPrice
            selectedVariation={selectedVariation}
            minPrice={product?.min_price!}
            maxPrice={product?.max_price!}
            basePriceClassName='text-base !font-bold text-heading md:text-xl lg:text-2xl'
          />
        ) : (
          <>
            <div className="text-base font-semibold text-heading md:text-xl lg:text-2xl">
              {price}
            </div>

            {basePrice && (
              <del className="font-segoe text-gray-400 text-base lg:text-xl ltr:pl-2.5 rtl:pr-2.5 -mt-0.5 md:mt-0">
                {basePrice}
              </del>
            )}
          </>
        )}
      </div>
      <div className="mb-8">
        {/* <VariationGroups variations={variations} /> */}
        {Object.keys(variations).map((variation) => {
          return (
            <ProductAttributes
              key={`popup-attribute-key${variation}`}
              title={variation}
              attributes={variations[variation]}
              active={attributes[variation]}
              onClick={handleAttribute}
              clearAttribute={handleClearAttribute}
            />
          );
        })}
      </div>
      <AddToCart
        data={product}
        variant="flat"
        variation={selectedVariation}
        disabled={selectedVariation?.is_disable || !isSelected}
      />
    </div>
  );
};

const ProductVariation = ({ productSlug }: { productSlug: string }) => {
  const { data: product, isLoading } = useProduct({
    slug: productSlug,
  });
  if (isLoading || !product) return (
    <div className="relative flex items-center justify-center overflow-hidden bg-white w-96 h-96">
      <Spinner />
    </div>
  );
  return (
    <Variation product={product as Product} />
  );
};

export default ProductVariation;
