import { CloseIcon } from "@components/icons/close-icon";
import { PencilIcon } from "@components/icons/pencil-icon";
import { formatAddress } from "@lib/format-address";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

interface AddressProps {
  checked: boolean;
  address: any;
  userId?: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AddressCard: React.FC<AddressProps> = ({ checked, address, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames(
        "group relative cursor-pointer rounded p-4 hover:border-accent shadow-sm",
        {
          "border border-heading": checked,
          "bg-gray-200 border-gray-100": !checked,
        }
      )}
    >
      <p className="mb-3 text-sm font-semibold capitalize text-heading">
        {address?.title}
      </p>
      <p className="text-sm text-sub-heading">
        {formatAddress(address?.address)}
      </p>
      <div className="absolute top-4 ltr:right-4 rtl:left-4 flex space-x-2 rtl:space-x-reverse opacity-0 group-hover:opacity-100">
        {onEdit && (
          <button
            className="flex items-center justify-center w-5 h-5 rounded-full bg-heading hover:bg-gray-600 text-white"
            onClick={onEdit}
          >
            <span className="sr-only">{t("text-edit")}</span>
            <PencilIcon className="w-3 h-3" />
          </button>
        )}
        {onDelete && (
          <button
            className="flex items-center justify-center w-5 h-5 rounded-full bg-[#F34459] text-white"
            onClick={onDelete}
          >
            <span className="sr-only">{t("text-delete")}</span>
            <CloseIcon className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
