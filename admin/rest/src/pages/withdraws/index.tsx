import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import WithdrawList from '@/components/withdraw/withdraw-list';
import { adminOnly } from '@/utils/auth-utils';
import { useWithdrawsQuery } from '@/data/withdraw';
import { useState } from 'react';
import { SortOrder } from '@/types';
import PageHeading from '@/components/common/page-heading';

export default function WithdrawsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { withdraws, paginatorInfo, loading, error } = useWithdrawsQuery({
    limit: 10,
    page,
    sortedBy,
    orderBy,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-row items-center justify-between">
        <div className="md:w-1/4">
          <PageHeading title={t('common:sidebar-nav-item-withdraws')} />
        </div>
      </Card>

      <WithdrawList
        withdraws={withdraws}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
WithdrawsPage.authenticate = {
  permissions: adminOnly,
};
WithdrawsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
