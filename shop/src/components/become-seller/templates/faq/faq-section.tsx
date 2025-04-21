import Accordion from '@components/common/accordion';
import SectionHeading from '@components/ui/section-heading';
import { cn } from '@lib/cn';
import { BecomeSellerPageOptions } from '@type/index';
import React from 'react';

interface FaqSectionProps
  extends Pick<
    BecomeSellerPageOptions,
    'faqTitle' | 'faqDescription' | 'faqItems'
  > {
  className?: string;
}

function prepareForAccordion(data: any[]) {
  return data?.map((item) => ({
    faq_title: item?.title,
    faq_description: item?.description,
  }));
}

export default function FaqSection({
  faqTitle,
  faqDescription,
  faqItems,
  className,
}: FaqSectionProps) {
  return (
    <section className={cn('pt-20 pb-[70px] bg-white', className)}>
      <div className="mx-auto max-w-[94.75rem] px-4">
        <SectionHeading title={faqTitle} subtitle={faqDescription} />
        <div className="max-w-[1000px] mx-auto space-y-4">
          <Accordion
            items={prepareForAccordion(faqItems)}
            translatorNS="faq"
            // numberIndexing={true}
          />
        </div>
      </div>
    </section>
  );
}
