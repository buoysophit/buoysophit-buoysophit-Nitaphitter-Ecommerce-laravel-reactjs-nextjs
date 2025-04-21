import BannerCard from '@components/common/banner-card';
import SectionHeader from '@components/common/section-header';
import ProductCard from '@components/product/product-card';
import ProductCardListSmallLoader from '@components/ui/loaders/product-card-small-list-loader';
import { useProducts } from '@framework/products';
import Alert from '@components/ui/alert';
import { ROUTES } from '@lib/routes';
import { siteSettings } from '@settings/site.settings';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';
import NotFoundItem from '@components/404/not-found-item';
import { StaticBanner } from '@type/index';
import classNames from 'classnames';

interface ProductsProps {
  data: StaticBanner[];
  sectionHeading: string;
  categorySlug?: string;
  className?: string;
  variant?: 'default' | 'reverse' | 'modern';
  limit?: number;
}

const BannerWithProducts: React.FC<ProductsProps> = ({
  sectionHeading,
  categorySlug,
  variant = 'default',
  className = 'mb-12 md:mb-14 xl:mb-16',
  limit = 9,
  data,
}) => {
  const { t } = useTranslation();

  const onSellingSettings = siteSettings?.homePageBlocks?.onSaleSettings;
  const {
    data: products,
    isLoading: loading,
    error,
  } = useProducts({
    limit,
    tags: onSellingSettings?.slug,
  });

  if (!loading && isEmpty(products)) {
    return <NotFoundItem text={t('text-no-on-selling-products-found')} />;
  }

  return (
    <div className={className}>
      <SectionHeader
        sectionHeading={sectionHeading}
        categorySlug={categorySlug}
      />
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <div className="grid grid-cols-4 gap-x-3 lg:gap-x-5 xl:gap-x-7">
          {
            <BannerCard
              data={variant === 'reverse' ? data[1] : data[0]}
              href={
                variant === 'reverse'
                  ? `${ROUTES.COLLECTIONS}/${data[1].slug}`
                  : `${ROUTES.COLLECTIONS}/${data[0].slug}`
              }
              className={classNames('hidden 3xl:block', {
                '3xl:col-span-2 3xl:row-span-2': variant === 'modern',
                'col-span-1': variant === 'default',
              })}
              classNameInner={classNames({
                'aspect-[2/2.78] h-full':
                  variant === 'default' || variant === 'reverse',
                'aspect-[2.3/1] h-full': variant === 'modern',
              })}
              effectActive={true}
            />
          }
          <div
            className={`col-span-full ${
              variant === 'modern'
                ? 'xl:grid-cols-2 3xl:col-span-2'
                : '3xl:col-span-3 xl:grid-cols-3'
            } grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 xl:gap-7 ${
              variant === 'reverse' ? 'row-span-full' : ''
            }`}
          >
            {loading
              ? Array.from({ length: products?.length ?? 4 }).map((_, idx) => (
                  <ProductCardListSmallLoader
                    key={idx}
                    uniqueKey={`on-selling-${idx}`}
                  />
                ))
              : products?.map((product: any) => (
                  <ProductCard
                    key={`product--key${product.id}`}
                    product={product}
                    variant="listSmall"
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerWithProducts;
