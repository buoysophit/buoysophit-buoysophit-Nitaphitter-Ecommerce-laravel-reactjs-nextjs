import { useQuery, useQueryClient, useMutation } from 'react-query';
import { Card } from '@type/index';
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import client from '@framework/utils/index'
import { useUI } from "@contexts/ui.context";
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useUser } from '@framework/auth';

export function useCards(params?: any, options?: any) {
  const { isAuthorized } = useUser();

  const { data, isLoading, error } = useQuery<Card[], Error>(
    [API_ENDPOINTS.CARDS, params],
    () => client.cards.all(params),
    {
      enabled: isAuthorized,
      ...options,
    }
  );

  return {
    cards: data ?? [],
    isLoading,
    error,
  };
}

export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { closeModal } = useUI();

  const { mutate, isLoading, error } = useMutation(client.cards.remove, {
    onSuccess: () => {
      closeModal();
      toast.success(`${t('common:card-successfully-deleted')}`);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CARDS);
    },
  });

  return {
    deleteCard: mutate,
    isLoading,
    error,
  };
};

export function useAddCards(method_key?: any) {
  const { t } = useTranslation();
  const { closeModal } = useUI();
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(
    client.cards.addPaymentMethod,
    {
      onSuccess: () => {
        closeModal();
        toast.success(`${t('common:card-successfully-add')}`, {
          toastId: 'success',
        });
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};
        toast.error(`${t(data?.message)}`, {
          toastId: 'error',
        });
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CARDS);
      },
    }
  );

  return {
    addNewCard: mutate,
    isLoading,
    error,
  };
}

export function useDefaultPaymentMethod() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation(
    client.cards.makeDefaultPaymentMethod,
    {
      onSuccess: () => {
        toast.success(`${t('common:set-default-card-message')}`);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CARDS);
      },
    }
  );

  return {
    createDefaultPaymentMethod: mutate,
    isLoading,
    error,
  };
}
