import { API_ENDPOINTS } from '@framework/utils/endpoints';
import { useQuery } from "react-query";
import { Instagram } from "@type/index";
import client from '@framework/utils/index'

export const useInstagram = (options: { limit: number }) => {
  const { data, isLoading, error } = useQuery<Instagram[], Error>(
    [API_ENDPOINTS.INSTAGRAM, options],
    ({ queryKey, pageParam }) =>
      client.instagram.get(Object.assign({}, queryKey[1], pageParam)),
    {
      staleTime: 60 * 60 * 1000,
    }
  );
  return {
    data: data ?? [],
    isLoading,
    error,
  };
};