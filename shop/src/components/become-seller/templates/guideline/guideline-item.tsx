import { ArrowRight } from '@components/icons/arrow-right';
import { fixDynamicLink } from '@lib/fix-dynamic-link';
import Link from 'next/link';
import React from 'react';

type GuidelineItemProps = {
  title: string;
  link?: string;
};

export default function GuidelineItem({ title, link }: GuidelineItemProps) {
  return (
    <div className="rounded-[10px] shadow-guideline p-[30px] bg-white space-y-3">
      {title ? (
        <h5 className="text-base lg:text-lg font-semibold text-heading">
          {title}
        </h5>
      ) : null}
      {link ? (
        <Link
          {...fixDynamicLink(link)}
          className="inline-block bg-heading hover:bg-gray-600 rounded-full h-8 w-8 p-2"
        >
          <ArrowRight className="text-white" />
        </Link>
      ) : (
        ''
      )}
    </div>
  );
}
