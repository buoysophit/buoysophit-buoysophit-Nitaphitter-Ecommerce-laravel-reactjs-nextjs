import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { BecomeSeller } from '@/types';
import { becomeSellerClient } from '@/data/client/become-seller';

export const useBecomeSellerQuery = ({ language }: { language: string }) => {
  const { data, error, isLoading } = useQuery<BecomeSeller, Error>(
    [API_ENDPOINTS.BECAME_SELLER, { language }],
    () => becomeSellerClient.all({ language }),
  );

  return {
    becomeSellerData: data,
    error,
    loading: isLoading,
  };
};

export const useUpdateBecomeSellerMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(becomeSellerClient.update, {
    onError: (error) => {
      console.log(error);
    },
    onSuccess: async (data) => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BECAME_SELLER);
    },
  });
};
