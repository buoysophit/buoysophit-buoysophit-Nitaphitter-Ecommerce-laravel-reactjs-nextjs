import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import client from '@framework/utils/index'
import invariant from 'tiny-invariant';
import { SettingsQueryOptions, ParamsType, AttributeQueryOptions } from "@type/index";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  invariant(locale, 'locale is required');
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  try {
    await Promise.all([
      await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS, { language: locale }], ({ queryKey }) => client.settings.findAll(queryKey[1] as SettingsQueryOptions)),

      await queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS, { language: locale }],
        ({ queryKey }) => client.product.all(queryKey[1] as ParamsType)
      ),

      await queryClient.prefetchInfiniteQuery(
        [
          API_ENDPOINTS.CATEGORIES,
          {
            limit: 5,
            parent: null,
            language: locale
          },
        ],
        ({ queryKey, pageParam }) => client.category.all(Object.assign({}, queryKey[1], pageParam))
      ),

      await queryClient.prefetchInfiniteQuery(
        [
          API_ENDPOINTS.TYPE,
          {
            limit: 5,
            language: locale
          },
        ],
        ({ queryKey, pageParam }) => client.brands.all(Object.assign({}, queryKey[1], pageParam))
      ),

      await queryClient.prefetchQuery(
        [API_ENDPOINTS.ATTRIBUTES, { language: locale }],
        ({ queryKey }) => client.attributes.all(queryKey[1] as AttributeQueryOptions)
      ),
    ]);

    return {
      props: {
        ...(await serverSideTranslations(locale!, [
          "common",
          "menu",
          "forms",
          "footer",
        ])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: Number(process.env.REVALIDATE_DURATION) ?? 120,
    };
  } catch (error) {
    // If we get here means something went wrong in promise fetching
    return {
      notFound: true,
    };
  }
};
