import SectionHeading from '@components/ui/section-heading';
import { cn } from '@lib/cn';
import { BecomeSellerPageOptions } from '@type/index';
import React from 'react';
import BusinessPurposeItem from '@components/become-seller/templates/business-purpose/business-purpose-item';
import classNames from 'classnames';

interface BusinessPurposeProps
  extends Pick<
    BecomeSellerPageOptions,
    'purposeItems' | 'purposeTitle' | 'purposeDescription'
  > {
  className?: string;
}

const getColor = (index: number) => {
  return classNames({
    'bg-[#419197]': index % 6 === 0,
    'bg-[#12486B]': index % 6 === 1,
    'bg-[#01987A]': index % 6 === 2,
    'bg-[#7EAA92]': index % 6 === 3,
    'bg-[#F1C678]': index % 6 === 4,
    'bg-[#088395]': index % 6 === 5,
  });
};

function BusinessPurpose({
  purposeTitle,
  purposeDescription,
  purposeItems,
  className,
}: BusinessPurposeProps) {
  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-[94.75rem] px-4">
        <SectionHeading title={purposeTitle} subtitle={purposeDescription} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 xl:gap-x-10 gap-y-10 md:gap-y-14 xl:gap-y-20">
          {purposeItems?.map((purpose, index) => (
            <BusinessPurposeItem
              businessPurpose={purpose}
              key={purpose?.title}
              iconColor={getColor(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BusinessPurpose;
