import Button from '@components/ui/button';
import { useTranslation  } from 'next-i18next';
import Label from '@components/ui/label';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import Input from '@components/ui/input';
import { CheckBox } from '@components/ui/checkbox';
import Alert from '@components/ui/alert';
import isEmpty from 'lodash/isEmpty';
import { useUser } from '@framework/auth';
import { useUI } from '@contexts/ui.context';
import { useCards } from '@framework/card';

interface Props {
  handleSubmit: any;
  type: 'checkout' | 'save_card';
  loading: boolean;
  changeSaveCard?: any;
  saveCard?: any;
  changeDefaultCard?: any;
  defaultCard?: any;
  cardError: any;
}

const StripeBaseForm: React.FC<Props> = ({
  handleSubmit,
  type = 'save_card',
  loading = false,
  changeSaveCard,
  saveCard,
  changeDefaultCard,
  defaultCard,
  cardError,
}) => {
  const { t } = useTranslation('common');
  const { isAuthorized } = useUser();
  const {
    openModal,
    closeModal,
    setModalData,
    setModalView,
    modalData: { paymentGateway, paymentIntentInfo, trackingNumber },
  } = useUI();
  const { cards, isLoading, error } = useCards();

  const cardInputStyle = {
    base: {
      '::placeholder': {
        color: '#5A5A5A',
      },
    },
  };

  const backModal = () => {
    setModalData({
      paymentGateway,
      paymentIntentInfo,
      trackingNumber,
    });
    setModalView('PAYMENT_MODAL');
    return openModal();
  };

  return (
    <div className="bg-white mx-auto rounded-lg w-full md:w-[750px] border border-gray-300 payment-modal relative h-full max-w-md overflow-hidden bg-light md:h-auto md:min-h-0 lg:max-w-[46rem]">
      <div className="p-6 lg:p-12">
        {!isEmpty(cardError) ? (
          <Alert className="mb-4" message={cardError} variant="error" />
        ) : (
          ''
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label>
              <span className="mb-2 block text-sm font-semibold text-heading">
                {t('text-name')}
              </span>
              <Input
                name="owner_name"
                placeholder={t('text-name')}
                variant="outline"
                required
                inputClassName="py-3 !bg-white focus:border-gray-300"
              />
            </label>
          </div>
          <div>
            <Label className="mb-0 block">
              <span className="mb-2 block text-sm font-semibold text-heading">
                {t('text-card-number')}
              </span>
              <CardNumberElement
                options={{
                  showIcon: true,
                  style: cardInputStyle,
                  placeholder: t('text-card-number'),
                }}
                className="h-auto rounded-md border border-solid border-gray-100 bg-white py-[14px] px-4 text-black transition-all duration-300"
              />
            </Label>
          </div>

          <div className="flex flex-wrap gap-5 lg:flex-nowrap">
            <Label className="mb-0 max-w-full basis-full lg:max-w-[50%] lg:basis-1/2">
              <span className="mb-2 block text-sm font-semibold text-heading">
                {t('text-card-expiry')}
              </span>
              <CardExpiryElement
                options={{
                  style: cardInputStyle,
                  placeholder: t('text-expire-date-placeholder'),
                }}
                className="h-auto rounded-md border border-solid border-gray-100 bg-white py-[14px] px-4 text-black transition-all duration-300"
              />
            </Label>

            <Label className="mb-0 max-w-full basis-full lg:max-w-[50%] lg:basis-1/2">
              <span className="mb-2 block text-sm font-semibold text-heading">
                {t('text-card-cvc')}
              </span>
              <CardCvcElement
                options={{
                  style: cardInputStyle,
                  placeholder: t('text-card-cvc'),
                }}
                className="h-auto rounded-md border border-solid border-gray-100 bg-white py-[14px] px-4 text-black transition-all duration-300"
              />
            </Label>
          </div>

          {isAuthorized && type === 'checkout' && (
            <CheckBox
              name="save_card"
              label={t('text-save-card')}
              onChange={changeSaveCard}
              checked={saveCard}
            />
          )}

          {isAuthorized && type === 'save_card' && (
            <CheckBox
              name="make_default_card"
              label={t('text-add-default-card')}
              onChange={changeDefaultCard}
              checked={defaultCard}
            />
          )}

          <div className="space-x-4 lg:mt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="StripePay px-11 text-sm shadow-none"
            >
              {type === 'checkout' ? t('text-pay') : t('text-save')}
            </Button>
            {isAuthorized && type === 'checkout' && (
              <Button
                type="submit"
                variant="smoke"
                className="px-9"
                disabled={!!loading}
                onClick={closeModal}
              >
                {t('pay-latter')}
              </Button>
            )}
            {isAuthorized && cards?.length > 0 && type === 'checkout' && (
              <Button
                disabled={!!loading}
                variant="smoke"
                className="cursor-pointer"
                onClick={backModal}
              >
                {t('text-back')}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StripeBaseForm;
