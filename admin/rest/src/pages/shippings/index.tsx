import Card from '@/components/common/card';
import Search from '@/components/common/search';
import Layout from '@/components/layouts/admin';
import ShippingList from '@/components/shipping/shipping-list';
import { useState } from 'react';

import PageHeading from '@/components/common/page-heading';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { Routes } from '@/config/routes';
import { useShippingClassesQuery } from '@/data/shipping';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export default function ShippingsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearch] = useState('');
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { shippingClasses, loading, error } = useShippingClassesQuery({
    name: searchTerm,
    orderBy,
    sortedBy,
  });
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-shippings')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />

          <LinkButton
            href={`${Routes.shipping.create}`}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span>
              + {t('form:button-label-add')} {t('form:button-label-shipping')}
            </span>
          </LinkButton>
        </div>
      </Card>
      <ShippingList
        onOrder={setOrder}
        onSort={setColumn}
        shippings={shippingClasses}
      />
    </>
  );
}

ShippingsPage.authenticate = {
  permissions: adminOnly,
};

ShippingsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
