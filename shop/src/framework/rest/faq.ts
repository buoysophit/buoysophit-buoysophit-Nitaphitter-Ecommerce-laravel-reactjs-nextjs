import client from '@framework/utils/index';
import { API_ENDPOINTS } from '@framework/utils/endpoints';
import { FaqsPaginator, FaqsQueryOptions } from '@type/index';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from 'react-query';

export function useFAQs(options?: FaqsQueryOptions) {
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
  } = useInfiniteQuery<FaqsPaginator, Error>(
    [API_ENDPOINTS.FAQS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.faqs.all(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
  function handleLoadMore() {
    fetchNextPage();
  }
  return {
    faqs: data?.pages.flatMap((page) => page.data) ?? [],
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
