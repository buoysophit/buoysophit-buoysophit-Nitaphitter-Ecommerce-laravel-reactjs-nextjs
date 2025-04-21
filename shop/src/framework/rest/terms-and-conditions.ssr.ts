import { API_ENDPOINTS } from '@framework/utils/endpoints';
import client from '@framework/utils/index';
import { SettingsQueryOptions, TermsAndConditionsQueryOptions } from '@type/index';
import { GetStaticPathsContext, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

// This function gets called at build time
export async function getStaticPaths({ locales }: GetStaticPathsContext) {
  const { data } = await client.shop.find({ is_active: '1' });

  const paths = data?.flatMap((shop: any) =>
    locales?.map((locale) => ({ params: { slug: shop.slug }, locale }))
  );

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: 'blocking' };
}

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) =>
      client.settings.findAll(queryKey[1] as SettingsQueryOptions)
  );

  try {
    const shop = await client.shop.findOne({
      slug: params!.slug as string,
      // language: locale,
    });
    await queryClient.prefetchInfiniteQuery(
      [
        API_ENDPOINTS.TERMS_AND_CONDITIONS,
        {
          shop_id: shop?.id,
          limit: 10,
          orderBy: 'created_at',
          sortedBy: 'DESC',
        },
      ],
      ({ queryKey }) => client.termsAndConditions.all(queryKey[1] as TermsAndConditionsQueryOptions)
    );
    return {
      props: {
        data: { shop },
        ...(await serverSideTranslations(locale!, [
          'common',
          'menu',
          'forms',
          'footer',
        ])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: Number(process.env.REVALIDATE_DURATION) ?? 120,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
