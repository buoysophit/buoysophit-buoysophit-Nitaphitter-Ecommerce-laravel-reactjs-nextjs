import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteOwnerTransferMutation } from '@/data/ownership-transfer';

const OwnershipTransferDeleteView = () => {
  const { mutate: deleteOwnershipTransfer, isLoading: loading } =
    useDeleteOwnerTransferMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  function handleDelete() {
    deleteOwnershipTransfer({
      id: data,
    });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default OwnershipTransferDeleteView;
