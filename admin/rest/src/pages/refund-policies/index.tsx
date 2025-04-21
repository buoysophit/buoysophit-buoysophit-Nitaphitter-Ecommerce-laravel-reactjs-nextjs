import Card from '@/components/common/card';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/admin';
import RefundPolicyList from '@/components/refund-policy/refund-policy-list';
import RefundPolicyStatusFilter from '@/components/refund-policy/refund-policy-status-filter';
import RefundPolicyTypeFilter from '@/components/refund-policy/refund-policy-type-filter';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useRefundPoliciesQuery } from '@/data/refund-policy';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { LIMIT } from '@/utils/constants';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function RefundPolicies() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { refundPolicies, loading, paginatorInfo, error } =
    useRefundPoliciesQuery({
      limit: LIMIT,
      title: searchTerm.replace(/-/g, ' '),
      target,
      status,
      page,
      orderBy,
      sortedBy,
      language: locale,
    });
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="before:content-'' relative text-lg font-semibold text-heading before:absolute before:-top-0.5 before:h-8 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-8 rtl:before:-right-8 xl:before:w-1">
            {t('common:text-refund-policies')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-3/4">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-heading')}
          />

          <RefundPolicyTypeFilter
            className="md:ms-6"
            onTargetFilter={(target: any) => {
              setTarget(target?.value!);
              setPage(1);
            }}
          />
          <RefundPolicyStatusFilter
            className="md:ms-6"
            onStatusFilter={(target: any) => {
              setStatus(target?.value!);
              setPage(1);
            }}
          />

          {locale === Config.defaultLanguage && (
            <LinkButton
              href={`${Routes.refundPolicies.create}`}
              className="h-12 w-full md:w-auto md:ms-6"
            >
              <span>+ {t('form:button-label-add-refund-policy')}</span>
            </LinkButton>
          )}
        </div>
      </Card>

      <RefundPolicyList
        refundPolicies={refundPolicies}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
RefundPolicies.authenticate = {
  permissions: adminOnly,
};
RefundPolicies.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common', 'table'])),
  },
});
