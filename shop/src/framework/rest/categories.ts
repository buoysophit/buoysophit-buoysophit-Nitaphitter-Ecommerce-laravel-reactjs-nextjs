import {
  CategoriesQueryOptionsType,
  Category,
  CategoryPaginator
} from "@type/index";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import {
  useInfiniteQuery,
  useQuery,
} from "react-query";
import { mapPaginatorData } from "@framework/utils/data-mappers";
import client from '@framework/utils/index'
import { useRouter } from 'next/router';

export function useCategoriesInfinite(params: CategoriesQueryOptionsType) {
  const { locale } = useRouter();
  const formattedOptions = {
    ...params,
    language: locale,
  };
  const {
    data,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<CategoryPaginator, Error>(
    [API_ENDPOINTS.CATEGORIES, formattedOptions],
    ({ queryKey, pageParam }) => client.category.all(Object.assign({}, queryKey[1], pageParam)),
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

export const useCategories = (options: CategoriesQueryOptionsType) => {
  const { locale } = useRouter();
  const formattedOptions = {
    ...options,
    language: locale,
  };
  const { data, isLoading, error } = useQuery<Category[], Error>(
    [API_ENDPOINTS.CATEGORIES, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.category.find(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};


export const useCategory = (params: string) => {
  const { locale } = useRouter();
  const { data, isLoading, error } = useQuery<Category[], Error>(
    [API_ENDPOINTS.CATEGORIES, params],
    () => client.category.findOne({ slug: params, language: locale }),
    {
      keepPreviousData: true,
    }
  );

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};

export const useFeaturedCategories = (options: { limit: number }) => {
  const { locale } = useRouter();
  const formattedOptions = {
    ...options,
    language: locale,
  };
  const { data, isLoading, error } = useQuery<Category[], Error>(
    [API_ENDPOINTS.FEATURED_CATEGORIES, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.category.find(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};