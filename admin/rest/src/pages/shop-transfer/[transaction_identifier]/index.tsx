import Layout from '@/components/layouts/admin';
import { Details } from '@/components/shop-transfer/details';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useOwnerShipTransferQuery } from '@/data/ownership-transfer';
import { useMeQuery } from '@/data/user';
import { adminOnly } from '@/utils/auth-utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const OwnershipTransferSinglePage = () => {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { ownershipTransfer, loading, error, refetch } =
    useOwnerShipTransferQuery({
      transaction_identifier: query?.transaction_identifier as string,
      language: locale as string,
      request_view_type: 'detail',
    });
  const { data: me, isLoading: meLoading, error: meError } = useMeQuery();

  // Loading control area
  if (loading || meLoading) return <Loader text={t('common:text-loading')} />;
  if (error || meError)
    return <ErrorMessage message={error?.message || meError?.message} />;

  return <Details data={ownershipTransfer} userId={me?.id as string} />;
};

OwnershipTransferSinglePage.authenticate = {
  permissions: adminOnly,
};

OwnershipTransferSinglePage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'table', 'form'])),
  },
});

export default OwnershipTransferSinglePage;
