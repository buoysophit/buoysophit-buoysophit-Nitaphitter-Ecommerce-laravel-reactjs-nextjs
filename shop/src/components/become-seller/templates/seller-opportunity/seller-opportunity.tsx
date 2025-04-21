import Button from '@components/ui/button';
import { cn } from '@lib/cn';
import { fixDynamicLink } from '@lib/fix-dynamic-link';
import { BecomeSellerPageOptions } from '@type/index';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface SellerOpportunityProps
  extends Pick<BecomeSellerPageOptions, 'dashboard'> {
  className?: string;
}

function SellerOpportunity({
  dashboard: {
    title,
    description,
    image,
    buttonName,
    buttonLink,
    button2Name,
    button2Link,
  },
  className,
}: SellerOpportunityProps) {
  return (
    <section className={cn('py-20 bg-[#092635]', className)}>
      <div className="mx-auto max-w-[94.75rem] px-4">
        <div className="flex items-center flex-col-reverse justify-between lg:flex-row gap-x-10 gap-y-8 xl:pl-20">
          <div className="[&>*]:text-white max-w-[605px] mx-auto text-center lg:text-left lg:mx-0 rtl:lg:text-right">
            {title ? (
              <h3 className="font-bold text-3xl md:text-4xl xl:text-5xl !leading-normal tracking-[-0.4px]">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="text-lg leading-[1.7] md:leading-[2] lg:leading-[2.2] font-normal mt-3">
                {description}
              </p>
            ) : null}
            {buttonName || button2Name ? (
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-7 justify-center lg:justify-start">
                {buttonName ? (
                  <Link {...fixDynamicLink(buttonLink)}>
                    <Button variant="smoke" className="uppercase">
                      {buttonName}
                    </Button>
                  </Link>
                ) : null}
                {button2Name ? (
                  <Link
                    {...fixDynamicLink(button2Link)}
                    className="font-semibold underline uppercase"
                  >
                    {button2Name}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="max-w-[500px] xl:max-w-[937px] mx-auto xl:-mt-28 xl:-mb-16 [@media(min-width:1750px)]:-mr-[100px]">
            {image && image?.original ? (
              <Image
                src={image?.original}
                alt={image?.original!}
                height={545}
                width={937}
                quality={100}
                sizes="(max-width: 768px) 100vw"
                className="object-contain max-h-[545px]"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SellerOpportunity;
