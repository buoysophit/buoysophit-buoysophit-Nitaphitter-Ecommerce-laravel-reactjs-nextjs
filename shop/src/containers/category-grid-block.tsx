import SectionHeader from '@components/common/section-header';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from 'swiper/react';
import CategoryCard from '@components/common/category-card';
import { useWindowSize } from '@utils/use-window-size';
import CategoryCardLoader from '@components/ui/loaders/category-card-loader';
import Alert from '@components/ui/alert';
import { useFeaturedCategories } from '@framework/categories';
import isEmpty from 'lodash/isEmpty';
import NotFoundItem from '@components/404/not-found-item';
import { useTranslation } from 'next-i18next';
import Spinner from '@components/ui/loaders/spinner/spinner';

interface CategoriesProps {
  sectionHeading: string;
  className?: string;
}

const breakpoints = {
  '1220': {
    slidesPerView: 4,
    spaceBetween: 28,
  },
  '800': {
    slidesPerView: 3,
    spaceBetween: 20,
  },
  '440': {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  '0': {
    slidesPerView: 1,
    spaceBetween: 12,
  },
};

const CategoryGridBlock: React.FC<CategoriesProps> = ({
  sectionHeading = 'text-section-title',
  className = 'mb-12 md:mb-14 xl:mb-16',
}) => {
  const { width } = useWindowSize();
  const { t } = useTranslation();

  const {
    data: categories,
    isLoading: loading,
    error,
  } = useFeaturedCategories({
    limit: 3,
  });

  if (!loading && isEmpty(categories)) {
    return <NotFoundItem text={t('text-no-categories-found')} />;
  }
  return (
    <div className={className}>
      <SectionHeader sectionHeading={sectionHeading} />
      {error ? (
        <Alert message={error?.message} />
      ) : (
        <>
          <div className="relative block lg:hidden">
            <Carousel
              breakpoints={breakpoints}
              prevActivateId="featuredCategoriesPrev"
              nextActivateId="featuredCategoriesNext"
              autoplay={{ delay: 4000 }}
            >
              {loading
                ? Array.from({ length: categories?.length ?? 0 }).map(
                    (_, idx) => (
                      <SwiperSlide key={idx}>
                        <CategoryCardLoader
                          uniqueKey={`featured-category-${idx}`}
                        />
                      </SwiperSlide>
                    )
                  )
                : categories?.data?.map((category) => (
                    <SwiperSlide key={`category--key${category.id}`}>
                      <CategoryCard category={category} />
                    </SwiperSlide>
                  ))}
            </Carousel>
          </div>
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5 xl:gap-7">
            {loading
              ? Array.from({ length: categories?.length ?? 0 }).map(
                  (_, idx) => (
                    <CategoryCardLoader
                      key={idx}
                      uniqueKey={`featured-category-${idx}`}
                    />
                  )
                )
              : categories?.data?.map((category) => (
                  <CategoryCard
                    key={`category--key${category.id}`}
                    category={category}
                  />
                ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryGridBlock;
