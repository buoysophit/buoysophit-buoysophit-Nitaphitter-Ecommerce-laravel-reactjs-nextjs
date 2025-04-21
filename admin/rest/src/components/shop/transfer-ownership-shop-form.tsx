import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import TextArea from '@/components/ui/text-area';
import { useTransferShopOwnershipMutation } from '@/data/shop';
import { Shop, TransferShopOwnershipInput, User } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { transferShopOwnershipValidationSchema } from './transfer-shop-ownership-validation-schema';
import { useCallback } from 'react';

type Props = {
  shop: Shop;
  vendors: User[];
};
type FormValues = {
  shop_id?: string;
  vendor: {
    id: number;
    name: string;
  };
  message?: string;
};

const TransferShopOwnershipForm = ({ shop, vendors }: Props) => {
  const { t } = useTranslation();
  const { mutate: transferOwnership, isLoading: transferring } =
    useTransferShopOwnershipMutation();

  const { handleSubmit, control, register } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: {
      shop_id: shop?.id,
      vendor: {
        id: undefined,
        name: '',
      },
      message: '',
    },
    resolver: yupResolver(transferShopOwnershipValidationSchema),
  });

  const onSubmit = useCallback((values: FormValues) => {
    const input: TransferShopOwnershipInput = {
      shop_id: shop?.id!,
      vendor_id: values.vendor?.id!,
      message: values?.message,
    };
    transferOwnership(input);
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
        <Description
          title={t('form:form-title-transfer-shop-ownership')}
          details={t('form:shop-transfer-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-shop-name')}
            name="name"
            value={shop.name}
            disabled
            variant="outline"
            className="mb-5"
          />
          <SelectInput
            name="vendor"
            control={control}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.id}
            options={vendors}
            label={t('form:input-label-vendor')}
            required
          />
          <TextArea
            label="Message towards vendor."
            {...register('message')}
            placeholder="Don't share any personal information here (Optional)"
            variant="outline"
            className="col-span-2 mt-5 mb-5"
          />
        </Card>
      </div>

      <StickyFooterPanel className="z-0">
        <div className="mb-5 text-end">
          <Button loading={transferring} disabled={transferring}>
            {t('form:button-label-transfer')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
};

export default TransferShopOwnershipForm;
