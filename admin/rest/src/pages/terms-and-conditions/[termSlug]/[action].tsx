import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import { useTermsAndConditionQuery } from '@/data/terms-and-condition';
import CreateOrUpdateTermsAndConditionsForm from '@/components/terms-and-conditions/terms-and-conditions-form';
import { adminOnly } from '@/utils/auth-utils';

export default function UpdateTermsAndConditionsPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { termsAndConditions, loading, error } = useTermsAndConditionQuery({
    slug: query.termSlug as string,
    language: locale as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-store-notice')}
        </h1>
      </div>
      <CreateOrUpdateTermsAndConditionsForm
        initialValues={termsAndConditions}
      />
    </>
  );
}

UpdateTermsAndConditionsPage.authenticate = {
  permissions: adminOnly,
};

UpdateTermsAndConditionsPage.Layout = Layout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
