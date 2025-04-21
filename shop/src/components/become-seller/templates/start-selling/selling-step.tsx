import { cn } from '@lib/cn';
import { SellingStep as SellingStepItem } from '@type/index';
import Image from 'next/image';
import React from 'react';

interface SellingStepProps {
  sellingStep: SellingStepItem;
  className?: string;
}

function SellingStep({ sellingStep, className }: SellingStepProps) {
  return (
    <div className={cn('text-center', className)}>
      {sellingStep?.image?.original ? (
        <Image
          src={sellingStep?.image?.original}
          alt={sellingStep?.title}
          height={187}
          width={280}
          quality={100}
          className="mb-7 mx-auto object-contain max-h-[187px]"
        />
      ) : null}
      {sellingStep?.title ? (
        <h5 className="text-lg font-semibold text-heading">
          {sellingStep?.title}
        </h5>
      ) : null}
      {sellingStep?.description ? (
        <p className="text-body mt-2 leading-[1.87]">
          {sellingStep?.description}
        </p>
      ) : null}
    </div>
  );
}

export default SellingStep;
