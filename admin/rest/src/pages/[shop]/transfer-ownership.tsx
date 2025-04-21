import ShopLayout from '@/components/layouts/shop';
import TransferShopOwnershipForm from '@/components/shop/transfer-ownership-shop-form';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import NotFound from '@/components/ui/not-found';
import { Routes } from '@/config/routes';
import { useShopQuery } from '@/data/shop';
import { useMeQuery, useVendorsQuery } from '@/data/user';
import { OwnerShipTransferStatus, Shop } from '@/types';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { OWNERSHIP_TRANSFER_STATUS } from '@/utils/constants';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

export default function TransferShopOwnershipPage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { query } = useRouter();
  const { shop } = query;
  const { t } = useTranslation();

  const {
    data,
    isLoading: loading,
    error,
  } = useShopQuery({
    slug: shop as string,
  });
  const {
    vendors,
    loading: vendorLoading,
    error: vendorError,
  } = useVendorsQuery({
    is_active: true,
    shop_id: data?.id!,
    exclude: data?.owner_id,
  });

  if (loading || vendorLoading)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  if (vendorError) return <ErrorMessage message={vendorError.message} />;
  if (
    !hasAccess(adminOnly, permissions) &&
    !me?.shops?.map((shop) => shop.id).includes(data?.id) &&
    me?.managed_shop?.id != data?.id
  ) {
    router.replace(Routes.dashboard);
  }

  return (
    <>
      <div className="flex py-5 border-b border-dashed border-border-base sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-transfer-shop-ownership')}
        </h1>
      </div>
      {OWNERSHIP_TRANSFER_STATUS?.includes(
        data?.ownership_history?.status as OwnerShipTransferStatus,
      ) ? (
        <NotFound
          className="mt-10"
          text={`Shop transfer already in ${data?.ownership_history?.status} state! ✋`}
        />
      ) : (
        <TransferShopOwnershipForm shop={data as Shop} vendors={vendors} />
      )}
    </>
  );
}
TransferShopOwnershipPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
TransferShopOwnershipPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
