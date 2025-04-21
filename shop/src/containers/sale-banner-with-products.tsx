import BannerCard from '@components/common/banner-card';
import SectionHeader from '@components/common/section-header';
import ProductCard from '@components/product/product-card';
import ProductCardListSmallLoader from '@components/ui/loaders/product-card-small-list-loader';
import { useProducts } from '@framework/products';
import { saleBannerWithProducts as banner } from '@data/static/banners';
import Alert from '@components/ui/alert';
import { ROUTES } from '@lib/routes';
import { Product } from '@type/index';

import { siteSettings } from '@settings/site.settings';
import cn from 'classnames';

interface ProductsProps {
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  variant?: 'default' | 'center' | 'left' | 'fashion';
  productVariant?: 'grid' | 'gridSlim' | 'list' | 'listSmall';
  imageHeight?: number;
  imageWidth?: number;
  limit?: number;
  bannerData?: any;
}

const SaleBannerWithProducts: React.FC<ProductsProps> = ({
  sectionHeading,
  categorySlug,
  variant = 'default',
  className = 'mb-12 md:mb-14 xl:mb-16',
  productVariant = 'listSmall',
  limit = 4,
  bannerData = banner,
}) => {
  const onSellingSettings = siteSettings?.homePageBlocks?.onSaleSettings;

  const { data, isLoading, error } = useProducts({
    limit,
    tags: onSellingSettings?.slug,
  });

  return (
    <div className={className}>
      <SectionHeader
        sectionHeading={sectionHeading}
        categorySlug={categorySlug}
      />
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div
          className={`grid grid-cols-1 ${
            variant === 'fashion'
              ? '2xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4'
              : '2xl:grid-cols-4 2xl:grid-rows-2 md:grid-cols-2'
          } gap-3 md:gap-6 lg:gap-5 xl:gap-7`}
        >
          {variant === 'fashion' ? (
            <div className="grid order-2 gap-5 col-span-full sm:col-span-full sm:grid-cols-4 2xl:col-span-2 2xl:row-span-2 md:gap-8 sm:gap-3">
              <BannerCard
                data={bannerData[0]}
                href={`${ROUTES.COLLECTIONS}/${bannerData[0].slug}`}
                effectActive={true}
                className="sm:col-span-2 2xl:col-span-full"
                classNameInner="md:aspect-[1.5/1] aspect-[1.8/1] md:h-full"
              />
              <BannerCard
                data={bannerData[1]}
                href={`${ROUTES.COLLECTIONS}/${bannerData[1].slug}`}
                effectActive={true}
                className="sm:col-span-2 2xl:col-span-full"
                classNameInner="md:aspect-[1.5/1] aspect-[1.8/1] md:h-full"
              />
            </div>
          ) : (
            <BannerCard
              data={bannerData[0]}
              href={`${ROUTES.COLLECTIONS}/${bannerData[0].slug}`}
              effectActive={true}
              className="order-2 md:col-span-full 2xl:col-span-2 2xl:row-span-2"
              classNameInner={cn({
                'aspect-[2.28/1]': variant === 'center',
              })}
            />
          )}
          {isLoading
            ? Array.from({ length: 2 }).map((_, idx) => (
                <ProductCardListSmallLoader
                  key={idx}
                  uniqueKey={`on-selling-${idx}`}
                />
              ))
            : data?.map((product: Product, index: number) => (
                <div
                  key={`product--key${product.id}`}
                  className={`${
                    variant === 'center' && index === 0
                      ? '2xl:order-0'
                      : '2xl:order-2'
                  }`}
                >
                  <ProductCard product={product} variant={productVariant} />
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default SaleBannerWithProducts;
