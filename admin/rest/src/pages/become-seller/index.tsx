import BecomeSellerInfoForm from '@/components/become-seller/become-seller-form';
import Card from '@/components/common/card';
import AdminLayout from '@/components/layouts/admin';
import { BackToTopProvider } from '@/components/ui/back-to-top/back-to-top-context';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useBecomeSellerQuery } from '@/data/become-seller';
import { useSettingsQuery } from '@/data/settings';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

export default function BecomeSeller() {
  const { t } = useTranslation();
  const { locale } = useRouter();

  const { becomeSellerData, loading, error } = useBecomeSellerQuery({
    language: locale!,
  });

  const { settings, loading: loadingSettings } = useSettingsQuery({
    language: locale!,
  });

  if (loading || loadingSettings)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Card className="mb-8 flex flex-col items-center xl:flex-row">
        <div className="mb-4 md:w-1/4 xl:mb-0">
          <h1 className="before:content-'' relative text-lg font-semibold text-heading before:absolute before:-top-0.5 before:h-8 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-8 rtl:before:-right-8 xl:before:w-1">
            {t('form:become-seller-form-title')}
          </h1>
        </div>
      </Card>
      <BackToTopProvider>
        <BecomeSellerInfoForm
          becomeSellerData={becomeSellerData}
          settings={settings}
        />
      </BackToTopProvider>
    </>
  );
}
BecomeSeller.authenticate = {
  permissions: adminOnly,
};
BecomeSeller.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
