import { useMutation, useQueryClient } from 'react-query';
import client from '@framework/utils/index'
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from "@framework/utils/endpoints";

export const useVerifyCheckout = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(client.orders.verifyCheckout, {
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(t(data?.message));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.ORDER);
    },
  });
};