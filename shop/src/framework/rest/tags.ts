import { TagsQueryOptionsType, Tag, TagPaginator } from "@type/index";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import {
  useInfiniteQuery,
  useQuery,
} from "react-query";
import client from '@framework/utils/index'
import { useRouter } from 'next/router';

export function useTags(params: TagsQueryOptionsType) {
  const { locale } = useRouter();
  const formattedOptions = {
    ...params,
    language: locale,
  };
  return useInfiniteQuery<TagPaginator, Error>(
    [API_ENDPOINTS.TAGS, formattedOptions],
    ({ queryKey, pageParam }) => client.tag.all(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
      getNextPageParam: ({ current_page, last_page }) =>
        last_page > current_page && { page: current_page + 1 },
    }
  );
}

export const useTag = (slug: string) => {
  const { locale } = useRouter();
  const formattedOptions = {
    slug,
    language: locale,
  };
  return useQuery<Tag, Error>(
    [API_ENDPOINTS.TAGS, formattedOptions],
    ({ queryKey, pageParam }) => client.tag.findOne(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    }
  );
};
