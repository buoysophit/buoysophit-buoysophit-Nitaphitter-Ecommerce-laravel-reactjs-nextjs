import { ChevronRightNew } from '@components/icons/chevron-right';
import Badge from '@components/ui/badge';
import Link from '@components/ui/link';
import { BecomeSellerPageOptions } from '@type/index';

import { useTranslation } from 'next-i18next';
import { cn } from '@lib/cn';
import Glow from '@components/ui/glow';
import Button from '@components/ui/button';
import { fixDynamicLink } from '@lib/fix-dynamic-link';
import { useIsRTL } from '@lib/locals';
{/* @ts-ignore */}
import { ChevronLeft, IosGhostArrowLeft } from '@components/icons/chevron-left';
import Image from 'next/image';

interface BannerProps extends Pick<BecomeSellerPageOptions, 'banner'> {
  className?: string;
}

const Banner = ({ banner, className }: BannerProps) => {
  const { t } = useTranslation('common');
  const { isRTL } = useIsRTL();

  return (
    <section className={cn('relative py-20', className)}>
      <Glow className="bg-[#BDE4DC] opacity-50 w-[200px] top-1/2 left-0 " />
      <Glow className="bg-[#F0DC72] opacity-20 w-[120px] top-[10%] left-1/2" />
      <Glow className="bg-[#BDE4DC] opacity-50 w-[150px] top-auto left-auto right-[3%] bottom-[12%]" />
      <div className="mx-auto max-w-[94.75rem] px-4 relative z-10">
        <div className="flex items-center justify-between gap-10 text-center lg:text-left">
          <div className="max-w-[530px] md:max-w-[650px] mx-auto xl:mx-0 xl:max-w-[724px]  text-center lg:text-left rtl:lg:text-right">
            {banner?.newsTickerTitle ? (
              <Link
                {...fixDynamicLink(banner?.newsTickerURL)}
                className="bg-white inline-flex p-1 mb-7 text-heading text-sm shadow-newsTicker rounded-full items-center text-left"
              >
                <Badge
                  text={t('text-news')}
                  className={cn(
                    'mr-3 text-sm font-semibold uppercase',
                    isRTL && 'ml-3 mr-0',
                  )}
                />
                {banner?.newsTickerTitle}
                <ChevronRightNew
                  className={cn(
                    'text-[#9CA3AF] mr-3 ml-2',
                    isRTL && 'mr-2 ml-3 transform rotate-180',
                  )}
                />
              </Link>
            ) : null}
            {banner?.title ? (
              <h1
                className="[&>span]:text-accent text-3xl md:text-4xl xl:text-6xl font-bold tracking-[-0.4px] text-heading !leading-[1.25]"
                dangerouslySetInnerHTML={{
                  __html: banner?.title,
                }}
              />
            ) : null}
            {banner?.description ? (
              <p className="text-lg leading-[1.7] md:leading-[2] lg:leading-[2.2] font-normal text-body mt-3">
                {banner?.description}
              </p>
            ) : null}
            {banner?.button1Name || banner?.button2Name ? (
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-7 justify-center lg:justify-start">
                {banner?.button1Name ? (
                  <Link {...fixDynamicLink(banner?.button1Link)}>
                    {/* @ts-ignore */}
                    <Button size="big" className="uppercase">
                      {banner?.button1Name}
                    </Button>
                  </Link>
                ) : null}
                {banner?.button2Name ? (
                  <Link
                    {...fixDynamicLink(banner?.button2Link)}
                    className="font-semibold underline uppercase hover:text-black"
                  >
                    {banner?.button2Name}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
          {banner?.image?.original ? (
            <div className="hidden lg:block">
              <Image
                src={banner?.image?.original}
                alt={banner?.image?.original ?? ''}
                width={630}
                height={680}
                quality={100}
                sizes="(max-width: 768px) 100vw"
                className="object-contain max-h-[680px]"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export { Banner };
