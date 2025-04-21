import { IyzicoIcon } from '@components/icons/payment-gateways/iyzico';
import { MollieIcon } from '@components/icons/payment-gateways/mollie';
import { PayPalIcon } from '@components/icons/payment-gateways/paypal';
import { PayStack } from '@components/icons/payment-gateways/paystack';
import { RazorPayIcon } from '@components/icons/payment-gateways/razorpay';
import { StripeIcon } from '@components/icons/payment-gateways/stripe';
import Container from '@components/ui/container';
import Link from '@components/ui/link';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useSettings } from '@framework/settings';
import { ROUTES } from '@lib/routes';
import { isEmpty } from 'lodash';

const Copyright = () => {
  const { data, isLoading } = useSettings();
  const showPaymentGateways =
    !isEmpty(data?.options?.paymentGateway) && data?.options?.useEnableGateway!;
  const date = new Date();
  const icon: any = {
    stripe: <StripeIcon className="h-4 w-auto" />,
    paypal: <PayPalIcon className="h-4 w-auto" />,
    razorpay: <RazorPayIcon className="h-4 w-auto" />,
    mollie: <MollieIcon className="h-4 w-auto" />,
    paystack: <PayStack className="h-4 w-auto" />,
    iyzico: <IyzicoIcon className="h-4 w-auto" />,
  };
  return (
    <div className="border-t border-gray-300 pt-5 pb-16 sm:pb-20 md:pb-5 mb-2 sm:mb-0">
      <Container className="flex flex-col-reverse md:flex-row text-center md:justify-between">
        {/* All content removed */}
      </Container>
    </div>
  );
};

export default Copyright;
