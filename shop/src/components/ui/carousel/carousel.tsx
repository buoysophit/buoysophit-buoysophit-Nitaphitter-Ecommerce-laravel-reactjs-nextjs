import React, { useRef } from 'react';
import { Swiper } from 'swiper/react';
import { useRouter } from 'next/router';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { getDirection } from '@utils/get-direction';
import CarouselNavigation from './carousel-navigation';

SwiperCore.use([Navigation, Pagination, Autoplay, Scrollbar]);

type CarouselPropsType = {
  className?: string;
  buttonClassName?: string;
  prevActivateId?: string;
  nextActivateId?: string;
  buttonSize?: 'default' | 'small';
  paginationVariant?: 'default' | 'circle';
  centeredSlides?: boolean;
  breakpoints?: {} | any;
  pagination?: {} | any;
  navigation?: {} | any;
  autoplay?: {} | any;
  loop?: boolean;
  scrollbar?: {} | any;
  buttonPosition?: 'inside' | 'outside';
  showNavigation?: boolean;
  children: React.ReactNode;
};

const Carousel: React.FunctionComponent<CarouselPropsType> = ({
  children,
  className = '',
  prevActivateId = '',
  nextActivateId = '',
  buttonClassName = '',
  buttonSize = 'default',
  paginationVariant = 'default',
  breakpoints,
  loop,
  autoplay = false,
  buttonPosition = 'outside',
  showNavigation = true,
  ...props
}) => {
  const { locale } = useRouter();
  const dir = getDirection(locale);
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className={`carouselWrapper relative ${className} ${
        paginationVariant === 'circle' ? 'dotsCircle' : ''
      }`}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation, Scrollbar]}
        loop={loop ?? true}
        autoplay={autoplay}
        breakpoints={breakpoints}
        dir={dir}
        navigation={{
          prevEl: prevActivateId.length
            ? `#${prevActivateId}`
            : prevRef.current!, // Assert non-null
          nextEl: nextActivateId.length
            ? `#${nextActivateId}`
            : nextRef.current!, // Assert non-null
        }}
        {...props}
      >
        {children}
      </Swiper>
      {Boolean(showNavigation) ? (
        <CarouselNavigation
          buttonPosition={buttonPosition}
          buttonSize={buttonSize}
          dir={dir}
          buttonClassName={buttonClassName}
          prevActivateId={prevActivateId}
          nextActivateId={nextActivateId}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default Carousel;
