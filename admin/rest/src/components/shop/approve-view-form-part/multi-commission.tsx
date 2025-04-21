import { ChatIconNew } from '@/components/icons/chat';
import { CloseIconNew } from '@/components/icons/close-icon';
import {
  FormValues,
  MultiCommissionProps,
} from '@/components/shop/approve-shop';
//@ts-ignore
import { approveShopWithCommissionSchema } from '@/components/shop/shop-validation-schema';
import Button from '@/components/ui/button';
import { Form } from '@/components/ui/form/form';
import Input from '@/components/ui/input';
import { useModalAction } from '@/components/ui/modal/modal.context';
import Scrollbar from '@/components/ui/scrollbar';
import SwitchInput from '@/components/ui/switch-input';
import { useTranslation } from 'next-i18next';

const MultiCommission = ({
  data,
  onSubmit,
  loading,
  creating,
  createAConversations,
}: MultiCommissionProps) => {
  const { closeModal } = useModalAction();
  const { t } = useTranslation();
  return (
    <div className="rounded-[0.625rem] bg-light lg:w-[50rem] m-auto w-full max-w-4xl">
      <div className="flex justify-between items-center py-5 md:px-8 px-4 border-b border-b-black border-opacity-10 text-black">
        <h2 className="font-semibold text-lg leading-none">
          {t('form:text-shop-approve-modal-title')}
        </h2>
        <div className="cursor-pointer p-2 -mr-2 leading-none text-base transition-colors hover:text-black/70">
          <CloseIconNew onClick={closeModal} />
        </div>
      </div>

      <div className="md:p-8 p-4 space-y-5 border-b border-b-black border-opacity-10">
        {data && data?.content ? (
          <>
            <h3 className="text-black font-medium text-sm leading-none mb-3">
              {t('form:text-shop-approve-modal-message-title')}
            </h3>
            <div className="bg-[#F9FAFB] text-[#374151] text-sm border border-[#E5E7EB] rounded p-4 h-40 leading-[150%]">
              <Scrollbar
                className="h-full w-full"
                options={{
                  scrollbars: {
                    autoHide: 'scroll',
                  },
                }}
              >
                <p className="pr-2">{data?.content}</p>
              </Scrollbar>
            </div>
          </>
        ) : (
          ''
        )}
        <Button
          onClick={createAConversations}
          disabled={creating}
          loading={creating}
          className="cursor-pointer gap-2 rounded-md md:px-5 h-auto md:py-4 p-3 p text-sm font-semibold"
        >
          <ChatIconNew className="md:text-xl" />
          {t('form:text-shop-approve-modal-message-button')}
        </Button>
      </div>

      <Form<FormValues>
        validationSchema={approveShopWithCommissionSchema}
        onSubmit={onSubmit}
        options={{
          shouldUnregister: true,
          defaultValues: {
            isCustomCommission:
              data && data?.enable ? Boolean(data?.enable) : false,
            admin_commission_rate:
              data && data?.quote ? Number(data?.quote) : 0,
          },
        }}
        className="md:p-8 p-4"
      >
        {({ register, control, watch, formState: { errors } }) => {
          const isCustomCommission = watch('isCustomCommission');
          return (
            <div className="flex flex-col">
              <SwitchInput
                name="isCustomCommission"
                control={control}
                label={t('form:text-shop-approve-switch')}
                className="flex flex-row-reverse justify-between"
                labelClassName="text-base font-medium text-[#111827]"
              />
              {isCustomCommission ? (
                <Input
                  label={t('form:input-label-admin-commission-rate')}
                  {...register('admin_commission_rate')}
                  variant="outline"
                  className="mt-8"
                  inputClassName="border-[#E5E7EB]"
                  labelClassName="font-medium text-[#111827]"
                  required
                  error={t(errors.admin_commission_rate?.message!)}
                />
              ) : (
                ''
              )}
              <div className="mt-5">
                <Button
                  type="submit"
                  className="rounded-md"
                  loading={loading}
                  disabled={loading}
                >
                  {isCustomCommission
                    ? t('form:button-label-submit')
                    : t('form:text-shop-approve-button-title')}
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

export { MultiCommission };
