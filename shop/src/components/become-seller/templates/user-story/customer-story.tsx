import React from 'react';
import dynamic from 'next/dynamic';
import { Attachment } from '@type/index';

const VideoPlayer = dynamic(
  () =>
    import('@components/ui/video-player/video-player').then(
      (module) => module.VideoPlayer,
    ),
  {
    ssr: false,
    // loading: () => <VideoPlayerLoader />,
  },
);

type CustomerStoryProps = {
  title: string;
  description: string;
  link: string;
  thumbnail?: Attachment;
};

export default function CustomerStory({
  title,
  description,
  link,
  thumbnail,
}: CustomerStoryProps) {
  return (
    <div className="testimonial bg-[#115750] rounded-xl overflow-hidden">
      <div className="flex flex-wrap lg:flex-nowrap items-center pt-5 lg:pt-0">
        <div className="max-w-[500px] lg:max-w-[800px] mx-auto lg:mx-0 relative w-full h-auto rounded-xl p-5">
          {link ? (
            <VideoPlayer url={link} thumbnail={thumbnail?.original} />
          ) : null}
        </div>
        <div className="content py-5 lg:py-10 px-5 lg:pl-10 lg:pr-20 [&>*]:text-white text-center lg:text-left rtl:lg:text-right">
          {title ? (
            <h3 className="text-xl lg:text-2xl font-semibold mb-5">{title}</h3>
          ) : null}
          {description ? (
            <p className="text-lg lg:text-xl leading-[1.6] font-medium">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
