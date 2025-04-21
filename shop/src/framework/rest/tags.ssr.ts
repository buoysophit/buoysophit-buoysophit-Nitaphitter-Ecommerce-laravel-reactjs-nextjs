import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { GetStaticPathsContext, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { Tag } from "@type/index";
// import { fetchTags } from "@framework/tags/tags.query";
import client from '@framework/utils/index'
import { SettingsQueryOptions } from "@type/index";

// This function gets called at build time
export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const tags = await client.tag.all({ limit: 100 });

  const paths = tags?.data?.flatMap((tag: Tag) =>
    locales?.map((locale) => ({ params: { tags: tag.slug }, locale }))
  );

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  try {
    const tags = params?.tags as string;
    await Promise.all([
      await queryClient.prefetchQuery([API_ENDPOINTS.SETTINGS, { language: locale }], ({ queryKey }) => client.settings.findAll(queryKey[1] as SettingsQueryOptions)),

      // Fetch all tags name
      await queryClient.prefetchQuery([API_ENDPOINTS.TAGS, {}], ({ queryKey, pageParam }) => client.tag.all(Object.assign({}, queryKey[1], pageParam))),

      await queryClient.prefetchInfiniteQuery(
        [API_ENDPOINTS.PRODUCTS, { tags }],
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
