import { useTranslation } from 'next-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import client from '@framework/utils/index'
import { useUI } from '@contexts/ui.context';
import { API_ENDPOINTS } from './utils/endpoints';

export const useUpdateCustomer = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useUI();
  return useMutation(client.contact.updateCustomer, {
    onSuccess: (data) => {
      if (data?.id) {
        toast.success(`${t('profile-update-successful')}`);
        closeModal();
      }
    },
    onError: () => {
      toast.error(`${t('error-something-wrong')}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMER);
    },
  });
};