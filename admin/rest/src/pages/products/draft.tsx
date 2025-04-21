import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import Layout from '@/components/layouts/admin';
import CategoryTypeFilter from '@/components/filters/category-type-filter';
import ProductList from '@/components/product/product-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useInActiveProductsQuery } from '@/data/product';
import { useMeQuery } from '@/data/user';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function DraftProductPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { data: me } = useMeQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const { products, paginatorInfo, loading, error } = useInActiveProductsQuery({
    name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
    status: 'draft',
    user_id: me?.id,
    language: locale,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title={t('form:input-label-products')} />
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
            <Search onSearch={handleSearch} />
          </div>

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CategoryTypeFilter
              className="w-full"
              onCategoryFilter={({ slug }: { slug: string }) => {
                setPage(1);
                setCategory(slug);
              }}
              onTypeFilter={({ slug }: { slug: string }) => {
                setType(slug);
                setPage(1);
              }}
              enableCategory
              enableType
            />
          </div>
        </div>
      </Card>
      <ProductList
        products={products}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}
DraftProductPage.authenticate = {
  permissions: adminOnly,
};
DraftProductPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
