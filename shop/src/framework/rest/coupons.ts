import { useInfiniteQuery, useMutation } from 'react-query';
import { useRouter } from 'next/router';
import { CouponPaginator, CouponQueryOptions } from '@type/index';
import { API_ENDPOINTS } from './utils/endpoints';
import client from '@framework/utils/index';
import { mapPaginatorData } from './utils/data-mappers';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { couponAtom } from '@store/checkout';

export function useCoupons(
  options?: Partial<CouponQueryOptions>,
  config?: any,
) {
  const { locale } = useRouter();

  const formattedOptions = {
    ...options,
    language: locale,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<CouponPaginator, Error>(
    [API_ENDPOINTS.COUPONS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.coupons.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
      ...config,
    },
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    coupons: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? mapPaginatorData(data?.pages[data.pages.length - 1])
      : null,
    isLoading,
    error,
    isFetching,
    isLoadingMore: isFetchingNextPage,
    loadMore: handleLoadMore,
    hasMore: Boolean(hasNextPage),
  };
}

export function useVerifyCoupon() {
  const { t } = useTranslation();
  const [_, applyCoupon] = useAtom(couponAtom);
  let [formError, setFormError] = useState<any>(null);
  const { mutate, isLoading } = useMutation(client.coupons.verify, {
    onSuccess: (data: any) => {
      if (!data.is_valid) {
        setFormError({
          code: t(`common:${data?.message}`),
        });
      }
      applyCoupon(data?.coupon);
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
    },
  });

  return { mutate, isLoading, formError, setFormError };
}
