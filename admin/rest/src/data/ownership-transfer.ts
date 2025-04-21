import Router, { useRouter } from 'next/router';
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import type { UseInfiniteQueryOptions } from 'react-query';
import {
  OwnershipTransferPaginator,
  OwnershipTransferQueryOptions,
} from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { ownershipTransferClient } from '@/data/client/ownership-transfer';

// Read Single Ownership transfer request

export const useOwnerShipTransferQuery = ({
  transaction_identifier,
  language,
  shop_id,
  request_view_type,
}: {
  transaction_identifier: string;
  language: string;
  shop_id?: string;
  request_view_type?: string;
}) => {
  const { data, error, isLoading, refetch } = useQuery<any, Error>(
    [
      API_ENDPOINTS.OWNERSHIP_TRANSFER,
      { transaction_identifier, language, shop_id },
    ],
    () =>
      ownershipTransferClient.get({
        transaction_identifier,
        language,
        shop_id,
        request_view_type,
      }),
  );

  return {
    ownershipTransfer: data,
    error,
    loading: isLoading,
    refetch,
  };
};

// Read All Ownership transfer request

export const useOwnerShipTransfersQuery = (
  options: Partial<OwnershipTransferQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<
    OwnershipTransferPaginator,
    Error
  >(
    [API_ENDPOINTS.OWNERSHIP_TRANSFER, options],
    ({ queryKey, pageParam }) =>
      ownershipTransferClient.paginated(
        Object.assign({}, queryKey[1], pageParam),
      ),
    {
      keepPreviousData: true,
    },
  );

  return {
    ownershipTransfer: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// Read All Ownership transfer request paginated

export const useOwnerShipTransferLoadMoreQuery = (
  options: Partial<OwnershipTransferQueryOptions>,
  config?: UseInfiniteQueryOptions<OwnershipTransferPaginator, Error>,
) => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<OwnershipTransferPaginator, Error>(
    [API_ENDPOINTS.OWNERSHIP_TRANSFER, options],
    ({ queryKey, pageParam }) =>
      ownershipTransferClient.all(Object.assign({}, queryKey[1], pageParam)),
    {
      ...config,
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    },
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    ownershipTransfer: data?.pages.flatMap((page) => page?.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    error,
    hasNextPage,
    loading: isLoading,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
  };
};

// Create Ownership transfer request

export const useCreateOwnerTransferMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();

  return useMutation(ownershipTransferClient.create, {
    onSuccess: async () => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.ownershipTransferRequest.list}`
        : Routes.ownershipTransferRequest.list;
      await Router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.OWNERSHIP_TRANSFER);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Update Ownership transfer request

export const useUpdateOwnerTransferMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(ownershipTransferClient.update, {
    onSuccess: async (data) => {
      const generateRedirectUrl = router.query.shop
        ? `/${router.query.shop}${Routes.ownershipTransferRequest.list}`
        : Routes.ownershipTransferRequest.list;
      await router.push(generateRedirectUrl, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.OWNERSHIP_TRANSFER);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// Delete Ownership transfer request

export const useDeleteOwnerTransferMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(ownershipTransferClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.OWNERSHIP_TRANSFER);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

// approve Ownership transfer request

export const useApproveOwnerTransferMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(ownershipTransferClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.OWNERSHIP_TRANSFER);
    },
  });
};

// disapprove Ownership transfer request

export const useDisApproveOwnerTransferMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(ownershipTransferClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.OWNERSHIP_TRANSFER);
    },
  });
};
