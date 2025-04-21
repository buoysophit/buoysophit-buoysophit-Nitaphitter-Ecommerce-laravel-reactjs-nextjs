import BannerCard from '@components/common/banner-card';
import Carousel from '@components/ui/carousel/carousel';
import { SwiperSlide } from 'swiper/react';
import { saleBannerGrid } from '@data/static/banners';
import { ROUTES } from '@lib/routes';

const breakpoints = {
  '1025': {
    slidesPerView: 3,
    spaceBetween: 28,
  },
  '768': {
    slidesPerView: 3,
    spaceBetween: 20,
  },
  '480': {
    slidesPerView: 2,
    spaceBetween: 12,
  },
  '0': {
    slidesPerView: 1,
    spaceBetween: 12,
  },
};

interface BannerProps {
  className?: string;
  limit?: number;
}

const SaleBannerGrid: React.FC<BannerProps> = ({
  className = 'mb-12 lg:mb-14 xl:mb-16 lg:pb-1 xl:pb-0',
  limit = 2,
}) => {
  return (
    <div className={`${className}`}>
      <div className="md:hidden">
        <Carousel
          breakpoints={breakpoints}
          autoplay={{ delay: 5000 }}
          prevActivateId="saleBannerPrev"
          nextActivateId="saleBannerNext"
        >
          {saleBannerGrid?.slice(0, limit).map((banner: any) => (
            <SwiperSlide key={banner.id}>
              <BannerCard
                data={banner}
                href={`${ROUTES.COLLECTIONS}/${banner.slug}`}
                className="h-full"
                effectActive={true}
                classNameInner="aspect-[2/1]"
              />
            </SwiperSlide>
          ))}
        </Carousel>
      </div>
      <div className="relative hidden md:grid md:grid-cols-2 md:gap-5 xl:gap-7">
        {saleBannerGrid?.slice(0, limit).map((banner: any) => (
          <BannerCard
            key={banner.id}
            data={banner}
            href={`${ROUTES.COLLECTIONS}/${banner.slug}`}
            effectActive={true}
            classNameInner="aspect-[2.05/1]"
          />
        ))}
      </div>
    </div>
  );
};

export default SaleBannerGrid;
