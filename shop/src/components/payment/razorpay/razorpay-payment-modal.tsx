import { useCallback, useEffect } from 'react';
import useRazorpay, { RazorpayOptions } from '@lib/use-razorpay';
import { formatAddress } from '@lib/format-address';
import { useTranslation } from 'next-i18next';
import { useSettings } from '@framework/settings';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useOrder, useOrderPayment } from '@framework/orders';
import { PaymentGateway, PaymentIntentInfo } from '@type/index';

interface Props {
  paymentIntentInfo: PaymentIntentInfo;
  trackingNumber: string;
  paymentGateway: PaymentGateway;
}

const RazorpayPaymentModal: React.FC<Props> = ({
  trackingNumber,
  paymentIntentInfo,
}) => {
  const { t } = useTranslation();
  const { loadRazorpayScript, checkScriptLoaded } = useRazorpay();
  const { data, isLoading: isSettingsLoading } = useSettings();
  const {
    data: order,
    isLoading,
    refetch,
  } = useOrder({
    tracking_number: trackingNumber,
  });
  const { createOrderPayment } = useOrderPayment();

  const { customer_name, customer_contact, customer, billing_address, payment_gateway } = order!;

  const paymentHandle = useCallback(async () => {
    if (!checkScriptLoaded()) {
      await loadRazorpayScript();
    }
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: paymentIntentInfo?.amount!,
      currency: paymentIntentInfo?.currency!,
      name: customer_name!,
      description: `${t('text-order')}#${trackingNumber}`,
      image: data?.options?.logo?.original!,
      order_id: paymentIntentInfo?.payment_id!,
      handler: async () => {
        createOrderPayment({
          tracking_number: trackingNumber!,
          payment_gateway: 'razorpay' as string,
        });
      },
      prefill: {
        ...(customer_name && { name: customer_name }),
        ...(customer_contact && { contact: `+${customer_contact}` }),
        ...(customer?.email && { email: customer?.email }),
      },
      notes: {
        address: formatAddress(billing_address as any),
      },
      modal: {
        ondismiss: async () => {
          await refetch();
        },
      },
    };
    const razorpay = (window as any).Razorpay(options);
    return razorpay.open();
  }, [isLoading, isSettingsLoading]);

  useEffect(() => {
    if (!isLoading && !isSettingsLoading) {
      (async () => {
        await paymentHandle();
      })();
    }
  }, [isLoading, isSettingsLoading]);

  if (isLoading || isSettingsLoading) {
    return <Spinner showText={false} />;
  }

  return null;
};

export default RazorpayPaymentModal;
