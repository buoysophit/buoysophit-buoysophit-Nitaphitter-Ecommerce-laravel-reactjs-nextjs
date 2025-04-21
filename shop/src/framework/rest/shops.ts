import { ShopsQueryOptionsType, Shop, ShopPaginator, ShopMaintenanceEvent } from '@type/index';
import { API_ENDPOINTS } from '@framework/utils/endpoints';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import client from '@framework/utils/index';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export function useShops(params: ShopsQueryOptionsType) {
  const { locale } = useRouter();
  const formattedOptions = {
    ...params,
    language: locale,
  };
  return useInfiniteQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.SHOPS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.shop.find(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    },
  );
}

export const useShop = (
  { slug }: { slug: string; enabled?: boolean },
  options?: any,
) => {
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.SHOPS, { slug }],
    () => client.shop.findOne({ slug }),
    options,
  );
};

export const useShopMaintenanceEvent = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { reload } = router;
  const { mutate: ShopMaintenanceEventRequest, isLoading } = useMutation(
    client.shop.shopMaintenanceEvent,
    {
      onSuccess: () => {
        reload();
      },
      onError: (error) => {
        toast.error(`${t('error-something-wrong')}`);
      },
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    },
  );
  function createShopMaintenanceEventRequest(input: ShopMaintenanceEvent) {
    ShopMaintenanceEventRequest(input);
  }
  return {
    createShopMaintenanceEventRequest,
    isLoading,
  };
};