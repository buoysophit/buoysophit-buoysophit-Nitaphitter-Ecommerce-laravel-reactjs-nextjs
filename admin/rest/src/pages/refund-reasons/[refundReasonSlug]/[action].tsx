import Layout from '@/components/layouts/admin';
import CreateOrUpdateRefundReasonForm from '@/components/refund-reason/refund-reason-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { Config } from '@/config';
import { useRefundReasonQuery } from '@/data/refund-reason';
import { adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

export default function UpdateRefundReasonPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { refundReason, loading, error } = useRefundReasonQuery({
    slug: query.refundReasonSlug as string,
    language:
      query.action!.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-update-refund-reason')}
        </h1>
      </div>
      <CreateOrUpdateRefundReasonForm initialValues={refundReason} />
    </>
  );
}
UpdateRefundReasonPage.authenticate = {
  permissions: adminOnly,
};
UpdateRefundReasonPage.Layout = Layout;

export const getServerSideProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common'])),
  },
});
