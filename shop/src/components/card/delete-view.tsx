import ConfirmationCard from '@components/ui/cards/confirmation';
import { useUI } from "@contexts/ui.context";
import { useDeleteCard } from '@framework/card';

export default function CardDeleteView() {
  const {
    modalData : { card_id }
  } = useUI();
  const { closeModal } = useUI();
  const { deleteCard, isLoading } = useDeleteCard();
  function handleDelete() {
    if (!card_id) {
      return;
    }
    deleteCard({ id: card_id });
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={isLoading}
    />
  );
}
