import SectionHeading from '@components/ui/section-heading';
import { cn } from '@lib/cn';
import { BecomeSellerPageOptions, Commission } from '@type/index';
import React from 'react';
import CommissionItem from '@components/become-seller/templates/fee-and-commission/commission-item';

interface FeeAndCommissionProps
  extends Pick<
    BecomeSellerPageOptions,
    'commissionTitle' | 'commissionDescription'
  > {
  isMultiCommissionRate: boolean;
  commissions?: Commission[];
  className?: string;
  defaultCommissionDetails?: string;
  defaultCommissionRate?: number;
}

export default function FeeAndCommission({
  commissionTitle,
  commissionDescription,
  commissions,
  defaultCommissionDetails,
  defaultCommissionRate,
  className,
  isMultiCommissionRate,
}: FeeAndCommissionProps) {
  return (
    <section className={cn('pb-20', className)}>
      <div className="mx-auto max-w-[94.75rem] px-4">
        <SectionHeading
          title={commissionTitle}
          subtitle={commissionDescription}
        />
        <div className="items max-w-[1000px] mx-auto space-y-5">
          {isMultiCommissionRate ? (
            <>
              {commissions &&
                !!commissions?.length &&
                commissions?.map((commission) => (
                  <CommissionItem
                    commission={commission}
                    key={commission?.id}
                  />
                ))}
            </>
          ) : !!defaultCommissionDetails && !!defaultCommissionRate ? (
            <CommissionItem
              commission={{
                description: defaultCommissionDetails!,
                commission: defaultCommissionRate!,
              }}
              key="default_commission"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
