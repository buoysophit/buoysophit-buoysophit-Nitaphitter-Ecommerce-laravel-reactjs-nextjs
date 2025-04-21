import CreateOrUpdateFaqsForm from '@/components/faqs/faqs-form';
import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';

export default function CreateFAQsPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('text-non-translated-title')} {t('text-faq')}
        </h1>
      </div>
      <CreateOrUpdateFaqsForm />
    </>
  );
}

CreateFAQsPage.authenticate = {
  permissions: adminOnly,
};

CreateFAQsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
