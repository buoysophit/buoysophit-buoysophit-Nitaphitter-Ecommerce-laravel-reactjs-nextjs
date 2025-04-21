import { Category, SettingsQueryOptions } from "@type/index";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { GetStaticPathsContext, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import client from '@framework/utils/index'

// This function gets called at build time
export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  // @ts-ignore
  const { data } = await client.category.find({ limit: 100, parent: null });

  const paths = data?.flatMap((category: Category) =>
    locales?.map((locale) => ({ params: { slug: category.slug }, locale }))
  );

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;

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

      await queryClient.prefetchQuery([API_ENDPOINTS.CATEGORIES, slug], () =>
        client.category.findOne({ slug: slug, language: locale })
      ),

      await queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS, { category: slug }],
        ({ queryKey, pageParam }) => client.product.all(Object.assign({}, queryKey[1], pageParam))
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
