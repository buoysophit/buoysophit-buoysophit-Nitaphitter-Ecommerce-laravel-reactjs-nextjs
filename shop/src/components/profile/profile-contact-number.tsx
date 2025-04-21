import { useUI } from '@contexts/ui.context';
import { useUpdateCustomer } from '@framework/customer';
import { OTP } from '@framework/otp';
import { useTranslation } from 'next-i18next';
import { toast } from 'react-toastify';

interface Props {
  userId: string;
  profileId: string;
  contact: string;
  variant?: 'inline' | 'default';
  labelKey?: string;
}

const ProfileContactNumber = ({
  userId,
  profileId,
  contact,
  variant = 'default',
  labelKey,
}: Props) => {
  const { openModal, setModalView, setModalData, closeModal } = useUI();
  const { t } = useTranslation('common');
  const { mutate: updateProfile } = useUpdateCustomer();

  function onAdd() {
    setModalData({
      customerId: userId,
      profileId,
      contact,
    });
    setModalView('ADD_OR_UPDATE_PROFILE_CONTACT');

    return openModal();
  }

  function onContactUpdate(newPhoneNumber: string) {
    if (!userId) {
      return false;
    }
    updateProfile(
      {
        id: userId,
        profile: {
          id: profileId,
          contact: newPhoneNumber,
        },
      },
      {
        onSuccess: () => {
          toast.success(t('profile-update-successful'));
        },
        onError: (_err) => {
          toast.error(t('error-something-wrong'));
        },
      }
    );
    closeModal();
  }

  return (
    <div className="w-full flex flex-col">
      {/* <div className="flex items-center justify-between mb-5 lg:mb-8">
        <p className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse text-lg lg:text-xl xl:text-2xl text-heading capitalize font-bold">
          {t('text-contact-number')}
        </p>

        {onAdd && (
          <button
            className="flex items-center text-sm font-semibold text-heading transition-colors duration-200 focus:outline-none focus:opacity-70 hover:opacity-70 mt-1"
            onClick={onAdd}
          >
            <PlusIcon className="w-4 h-4 stroke-2 ltr:mr-0.5 rtl:ml-0.5" />
            {Boolean(contact) ? t('text-update') : t('text-add')}
          </button>
        )}
      </div> */}

      {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <ContactCard
          number={Boolean(contact) ? contact : t('text-no-contact')}
        />
      </div> */}
      {labelKey && (
        <label className="block text-gray-600 font-semibold text-sm leading-none mb-3 cursor-pointer">
          {t(labelKey)}
        </label>
      )}
      <OTP
        phoneNumber={contact}
        // @ts-ignore
        onVerify={onContactUpdate}
        variant={variant}
      />
    </div>
  );
};

export default ProfileContactNumber;
