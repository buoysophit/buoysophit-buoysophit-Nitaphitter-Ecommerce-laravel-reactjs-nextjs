import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/admin';
import OwnershipTransferLists from '@/components/ownership-transfer/ownership-transfer-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useOwnerShipTransfersQuery } from '@/data/ownership-transfer';
import { SortOrder } from '@/types';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMeQuery } from '@/data/user';

export default function ShopTransferRequestPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data: user, isLoading: loading, error } = useMeQuery();
  const { role } = getAuthCredentials();

  const {
    ownershipTransfer,
    loading: loadingRequest,
    paginatorInfo,
    error: errorRequest,
  } = useOwnerShipTransfersQuery({
    language: locale,
    limit: 10,
    page,
    orderBy,
    sortedBy,
    transaction_identifier: searchTerm,
  });

  // TODO : error need to be handled properly.
  if (loading || loadingRequest)
    return <Loader text={t('common:text-loading')} />;
  if (error || errorRequest) return <ErrorMessage message={error?.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title="Shop Ownership Transfer Request List" />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText="Search by request tracker"
          />
        </div>
      </Card>
      <OwnershipTransferLists
        userRole={role}
        user={user}
        ownershipTransfer={ownershipTransfer}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

ShopTransferRequestPage.authenticate = {
  permissions: adminOnly,
};

ShopTransferRequestPage.Layout = Layout;
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
