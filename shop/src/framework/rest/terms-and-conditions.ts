
import { TermsAndConditionsPaginator, TermsAndConditionsQueryOptions } from '@type/index';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from 'react-query';
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import client from '@framework/utils/index'

export function useTermsAndConditions(
  options?: Partial<TermsAndConditionsQueryOptions>,
  config?: any
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
    isFetchingNextPage,
  } = useInfiniteQuery<TermsAndConditionsPaginator, Error>(
    [API_ENDPOINTS.TERMS_AND_CONDITIONS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.termsAndConditions.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
      ...config
    }
  );

  function handleLoadMore() {
    fetchNextPage();
  }

  return {
    termsAndConditions: data?.pages?.flatMap((page) => page.data) ?? [],
    paginatorInfo: Array.isArray(data?.pages)
      ? data?.pages[data.pages.length - 1]
      : null,
    hasNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    error,
    loadMore: handleLoadMore,
  };
}
