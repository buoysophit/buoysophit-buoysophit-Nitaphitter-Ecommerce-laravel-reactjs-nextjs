import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { StripeIcon } from '@components/icons/payment-gateways/stripe';
import { PayPalIcon } from '@components/icons/payment-gateways/paypal';
import { MollieIcon } from '@components/icons/payment-gateways/mollie';
import { RazorPayIcon } from '@components/icons/payment-gateways/razorpay';
import { PayStack } from '@components/icons/payment-gateways/paystack';
import { useUI } from '@contexts/ui.context';
import Button from '@components/ui/button';
import { useSettings } from '@framework/settings';
import { useGetPaymentIntent } from '@framework/orders';
import { RadioGroup } from '@headlessui/react';
import { IyzicoIcon } from '@components/icons/payment-gateways/iyzico';

interface Props {
  buttonSize?: 'big' | 'medium' | 'small';
}

const PaymentGateways: React.FC<{
  theme?: 'bw';
  settings: any;
  order: any;
  isLoading: boolean;
}> = ({ theme, settings, order, isLoading }) => {
  const icon: any = {
    stripe: <StripeIcon />,
    paypal: <PayPalIcon />,
    razorpay: <RazorPayIcon />,
    mollie: <MollieIcon />,
    paystack: <PayStack />,
    iyzico: <IyzicoIcon />,
  };

  // default payment gateway
  // const defaultPaymentGateway = settings?.defaultPaymentGateway.toUpperCase();

  let temp_gateways = settings?.paymentGateway!;

  // if (settings && settings?.paymentGateway) {
  //   let selectedGateways = [];
  //   for (let i = 0; i < settings?.paymentGateway.length; i++) {
  //     selectedGateways.push(settings?.paymentGateway[i].name.toUpperCase());
  //   }

  //   // if default payment-gateway did not present in the selected gateways, then this will work
  //   if (!selectedGateways.includes(defaultPaymentGateway)) {
  //     const pluckedGateway = PAYMENT_GATEWAYS.filter((obj) => {
  //       return obj.name.toUpperCase() === defaultPaymentGateway;
  //     });
  //     Array.prototype.push.apply(temp_gateways, pluckedGateway);
  //   }
  // }

  return (
    <>
      {temp_gateways?.map((gateway: any, index: number) => {
        // check and set disabled already chosen gateway
        let disabledSelection = false;
        if (gateway?.name.toUpperCase() === order?.payment_gateway) {
          disabledSelection = true;
        }

        return (
          <RadioGroup.Option
            value={gateway}
            key={index}
            disabled={disabledSelection || isLoading}
          >
            {({ checked }) => (
              <div
                className={cn(
                  'relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded border-2 border-white bg-gray-100 text-center',
                  checked && '!border-heading bg-white shadow-md',
                  disabledSelection || isLoading
                    ? 'pointer-events-none cursor-not-allowed opacity-60'
                    : '',
                  disabledSelection ? '!border-heading shadow-md' : ''
                )}
              >
                <span className="block w-full pb-[52%]">
                  <span className="absolute flex items-center justify-center w-full h-full p-6 md:p-9">
                    {icon[gateway?.name]}
                  </span>
                  {disabledSelection && (
                    <span className="absolute flex items-end justify-center p-2 text-white rotate-45 -top-7 -right-7 h-14 w-14 bg-accent">
                      {/* <StarIcon className="h-auto w-2.5" /> */}
                    </span>
                  )}
                </span>
              </div>
            )}
          </RadioGroup.Option>
        );
      })}
    </>
  );
};

const GatewayModal: React.FC<Props> = ({ buttonSize = 'small' }) => {
  const { t } = useTranslation('common');
  const {
    closeModal,
    displayModal,
    modalData: { order },
  } = useUI();
  const [gateway, setGateway] = useState(order?.payment_gateway || '');
  const { data } = useSettings();
  const settings = { ...data?.options! };
  const { isLoading, getPaymentIntentQuery } = useGetPaymentIntent({
    tracking_number: order?.tracking_number as string,
    payment_gateway: gateway?.name?.toUpperCase() as string,
    recall_gateway: true,
    form_change_gateway: true,
  });

  const handleSubmit = async () => {
    await getPaymentIntentQuery();
  };

  // check and set disabled already chosen gateway
  let disabledSelection = false;
  if (!gateway) {
    disabledSelection = true;
  }

  disabledSelection = gateway === order?.payment_gateway;
  return (
    <Fragment>
      <div className="payment-modal relative h-full w-screen max-w-md overflow-hidden rounded-[10px] bg-white md:h-auto md:min-h-0 lg:max-w-[46rem]">
        <div className="p-6 bg-white lg:p-12">
          <RadioGroup value={gateway} onChange={setGateway}>
            <RadioGroup.Label className="block mb-5 text-lg font-semibold text-heading">
              Choose Another Payment Gateway
            </RadioGroup.Label>
            <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3">
              <PaymentGateways
                theme="bw"
                settings={settings}
                order={order}
                isLoading={!!isLoading}
              />
            </div>
          </RadioGroup>

          <Button
            className="w-full"
            onClick={handleSubmit}
            // size={}
            disabled={disabledSelection || !!isLoading}
            loading={isLoading}
          >
            Submit Payment
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default GatewayModal;
