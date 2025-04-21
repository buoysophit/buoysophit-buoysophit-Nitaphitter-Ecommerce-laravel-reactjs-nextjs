import Layout from '@/components/layouts/admin';
import CreateOrUpdateProductForm from '@/components/product/product-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useProductQuery } from '@/data/product';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Config } from '@/config';
import Link from '@/components/ui/link';

export default function UpdateProductPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();

  const {
    product,
    isLoading: loading,
    error,
  } = useProductQuery({
    slug: query.productSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error?.message as string} />;
  return (
    <>
      <div className="flex items-center gap-5 border-b border-dashed border-border-base py-5 sm:py-8">
        <h4 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-product')}
        </h4>
      </div>

      <CreateOrUpdateProductForm initialValues={product} />
    </>
  );
}
UpdateProductPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'form'])),
  },
});
