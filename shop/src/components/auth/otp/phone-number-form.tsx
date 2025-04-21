import { Controller, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { Form } from '@components/ui/forms/form';
import PhoneInput from '@components/ui/forms/phone-input';
import * as yup from 'yup';
import Button from '@components/ui/button';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';

type FormValues = {
  phone_number: string;
};

const checkoutContactSchema = yup.object().shape({
  phone_number: yup.string().required('error-contact-required'),
});

interface PhoneNumberFormProps {
  onSubmit: SubmitHandler<FormValues>;
  phoneNumber?: string;
  isLoading?: boolean;
  view?: 'login';
  variant?: 'inline' | 'default';
}
export default function PhoneNumberForm({
  phoneNumber,
  onSubmit,
  isLoading,
  view,
  variant = 'default',
}: PhoneNumberFormProps) {
  const { t } = useTranslation('common');

  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      validationSchema={checkoutContactSchema}
      className="w-full"
      useFormProps={{
        defaultValues: {
          phone_number: phoneNumber,
        },
      }}
    >
      {({ control, formState: { errors } }) => (
        <div className="flex flex-col">
          <div className="flex w-full items-center sm:min-w-[360px] gap-4 sm:gap-0 sm:flex-nowrap flex-wrap">
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country="us"
                  inputClass={twMerge(
                    classNames(
                      '!p-0 ltr:!pr-4 rtl:!pl-4 ltr:!pl-14 rtl:!pr-14 !flex !items-center !w-full !appearance-none !transition !duration-300 !ease-in-out !text-heading !text-sm focus:!outline-none focus:!ring-0 !border !border-gray-300 !rounded focus:!border-accent !h-[52px]',
                      variant === 'default'
                        ? 'sm:ltr:!border-r-0 sm:rtl:!border-l-0 sm:ltr:!rounded-r-none sm:rtl:!rounded-l-none'
                        : '!h-12',
                    ),
                  )}
                  dropdownClass="focus:!ring-0 !border !border-gray-300 !shadow-350"
                  {...field}
                  disabled={isLoading}
                />
              )}
            />
            {variant === 'default' ? (
              <Button
                className="!text-sm w-full sm:w-auto sm:ltr:!rounded-l-none sm:rtl:!rounded-r-none grow-0 shrink-0 basis-auto"
                loading={isLoading}
                disabled={isLoading}
              >
                {view === 'login' ? (
                  t('text-send-otp')
                ) : (
                  <>
                    {Boolean(phoneNumber) ? t('text-update') : t('text-add')}{' '}
                    {t('nav-menu-contact')}
                  </>
                )}
              </Button>
            ) : (
              ''
            )}
          </div>
          {variant === 'inline' ? (
            <div className="text-right mt-6">
              <Button
                // className="!text-sm"
                loading={isLoading}
                disabled={isLoading}
              >
                {t('text-save')}
              </Button>
            </div>
          ) : (
            ''
          )}
          {errors?.phone_number?.message && (
            <p className="mt-2 text-xs text-red-500 ltr:text-left rtl:text-right">
              {t(errors?.phone_number.message)}
            </p>
          )}
        </div>
      )}
    </Form>
  );
}
