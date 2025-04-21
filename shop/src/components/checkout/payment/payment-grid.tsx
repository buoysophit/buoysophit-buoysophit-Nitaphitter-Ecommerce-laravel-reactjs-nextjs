import CashOnDelivery from '@components/checkout/payment/cash-on-delivery';
import PaymentOnline from '@components/checkout/payment/payment-online';
import { IyzicoIcon } from '@components/icons/payment-gateways/iyzico';
import { MollieIcon } from '@components/icons/payment-gateways/mollie';
import { PayPalIcon } from '@components/icons/payment-gateways/paypal';
import { PayStack } from '@components/icons/payment-gateways/paystack';
import { RazorPayIcon } from '@components/icons/payment-gateways/razorpay';
import { StripeIcon } from '@components/icons/payment-gateways/stripe';
import Alert from '@components/ui/alert';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { useSettings } from '@framework/settings';
import { RadioGroup } from '@headlessui/react';
import { PaymentMethodName, paymentGatewayAtom } from '@store/checkout';
import { PaymentGateway } from '@type/index';
import cn from 'classnames';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';

interface PaymentGroupOptionProps {
  payment: PaymentMethodInformation;
  theme?: string
}

const PaymentGroupOption: React.FC<PaymentGroupOptionProps> = ({
  payment: { name, value, icon },
  theme
}) => {
  const { t } = useTranslation('common');
  return (
    <RadioGroup.Option value={value} key={value}>
      {({ checked }) => (
        <div
          className={cn(
            'relative flex h-full w-full cursor-pointer items-center justify-center rounded-[8px] border border-[#F3F3F3] p-4 text-center shadow-600',
            checked && '!border-[#212121]'
          )}
        >
          {icon ? (
            <>{icon}</>
          ) : (
            <span className="text-xs font-semibold text-heading">{name}</span>
          )}
        </div>
      )}
    </RadioGroup.Option>
  );
};

interface PaymentMethodInformation {
  name: string;
  value: PaymentMethodName;
  icon: any;
  component: React.FunctionComponent;
}

const PaymentGrid: React.FC<{ className?: string; theme?: 'bw' }> = ({
  className,
  theme,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gateway, setGateway] = useAtom(paymentGatewayAtom);
  const { t } = useTranslation('common');
  const { data, isLoading } = useSettings();
  const settings = data?.options;
  // If no payment gateway is set and cash on delivery also disable then cash on delivery will be on by default
  const isEnableCashOnDelivery =
    (!settings?.useCashOnDelivery && !settings?.paymentGateway) ||
    settings?.useCashOnDelivery;

  // default payment gateway
  // const defaultPaymentGateway = settings?.defaultPaymentGateway.toUpperCase();

  const [defaultGateway, setDefaultGateway] = useState(
    settings?.defaultPaymentGateway?.toUpperCase() || ''
  );
  const [cashOnDelivery, setCashOnDelivery] = useState(
    (!settings?.useCashOnDelivery && !settings?.paymentGateway) ||
      settings?.useCashOnDelivery
  );
  const [availableGateway, setAvailableGateway] = useState(
    settings?.paymentGateway || []
  );

  // FixME
  // @ts-ignore
  const AVAILABLE_PAYMENT_METHODS_MAP: Record<
    PaymentGateway,
    PaymentMethodInformation
  > = {
    STRIPE: {
      name: 'Stripe',
      value: PaymentGateway.STRIPE,
      icon: <StripeIcon />,
      component: PaymentOnline,
    },
    PAYPAL: {
      name: 'Paypal',
      value: PaymentGateway.PAYPAL,
      icon: <PayPalIcon />,
      // icon: '/payment/paypal.png',
      component: PaymentOnline,
    },
    RAZORPAY: {
      name: 'RazorPay',
      value: PaymentGateway.RAZORPAY,
      icon: <RazorPayIcon />,
      component: PaymentOnline,
    },
    MOLLIE: {
      name: 'Mollie',
      value: PaymentGateway.MOLLIE,
      icon: <MollieIcon />,
      component: PaymentOnline,
    },
    PAYSTACK: {
      name: 'Paystack',
      value: PaymentGateway.PAYSTACK,
      icon: <PayStack />,
      component: PaymentOnline,
    },
    IYZICO: {
      name: 'Iyzico',
      value: PaymentGateway.IYZICO,
      icon: <IyzicoIcon />,
      component: PaymentOnline,
    },
    CASH_ON_DELIVERY: {
      name: t('text-cash-on-delivery'),
      value: PaymentGateway.COD,
      icon: '',
      component: CashOnDelivery,
    },
  };

  // this is the actual useEffect hooks
  // useEffect(() => {
  //   if (settings && availableGateway) {
  //     // At first, team up the selected gateways.
  //     let selectedGateways = [];
  //     for (let i = 0; i < availableGateway.length; i++) {
  //       selectedGateways.push(availableGateway[i].name.toUpperCase());
  //     }

  //     // if default payment-gateway did not present in the selected gateways, then this will attach default with selected
  //     if (!selectedGateways.includes(defaultGateway)) {
  //       const pluckedGateway = PAYMENT_GATEWAYS.filter((obj) => {
  //         return obj.name.toUpperCase() === defaultGateway;
  //       });
  //       Array.prototype.push.apply(availableGateway, pluckedGateway);
  //     }

  //     availableGateway.forEach((gateway: any) => {
  //       setGateway(gateway?.name.toUpperCase() as PaymentGateway);
  //     });

  //     // TODO : Did not understand properly the planning here. about state
  //     // setGateway(
  //     //   settings?.paymentGateway[0]?.name.toUpperCase() as PaymentGateway
  //     // );
  //   } else {
  //     setGateway(PaymentGateway.COD);
  //   }
  // }, [isLoading, cashOnDelivery, defaultGateway, availableGateway]);

  useEffect(() => {
    if (settings && availableGateway) {
      setGateway(
        settings?.defaultPaymentGateway?.toUpperCase() as PaymentGateway
      );
    } else {
      setGateway(PaymentGateway.COD);
    }
  }, [isLoading, cashOnDelivery, defaultGateway, availableGateway]);

  const PaymentMethod = AVAILABLE_PAYMENT_METHODS_MAP[gateway];
  const Component = PaymentMethod?.component ?? CashOnDelivery;
  if (isLoading) {
    return <Spinner showText={false} />;
  }
  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="mb-5 block text-base font-semibold text-heading">
          {t('text-choose-payment')}
        </RadioGroup.Label>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* {settings?.paymentGateway && (
            <PaymentGroupOption
              theme={theme}
              payment={
                AVAILABLE_PAYMENT_METHODS_MAP[
                  settings?.paymentGateway?.toUpperCase() as PaymentGateway
                ]
              }
            />
          )} */}

          {settings?.useEnableGateway &&
            availableGateway &&
            availableGateway?.map((gateway: any, index: any) => {
              return (
                <Fragment key={index}>
                  <PaymentGroupOption
                    theme={theme}
                    payment={
                      AVAILABLE_PAYMENT_METHODS_MAP[
                        gateway?.name.toUpperCase() as PaymentGateway
                      ]
                    }
                  />
                </Fragment>
              );
            })}

          {cashOnDelivery && (
            <PaymentGroupOption
              theme={theme}
              payment={AVAILABLE_PAYMENT_METHODS_MAP[PaymentGateway.COD]}
            />
          )}
        </div>
      </RadioGroup>
      <div>
        <Component />
      </div>
    </div>
  );
};

export default PaymentGrid;
