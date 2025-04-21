// import { useModalAction } from '@components/ui/modal/modal.context';
import AddressCard from '@components/address/address-card';
import { AddressHeader } from '@components/address/address-header';
import { useUI } from '@contexts/ui.context';
import { AddressType } from '@framework/utils/constants';
import { Address } from '@type/index';
import { useTranslation } from 'next-i18next';

interface AddressesProps {
  addresses: Address[] | undefined;
  label: string;
  className?: string;
  userId: string;
}

export const AccountAddress: React.FC<AddressesProps> = ({
  addresses,
  label,
  className,
  userId,
}) => {
  const { openModal, setModalData, setModalView } = useUI();
  const { t } = useTranslation('common');

  function onAdd() {
    setModalData({
      customerId: userId,
      type: AddressType.Billing,
    });
    setModalView('ADDRESS_FORM_VIEW');
    return openModal();
  }

  return (
    <div className={className}>
      <AddressHeader onAdd={onAdd} count={false} label={label} />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {addresses && addresses?.length ? (
          <>
            {addresses?.map((address) => (
              <AddressCard
                checked={false}
                address={address}
                userId={userId}
                key={address.id}
              />
            ))}
          </>
        ) : (
          <span className="relative px-5 py-6 text-base text-left bg-gray-100 rounded border border-border-200">
            {t('text-no-address')}
          </span>
        )}
      </div>
    </div>
  );
};

export default AccountAddress;
