import { API_ENDPOINTS } from "@framework/utils/endpoints";
import { GetStaticPaths, GetStaticProps, GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import client from '@framework/utils/index';
import { SettingsQueryOptions } from '@type/index';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
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

  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'menu',
        'forms',
        'footer',
      ])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) =>
      client.settings.findAll(queryKey[1] as SettingsQueryOptions)
  );

  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'menu',
        'forms',
        'footer',
      ])),
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
