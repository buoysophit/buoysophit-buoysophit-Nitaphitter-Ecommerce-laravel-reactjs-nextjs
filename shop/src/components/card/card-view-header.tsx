import { useUI } from "@contexts/ui.context";
import PlusIcon from '@components/icons/plus-icon';
import { useTranslation } from 'next-i18next';
import { useSettings } from '@framework/settings';

const CardViewHeader = () => {
  const { setModalView, openModal, setModalData } = useUI();
  const { t } = useTranslation('common');
  const { data } = useSettings();

  const handleAddNewCard = () => {
    setModalData({
      paymentGateway: data?.options?.paymentGateway
    })
    setModalView('ADD_NEW_CARD');
    return openModal();
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between sm:mb-10">
        <h1 className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse text-lg lg:text-xl xl:text-2xl text-heading capitalize font-bold">
          {t('profile-sidebar-my-cards')}
        </h1>
        <button
          className="flex items-center text-sm font-semibold text-accent"
          onClick={handleAddNewCard}
        >
          <PlusIcon className="mr-1" width={16} height={16} />
          {t('profile-add-cards')}
        </button>
      </div>
    </>
  );
};

export default CardViewHeader;
