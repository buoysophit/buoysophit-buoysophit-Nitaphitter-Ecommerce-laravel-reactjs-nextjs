import { Type, TypeQueryOptionsType, TypePaginator } from '@type/index';
import { API_ENDPOINTS } from '@framework/utils/endpoints';
import { useInfiniteQuery, useQuery } from 'react-query';
import { mapPaginatorData } from '@framework/utils/data-mappers';
import client from '@framework/utils/index';
import { useRouter } from 'next/router';

export function useBrandsInfinite(params: TypeQueryOptionsType) {
  const { locale } = useRouter();
  const formattedOptions = {
    ...params,
    language: locale,
  };

  const { data, fetchNextPage, isLoading, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<TypePaginator, Error>(
      [API_ENDPOINTS.TYPE, formattedOptions],
      ({ queryKey, pageParam }) =>
        client.brands.all(Object.assign({}, queryKey[1], pageParam)),
      {
        getNextPageParam: ({ current_page, last_page }) =>
          last_page > current_page && { page: current_page + 1 },
      }
    );

  return {
    data: data?.pages?.flatMap((page) => page?.data) ?? [],
    paginatorInfo: mapPaginatorData(data?.pages[data.pages.length - 1]),
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

export const useBrands = (options: TypeQueryOptionsType) => {
  const { locale } = useRouter();
  const formattedOptions = {
    ...options,
    language: locale,
  };

  return useQuery<Type[], Error>(
    [API_ENDPOINTS.TYPE, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.brands.find(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );
};

export const useBrand = (slug: string) => {
  const { locale } = useRouter();
  const { data, isLoading, error } = useQuery<Type[], Error>(
    [API_ENDPOINTS.TYPE, { slug, language: locale }],
    () =>
      client.brands.findOne({ slug, language: locale! }),
    {
      enabled: Boolean(slug),
    }
  );

  return {
    type: data ?? [],
    loading: isLoading,
    error,
  };
};
