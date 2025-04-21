import MobileOtpInput from 'react-otp-input';
import Button from '@components/ui/button';
import { Form } from '@components/ui/forms/form';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import { useUI } from '@contexts/ui.context';
import Label from '@components/ui/label';

type OptCodeFormProps = {
  code: string;
};

interface OtpLoginFormForAllUserProps {
  onSubmit: (formData: OptCodeFormProps) => void;
  isLoading: boolean;
}

const otpLoginFormSchemaForExistingUser = yup.object().shape({
  code: yup.string().required('error-code-required'),
});

export default function OtpCodeForm({
  onSubmit,
  isLoading,
}: OtpLoginFormForAllUserProps) {
  const { t } = useTranslation('common');
  const { closeModal } = useUI();

  return (
    <div className="space-y-5 rounded border border-gray-200 p-5">
      <Form<OptCodeFormProps>
        onSubmit={onSubmit}
        validationSchema={otpLoginFormSchemaForExistingUser}
      >
        {({ control }) => (
          <>
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
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Button
                variant="outline"
                onClick={closeModal}
                className="hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                {t('text-cancel')}
              </Button>
              <Button loading={isLoading} disabled={isLoading}>
                {t('text-verify-code')}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
