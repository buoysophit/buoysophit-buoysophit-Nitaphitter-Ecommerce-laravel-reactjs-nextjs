import { DefaultCommission } from '@/components/shop/approve-view-form-part/default-commission';
import { MultiCommission } from '@/components/shop/approve-view-form-part/multi-commission';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useCreateConversations } from '@/data/conversations';
import { useApproveShopMutation } from '@/data/shop';
import { useCallback } from 'react';

type FormValues = {
  admin_commission_rate: number;
  isCustomCommission: boolean;
};

const ApproveShopView = () => {
  const { mutate: approveShopMutation, isLoading: loading } =
    useApproveShopMutation();
  const { mutate: createConversations, isLoading: creating } =
    useCreateConversations();
  const {
    data: { id: shopId, data },
  } = useModalState();
  const { closeModal } = useModalAction();

  const onSubmit = useCallback(
    ({ admin_commission_rate, isCustomCommission }: FormValues) => {
      approveShopMutation({
        id: shopId as string,
        admin_commission_rate: Number(admin_commission_rate),
        isCustomCommission: Boolean(isCustomCommission),
      });
      closeModal();
    },
    [],
  );

  const createAConversations = useCallback(() => {
    createConversations({
      shop_id: shopId,
      via: 'admin',
    });
  }, []);
console.log('data',data);
  return data?.multiCommission ? (
    <MultiCommission
      data={data}
      createAConversations={createAConversations}
      creating={creating}
      loading={loading}
      onSubmit={onSubmit}
    />
  ) : (
    <DefaultCommission loading={loading} onSubmit={onSubmit} />
  );
};

export default ApproveShopView;
