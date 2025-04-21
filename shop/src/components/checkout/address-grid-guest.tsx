import { RadioGroup } from '@headlessui/react';
import { useAtom, WritableAtom } from 'jotai';
import AddressCard from '@components/address/address-card';
import { AddressHeader } from '@components/address/address-header';
import { useTranslation } from 'next-i18next';
import { Address } from '@type/index';
import { useUI } from '@contexts/ui.context';

interface AddressesProps {
  addresses: Address[] | undefined;
  label: string;
  atom: WritableAtom<Address | null, any, Address>;
  className?: string;
  count: number;
  type: string;
}

export const GuestAddressGrid: React.FC<AddressesProps> = ({
  addresses,
  label,
  atom,
  className,
  count,
  type,
}) => {
  const { t } = useTranslation('common');
  const [selectedAddress, setAddress] = useAtom(atom);
  const { openModal, setModalData, setModalView } = useUI();

  function onAdd() {
    setModalData({ type, atom });
    setModalView('ADD_OR_UPDATE_GUEST_ADDRESS');
    openModal();
  }

  function onEdit(address: any) {
    setModalData({ type, atom, address });
    setModalView('ADD_OR_UPDATE_GUEST_ADDRESS');
    openModal();
  }

  return (
    <div className={className}>
      <AddressHeader onAdd={onAdd} count={count} label={label} />
      {addresses && addresses?.length ? (
        <RadioGroup as="span" value={selectedAddress} onChange={setAddress}>
          <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {addresses?.map((address) => (
              <RadioGroup.Option value={address} key={address?.id}>
                {({ checked }) => (
                  <AddressCard
                    checked={checked}
                    address={address}
                  />
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
            {t('text-no-address')}
          </span>
        </div>
      )}
    </div>
  );
};
export default GuestAddressGrid;
