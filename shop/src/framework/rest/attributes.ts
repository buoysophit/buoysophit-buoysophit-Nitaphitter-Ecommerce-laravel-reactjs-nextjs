import { Attribute } from '@type/index';
import { API_ENDPOINTS } from '@framework/utils/endpoints';
import { useQuery } from 'react-query';
import client from '@framework/utils/index'
import { useRouter } from 'next/router';
import { AttributeQueryOptions } from "@type/index";

export const useAttributes = () => {
  const { locale } = useRouter();

  const { data, isLoading, error } = useQuery<Attribute[], Error>(
    [API_ENDPOINTS.TYPE, { language: locale }],
    ({ queryKey }) => client.attributes.all(queryKey[1] as AttributeQueryOptions),
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