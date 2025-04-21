import { Address } from "@type/index";
import { RadioGroup } from "@headlessui/react";
import { useAtom, WritableAtom } from "jotai";
import { useEffect } from "react";
import AddressCard from "@components/address/address-card";
import { AddressHeader } from "@components/address/address-header";
import { useTranslation } from "next-i18next";
import { useUI } from "@contexts/ui.context";

interface AddressesProps {
  addresses: Address[] | undefined;
  label: string;
  atom: WritableAtom<Address | null, any, Address>;
  className?: string;
  userId: string;
  count: number;
  type: string;
}

export const AddressGrid: React.FC<AddressesProps> = ({
  addresses,
  label,
  atom,
  className,
  userId,
  count,
  type,
}) => {
  const { t } = useTranslation("common");
  const [selectedAddress, setAddress] = useAtom(atom);
  const { openModal, setModalView, setModalData } = useUI();

  useEffect(() => {
    if (addresses?.length) {
      if (selectedAddress?.id) {
        const index = addresses.findIndex((a) => a.id === selectedAddress.id);
        setAddress(addresses[index]);
      } else {
        setAddress(addresses?.[0]);
      }
    }
  }, [addresses, addresses?.length, selectedAddress?.id, setAddress]);

  function onAdd() {
    setModalData({
      customerId: userId,
      type,
    });
    setModalView("ADDRESS_FORM_VIEW");
    return openModal();
  }

  function onEdit(address: Address) {
    setModalData({
      customerId: userId,
      address,
    });
    setModalView("ADDRESS_FORM_VIEW");
    return openModal();
  }

  function onDelete(address: Address) {
    setModalData({
      customerId: userId,
      addressId: address?.id,
    });
    setModalView("ADDRESS_DELETE_VIEW");
    return openModal();
  }

  return (
    <div className={className}>
      <AddressHeader onAdd={onAdd} count={count} label={label} />

      {addresses && addresses?.length ? (
        <RadioGroup value={selectedAddress} onChange={setAddress}>
          <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {addresses?.map((address) => (
              <RadioGroup.Option
                value={address}
                key={address?.id}
                className="focus-visible:outline-none"
              >
                {({ checked }) => (
                  <AddressCard
                    checked={checked}
                    onDelete={() => onDelete(address)}
                    onEdit={() => onEdit(address)}
                    address={address}
                  />
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          <span className="text-sm relative p-4 lg:p-5 xl:p-6 text-heading font-semibold text-center bg-gray-200 border-gray-100 rounded border border-border-200">
            {t("text-no-address")}
          </span>
        </div>
      )}
    </div>
  );
};
export default AddressGrid;
