import {
  ProductsQueryOptionsType,
  Product,
  ProductPaginator
} from "@type/index";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import {
  useInfiniteQuery,
  useQuery,
} from "react-query";
import client from '@framework/utils/index'
import { useRouter } from 'next/router';

export function useProductsInfinite(params: ProductsQueryOptionsType) {
  const { locale } = useRouter();
  const formattedOptions = {
    ...params,
    language: locale,
  };
  return useInfiniteQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ queryKey, pageParam }) => client.product.find(Object.assign({}, queryKey[1], pageParam)),
    {
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
}


export const useProducts = (options: ProductsQueryOptionsType) => {
  const { locale } = useRouter();
  const formattedOptions = {
    ...options,
    language: locale,
  };
  const { data, isLoading, error } = useQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.PRODUCTS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.product.find(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    // @ts-ignore
    data: data?.data ?? [],
    isLoading,
    error,
  };
};

export const useProduct = ({ slug }: { slug: string }) => {
  const { locale: language } = useRouter();
  const { data, isLoading, error } = useQuery<Product, Error>(
    [API_ENDPOINTS.PRODUCTS, { slug, language }],
    () => client.product.findOne({ slug, language })
  );

  return {
    data: data ?? [],
    isLoading,
    error,
  };
};

export const usePopularProducts = (options: {
  limit: number;
  shop_id?: number;
}) => {
  const { locale } = useRouter();
  const formattedOptions = {
    ...options,
    language: locale,
  };
  const { data, isLoading, error } = useQuery<ProductPaginator, Error>(
    [API_ENDPOINTS.POPULAR_PRODUCTS, formattedOptions],
    ({ queryKey, pageParam }) =>
      client.product.find(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );

  return {
    // @ts-ignore
    data: data?.data ?? [],
    isLoading,
    error,
  };
};
