import SectionHeading from '@components/ui/section-heading';
import { cn } from '@lib/cn';
import React, { useState } from 'react';
import GuidelineItem from './guideline-item';
import Button from '@components/ui/button';
import { BecomeSellerPageOptions } from '@type/index';

interface GuidelineProps
  extends Pick<
    BecomeSellerPageOptions,
    'guidelineTitle' | 'guidelineDescription' | 'guidelineItems'
  > {
  className?: string;
}

export default function Guideline({
  guidelineTitle,
  guidelineDescription,
  guidelineItems,
  className,
}: GuidelineProps) {
  const [visibleCount, setVisibleCount] = useState(8);

  const loadMoreItems = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto max-w-[94.75rem] px-4">
        <SectionHeading
          title={guidelineTitle}
          subtitle={guidelineDescription}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guidelineItems &&
            !!guidelineItems?.length &&
            guidelineItems
              ?.slice(0, visibleCount)
              ?.map((guideline, index) => (
                <GuidelineItem
                  title={guideline?.title}
                  link={guideline?.link}
                  key={index}
                />
              ))}
        </div>

        {visibleCount < guidelineItems.length && (
          <div className="text-center mt-12">
            <Button className="uppercase tracking-wide" onClick={loadMoreItems}>
              Explore More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
