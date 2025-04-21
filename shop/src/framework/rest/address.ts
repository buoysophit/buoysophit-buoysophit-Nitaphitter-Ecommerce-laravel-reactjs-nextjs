import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import client from '@framework/utils/index'
import { useUI } from "@contexts/ui.context";
import { useTranslation } from 'next-i18next';

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { closeModal } = useUI();
  const { t } = useTranslation();

  return useMutation(client.address.deleteAddress, {
    onSuccess: () => {
      toast.success(t('common:text-delete-success'));
      closeModal();
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(t(data?.message));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('me');
    },
  });
};
