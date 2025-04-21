import { Form } from '@components/ui/forms/form';
import Input from '@components/ui/input';
import Label from '@components/ui/label';
import { useUI } from '@contexts/ui.context';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import MobileOtpInput from 'react-otp-input';
import Button from '@components/ui/button';

interface OtpRegisterFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
}

type OtpRegisterFormValues = {
  email: string;
  name: string;
  code: string;
};

const otpLoginFormSchemaForNewUser = yup.object().shape({
  email: yup
    .string()
    .email('error-email-format')
    .required('error-email-required'),
  name: yup.string().required('error-name-required'),
  code: yup.string().required('error-code-required'),
});

function OtpRegisterForm({
  onSubmit,
  loading,
}: OtpRegisterFormProps) {
  const { t } = useTranslation('common');
  const { closeModal } = useUI();
  return (
    <Form<OtpRegisterFormValues>
      onSubmit={onSubmit}
      validationSchema={otpLoginFormSchemaForNewUser}>
      {({ register, control, formState: { errors } }) => (
        <>
          <Input
            labelKey={t('text-email')}
            {...register('email')}
            type="email"
            variant="outline"
            className="mb-5"
            errorKey={t(errors.email?.message!)}
          />
          <Input
            labelKey={t('text-name')}
            {...register('name')}
            variant="outline"
            className="mb-5"
            errorKey={t(errors.name?.message!)}
          />

          <div className="mb-5">
            <Label>{t('text-otp-code')}</Label>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <MobileOtpInput
                  value={value}
                  onChange={onChange}
                  numInputs={6}
                  renderSeparator={
                    <span className="hidden sm:inline-block">-</span>
                  }
                  renderInput={(props) => <input {...props} />}
                  containerStyle="flex items-center justify-between -mx-2"
                  inputStyle="flex items-center justify-center !w-full mx-2 sm:!w-9 !px-0 appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-0 focus:ring-0 border border-heading rounded focus:border-accent h-12"
                />
              )}
              name="code"
              defaultValue=""
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Button
              variant="outline"
              className="bg-red-600 text-white border-red-600 hover:border-red-500 hover:bg-red-500"
              onClick={closeModal}
            >
              {t('text-cancel')}
            </Button>

            <Button loading={loading} disabled={loading}>
              {t('text-verify-code')}
            </Button>
          </div>
        </>
      )}
    </Form>
  )
}

export default OtpRegisterForm