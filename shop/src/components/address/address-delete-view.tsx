import ConfirmationCard from '@components/ui/cards/confirmation';
import { useDeleteAddress } from '@framework/address';
import { Address } from '@type/index';
import React from 'react';
import { useUI } from '@contexts/ui.context';

type Props = {
  data: Address;
};

const AddressDeleteView: React.FC<Props> = ({ data }) => {
  const { mutate: deleteAddressById, isLoading } = useDeleteAddress();
  const { closeModal } = useUI();

  function handleDelete() {
    deleteAddressById({ id: data?.addressId });
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={isLoading}
    />
  );
};

export default AddressDeleteView;
