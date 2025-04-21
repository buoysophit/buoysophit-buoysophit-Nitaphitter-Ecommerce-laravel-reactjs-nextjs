import Button from '@components/ui/button';
import { useTranslation } from 'next-i18next';
import { useGetPaymentIntent } from '@framework/orders';
import { Order } from '@type/index';

interface Props {
  order: Order;
  trackingNumber: string;
  buttonSize?: 'big' | 'medium' | 'small';
}

const PayNowButton: React.FC<Props> = ({ order, trackingNumber, buttonSize = 'small' }) => {
  const { t } = useTranslation();
  const { isLoading, getPaymentIntentQuery } = useGetPaymentIntent({
    tracking_number: order?.tracking_number as string,
    payment_gateway: order?.payment_gateway as string,
    recall_gateway: false as boolean,
  });

  async function handlePayNow() {
    await getPaymentIntentQuery();
  }

  return (
    <Button
      className="w-full"
      onClick={handlePayNow}
      variant="slim"
      disabled={isLoading}
      loading={isLoading}
    >
      {t('text-pay')}
    </Button>
  );
};

export default PayNowButton;
