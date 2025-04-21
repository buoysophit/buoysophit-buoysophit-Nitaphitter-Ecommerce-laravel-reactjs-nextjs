import { cn } from '@lib/cn';
import { BusinessPurpose } from '@type/index';
import React from 'react';

import {
  BullsEyeIcon,
  ChatIcon,
  ReceiptIcon,
  RegisteredDocumentIcon,
  ShoppingBagIcon,
  StoreIcon,
} from '@components/icons/sellers';

type BusinessPurposeProps = {
  businessPurpose: BusinessPurpose;
  className?: string;
  iconColor?: string;
};

const getIcon = (name?: string) => {
  switch (name) {
    case 'BullsEyeIcon':
      return BullsEyeIcon;
    case 'ChatIcon':
      return ChatIcon;
    case 'ReceiptIcon':
      return ReceiptIcon;
    case 'RegisteredDocumentIcon':
      return RegisteredDocumentIcon;
    case 'ShoppingBagIcon':
      return ShoppingBagIcon;
    case 'StoreIcon':
      return StoreIcon;
    default:
      return BullsEyeIcon;
  }
};

function BusinessPurposeItem({
  businessPurpose,
  iconColor,
  className,
}: BusinessPurposeProps) {
  const Icon = getIcon(businessPurpose?.icon?.value);

  return (
    <div
      className={cn(
        'flex flex-wrap md:flex-nowrap gap-6 justify-center text-center md:text-left',
        className,
      )}
    >
      <div
        className={cn(
          'h-20 w-20 grow-0 shrink-0 basis-20 rounded-[22px] inline-flex items-center justify-center text-white text-3xl',
          iconColor,
        )}
      >
        <Icon />
      </div>
      <div className="w-full text-center md:text-left rtl:md:text-right">
        {businessPurpose?.title ? (
          <h5 className="text-lg font-semibold text-heading">
            {businessPurpose?.title}
          </h5>
        ) : null}
        {businessPurpose?.description ? (
          <p className="leading-[1.87] mt-2">{businessPurpose?.description}</p>
        ) : null}
      </div>
    </div>
  );
}

export default BusinessPurposeItem;
