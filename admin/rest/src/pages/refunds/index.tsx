import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { useState } from 'react';
import { SortOrder } from '@/types';
import { useRefundsQuery } from '@/data/refund';
import RefundList from '@/components/refund/refund-list';
import { useRouter } from 'next/router';
import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import { useRefundReasonsQuery } from '@/data/refund-reason';
import PageHeading from '@/components/common/page-heading';

export default function RefundsPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [reason, setReason] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { data, loading, error } = useRefundsQuery({
    limit: 10,
    page,
    refund_reason: reason,
    sortedBy,
    orderBy,
  });

  const { refundReasons, loading: isLoading } = useRefundReasonsQuery({
    language: locale,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/2">
          <PageHeading title={t('common:sidebar-nav-item-refunds')} />
        </div>
        <div className="w-full md:w-1/2">
          <Select
            options={refundReasons}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('common:filter-by-reason-placeholder')}
            isLoading={isLoading}
            isSearchable={false}
            onChange={(reason: any) => {
              setReason(reason?.slug!);
              setPage(1);
            }}
            isClearable={true}
          />
        </div>
      </Card>

      <RefundList
        refunds={data}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
RefundsPage.authenticate = {
  permissions: adminOnly,
};
RefundsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
