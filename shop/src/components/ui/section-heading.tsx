import { cn } from '@lib/cn';
import React from 'react';

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  classNames?: string;
  variant?: 'light' | 'dark';
};

function SectionHeading({
  title,
  subtitle,
  classNames,
  variant = 'light',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'section-heading text-center max-w-[530px] mx-auto space-y-4 mb-10 md:mb-14 xl:mb-[70px]',
        classNames,
      )}
    >
      {title ? (
        <h3
          className={cn(
            'text-2xl font-bold sm:text-[1.75rem] sm:leading-[2.2rem] lg:text-[2rem] lg:leading-[2.8rem]',
            {
              'text-white': variant === 'dark',
              'text-heading': variant === 'light',
            },
          )}
        >
          {title}
        </h3>
      ) : null}
      {subtitle ? (
        <p
          className={cn('text-body leading-[1.87]', {
            'text-white': variant === 'dark',
            'text-body': variant === 'light',
          })}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
