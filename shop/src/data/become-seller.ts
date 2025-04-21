import { GetStaticProps } from 'next';
import { QueryClient, dehydrate } from 'react-query';
import client from '@framework/utils/index';
import { QueryOptions, SettingsQueryOptions } from '@type/index';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { API_ENDPOINTS } from '@framework/utils/endpoints';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  try {
    const settingsData = await queryClient.fetchQuery(
      [API_ENDPOINTS.SETTINGS, { language: locale }],
      ({ queryKey }) =>
        client.settings.findAll(queryKey[1] as SettingsQueryOptions),
    );

    const data = await queryClient.fetchQuery(
      [API_ENDPOINTS.BECAME_SELLER, { language: locale }],
      ({ queryKey }) => client.becomeSeller.get(queryKey[1] as QueryOptions),
    );

    return {
      props: {
        data: {
          ...data,
          page_options: {
            ...data.page_options,
            page_options: {
              ...data.page_options.page_options,
            },
          },
          settings: {
            isMultiCommissionRate:
              settingsData?.options?.isMultiCommissionRate ?? null,
          },
        },
        ...(await serverSideTranslations(locale!, [
          'common',
          'menu',
          'footer',
          'forms',
        ])),
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      },
      revalidate: 60,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
