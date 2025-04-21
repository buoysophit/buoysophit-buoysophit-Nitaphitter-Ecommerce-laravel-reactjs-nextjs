import Layout from '@/components/layouts/admin';
import CreateOrUpdateRefundPolicyForm from '@/components/refund-policy/refund-policy-form';
import { adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateRefundPolicyPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-create-refund-policy')}
        </h1>
      </div>
      <CreateOrUpdateRefundPolicyForm />
    </>
  );
}
CreateRefundPolicyPage.authenticate = {
  permissions: adminOnly,
};
CreateRefundPolicyPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common'])),
  },
});
