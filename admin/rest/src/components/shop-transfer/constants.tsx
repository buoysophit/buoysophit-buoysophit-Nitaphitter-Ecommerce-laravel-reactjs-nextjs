import { BasketIcon } from '@/components/icons/summary/basket';
import { CancelledProcessedIcon } from '@/components/icons/summary/cancelled-order';
import { ChecklistIcon } from '@/components/icons/summary/checklist';
import { CustomersIcon } from '@/components/icons/summary/customers';
import { EaringIcon } from '@/components/icons/summary/earning';
import { FailedProcessedIcon } from '@/components/icons/summary/failed';
import { OrderAtLocalFacilityProcessedIcon } from '@/components/icons/summary/order-at-local-facility';
import { OrderOutForDeliveryProcessedIcon } from '@/components/icons/summary/order-out-for-delivery';
import { OrderProcessedIcon } from '@/components/icons/summary/order-processed';
import { RefundProcessedIcon } from '@/components/icons/summary/refunded';
import { OrderStickerCardProps } from '@/types';

export const orderStatusWidgetContent = [
  {
    key: 'pending',
    titleTransKey: 'text-pending-order',
    icon: <ChecklistIcon className="h-8 w-8" />,
    color: '#6366F1',
  },
  {
    key: 'processing',
    titleTransKey: 'text-processing-order',
    icon: <CustomersIcon className="h-8 w-8" />,
    color: '#14B8A6 ',
  },
  {
    key: 'complete',
    titleTransKey: 'text-completed-order',
    icon: <OrderProcessedIcon className="h-8 w-8" />,
    color: '#F43F5E',
  },
  {
    key: 'localFacility',
    titleTransKey: 'text-order-local-facility',
    icon: <OrderAtLocalFacilityProcessedIcon className="h-8 w-8" />,
    color: '#2563EB ',
  },
  {
    key: 'outForDelivery',
    titleTransKey: 'text-order-out-delivery',
    icon: <OrderOutForDeliveryProcessedIcon className="h-8 w-8" />,
    color: '#FDA4AF',
  },
  {
    key: 'failed',
    titleTransKey: 'text-failed-order',
    icon: <FailedProcessedIcon className="h-8 w-8" />,
    color: '#38BDF8 ',
  },
  {
    key: 'cancelled',
    titleTransKey: 'text-cancelled-order',
    icon: <CancelledProcessedIcon className="h-8 w-8" />,
    color: '#F59E0B ',
  },
  {
    key: 'refunded',
    titleTransKey: 'text-refunded-order',
    icon: <RefundProcessedIcon className="h-8 w-8" />,
    color: '#A8A29E ',
  },
] as OrderStickerCardProps[];

export const orderSummaryWidgetContent = [
  {
    key: 'total_earnings',
    titleTransKey: 'Total Revenue',
    icon: <EaringIcon className="h-8 w-8" />,
    color: '#047857',
  },
  {
    key: 'current_balance',
    titleTransKey: 'Current Balance',
    icon: <EaringIcon className="h-8 w-8" />,
    color: '#DB2777',
  },
  {
    key: 'admin_commission_rate',
    titleTransKey: 'Admin Commission',
    icon: <BasketIcon className="h-8 w-8" />,
    color: '#9333EA',
  },
  {
    key: 'withdrawn_amount',
    titleTransKey: 'Withdraw Amount',
    icon: <ChecklistIcon className="h-8 w-8" />,
    color: '#38BDF8',
  },
] as OrderStickerCardProps[];
