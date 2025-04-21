import { cn } from '@lib/cn';
import { Commission } from '@type/index';
import Image from 'next/image';
import React from 'react';
import commissionIcon from '@assets/commission.png';
import { useTranslation } from 'next-i18next';

type CommissionItemProps = {
  commission: Commission;
  className?: string;
};

export default function CommissionItem({
  commission,
  className,
}: CommissionItemProps) {
  const { t } = useTranslation('common');

  return (
    <div
      className={cn(
        'commission-item border border-gray-300 rounded-[10px] px-5 md:px-10 py-4 md:py-8 flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap',
        className,
      )}
    >
      <Image
        src={
          commission?.image?.original
            ? commission?.image?.original
            : commissionIcon
        }
        alt={commission?.level ?? 'Commission'}
        height={80}
        width={80}
        quality={100}
        className="grow-0 shrink-0 basis-20 max-w-[80px] order-1 object-contain max-h-[80px]"
      />
      {commission?.level || commission?.sub_level ? (
        <div className="title-subtitle grow lg:grow-0 shrink-0 lg:basis-[180px] lg:max-w-[180px] order-2">
          {commission?.level ? (
            <h5 className="text-lg font-semibold text-heading">
              {commission.level}
            </h5>
          ) : null}
          {commission?.sub_level ? (
            <p className="text-sub-heading text-sm mt-1">
              {commission?.sub_level}
            </p>
          ) : null}
        </div>
      ) : null}
      {commission?.description ? (
        <p className="text-sub-heading w-full lg:w-auto grow order-4 lg:order-3">
          {commission?.description}
        </p>
      ) : null}
      {commission?.commission ? (
        <div className="commission w-full grow-0 shrink-0 basis-[140px] max-w-[140px] text-left sm:text-center order-3 lg:order-4">
          <h3 className="text-heading text-3xl font-medium whitespace-nowrap inline-flex items-start">
            <span>{commission?.commission}</span>
            <span className="text-lg font-bold text-sub-heading">%</span>
          </h3>
          <p className="text-sm text-sub-heading mt-1">
            {t('text-commission')}
          </p>
        </div>
      ) : null}
    </div>
  );
}
