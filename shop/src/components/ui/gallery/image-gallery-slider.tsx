import Container from '@components/ui/container';
import { motion, AnimatePresence } from 'framer-motion';
import { Attachment } from '@type/index';
import SwiperCore from 'swiper';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

SwiperCore.use([Navigation, Pagination, Autoplay, Scrollbar]);

import { ChevronForward } from '@components/icons/chevron-forward';
import Image from 'next/image';

function fromOpacity(duration: number = 0.5, delay: number = 0.5) {
  return {
    from: {
      opacity: 1,
      y: '100%',
      transition: {
        type: 'easeInOut',
        duration: duration,
        delay: delay,
      },
    },
    to: {
      opacity: 1,
      y: '0',
      transition: {
        type: 'easeInOut',
        duration: duration,
        delay: delay,
      },
    },
  };
}

interface GalleryCarouselTypes {
  initialSlide?: number;
  sliderOpen: boolean;
  setInitialSlide: (v: number) => void;
  setSliderOpen: (v: boolean) => void;
  images: Attachment[];
}

export default function ImageGallerySlider({
  images,
  sliderOpen,
  setSliderOpen,
  initialSlide = 0,
  setInitialSlide,
}: GalleryCarouselTypes) {
  return (
    <>
      <AnimatePresence>
        {sliderOpen && (
          <motion.div
            initial={fromOpacity(0.5, 0).from}
            animate={fromOpacity(0.5, 0).to}
            exit={fromOpacity(0.5, 0).from}
            className="fixed top-0 left-0 z-50 h-full w-full bg-white"
          >
            <Container>
              <div className="flex items-center justify-between border-b-[1px] border-gray-200 py-6">
                <button
                  onClick={() => setSliderOpen(false)}
                  type="button"
                  className="rounded-md border-[1px] border-black bg-transparent px-4 py-2 text-sm text-black duration-150 hover:bg-black hover:text-white"
                >
                  Close
                </button>
                <p>
                  {initialSlide + 1}/{images.length}
                </p>
                <span />
              </div>
              <div className="flex gap-4 pt-8">
                <div className="flex items-center">
                  <button className="gallery-left flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-black bg-transparent opacity-100 hover:bg-black hover:text-white [&.swiper-button-disabled]:opacity-0">
                    <ChevronForward className="h-4 w-4 rotate-180" />
                  </button>
                </div>
                <Swiper
                  slidesPerView={1}
                  effect="fade"
                  speed={600}
                  initialSlide={initialSlide}
                  onSlideChange={({ realIndex }) => setInitialSlide(realIndex)}
                  navigation={{
                    nextEl: '.gallery-right',
                    prevEl: '.gallery-left',
                  }}
                  className="w-full"
                >
                  {images?.map((item: Attachment) => (
                    <SwiperSlide key={item?.id}>
                      <div className="relative flex h-full w-full justify-center bg-white py-2 md:h-[400px] lg:h-[500px] 3xl:h-[650px]">
                        <Image
                          width={500}
                          height={300}
                          sizes="100vw"
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          src={item?.original as string}
                          alt={'product-image' + item?.id}
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="flex items-center">
                  <button className="gallery-right flex h-10 w-10 items-center justify-center rounded-full border-[1px] border-black bg-transparent opacity-100 hover:bg-black hover:text-white [&.swiper-button-disabled]:opacity-0">
                    <ChevronForward className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
