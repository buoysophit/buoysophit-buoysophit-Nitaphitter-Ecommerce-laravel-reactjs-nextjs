import {
  FormValues,
  MultiCommissionProps,
} from '@/components/shop/approve-shop';
import { approveShopSchema } from '@/components/shop/shop-validation-schema';
import Button from '@/components/ui/button';
import { Form } from '@/components/ui/form/form';
import Input from '@/components/ui/input';
import { useTranslation } from 'next-i18next';

const DefaultCommission = ({
  onSubmit,
  loading,
}: Pick<MultiCommissionProps, 'onSubmit' | 'loading'>) => {
  const { t } = useTranslation();
  return (
    <Form<FormValues> onSubmit={onSubmit} validationSchema={approveShopSchema}>
      {({ register, formState: { errors } }) => (
        <div className="rounded bg-light p-5 sm:w-[24rem] m-auto w-full max-w-sm">
          <Input
            label={t('form:input-label-admin-commission-rate')}
            {...register('admin_commission_rate')}
            defaultValue="10"
            variant="outline"
            className="mb-4"
            inputClassName="border-[#E5E7EB]"
            labelClassName="font-medium text-[#111827]"
            required
            error={t(errors.admin_commission_rate?.message!)}
          />
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="ms-auto"
          >
            {t('form:button-label-submit')}
          </Button>
        </div>
      )}
    </Form>
  );
};

export { DefaultCommission };
