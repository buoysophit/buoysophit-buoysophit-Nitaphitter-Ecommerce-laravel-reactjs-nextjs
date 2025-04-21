import SectionHeading from '@components/ui/section-heading';
import { cn } from '@lib/cn';
import React from 'react';
import { Swiper, SwiperSlide, Pagination } from '@components/ui/slider';
import CustomerStory from './customer-story';
import { BecomeSellerPageOptions } from '@type/index';

interface CustomerStoriesProps
  extends Pick<
    BecomeSellerPageOptions,
    'userStoryTitle' | 'userStoryDescription' | 'userStories'
  > {
  className?: string;
}

const swiperPaginationClassName = `
	[&_.swiper-pagination]:!relative
  [&_.swiper-pagination]:!-mx-4
  [&_.swiper-pagination]:!px-4
  [&_.swiper-pagination]:!pt-2
  [&_.swiper-pagination]:z-10
  [&_.swiper-pagination]:mt-8
  [&_.swiper-pagination_.swiper-pagination-bullet]:!w-2
  [&_.swiper-pagination_.swiper-pagination-bullet]:!h-2
  [&_.swiper-pagination_.swiper-pagination-bullet]:!cursor-pointer
  [&_.swiper-pagination_.swiper-pagination-bullet]:!bg-white
  [&_.swiper-pagination_.swiper-pagination-bullet]:!bg-opacity-40
  [&_.swiper-pagination_.swiper-pagination-bullet]:!rounded
  [&_.swiper-pagination_.swiper-pagination-bullet]:!w-[60px]
  [&_.swiper-pagination_.swiper-pagination-bullet.swiper-pagination-bullet-active]:!bg-accent
  [&_.swiper-pagination_.swiper-pagination-bullet]:duration-200
	`;

export default function CustomerStories({
  userStoryTitle,
  userStoryDescription,
  userStories,
  className,
}: CustomerStoriesProps) {
  return (
    <section className={cn('py-20 bg-[#092635]', className)}>
      <div className="mx-auto max-w-[94.75rem] px-4">
        <SectionHeading
          title={userStoryTitle}
          subtitle={userStoryDescription}
          variant="dark"
        />
        {userStories ? (
          userStories.length > 1 ? (
            <Swiper
              className={cn('', swiperPaginationClassName)}
              id="become-seller-testimonial"
              loop={true}
              slidesPerView={1}
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
              preventClicks={false}
              preventClicksPropagation={false}
              draggable={false}
              allowTouchMove={false}
              noSwiping={true}
            >
              {userStories &&
                !!userStories?.length &&
                userStories?.map((story, index) => (
                  <SwiperSlide key={index}>
                    <CustomerStory
                      title={story?.title}
                      description={story?.description}
                      link={story?.link}
                      thumbnail={story?.thumbnail}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          ) : (
            <CustomerStory
              title={userStories?.[0]?.title}
              description={userStories?.[0]?.description}
              link={userStories?.[0]?.link}
              thumbnail={userStories?.[0]?.thumbnail}
            />
          )
        ) : null}
      </div>
    </section>
  );
}
