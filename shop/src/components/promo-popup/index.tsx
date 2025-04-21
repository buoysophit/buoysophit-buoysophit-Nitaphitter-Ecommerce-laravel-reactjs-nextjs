import SubscriptionWidget from '@components/common/subscribe-to-newsletter';
import { CheckBox } from '@components/ui/checkbox';
import Spinner from '@components/ui/loaders/spinner/spinner';
import Modal from '@components/common/modal/modal';
import { useUI } from '@contexts/ui.context';
import { NEWSLETTER_POPUP_MODAL_KEY } from '@lib/constants';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useCallback, useState } from 'react';

const PromoPopup = () => {
  const [notShowAgain, setNotShowAgain] = useState(false);

  const {
    closeModal,
    displayModal,
    modalData: { isLoading, popupData },
  } = useUI();

  const closeModalAction = useCallback(() => {
    if (Boolean(notShowAgain)) {
      Cookies.set(NEWSLETTER_POPUP_MODAL_KEY, 'true', {
        expires: Number(popupData?.popUpNotShow?.popUpExpiredIn),
      });
    } else {
      Cookies.set(NEWSLETTER_POPUP_MODAL_KEY, 'true', {
        expires: Number(popupData?.popUpExpiredIn),
      });
    }
    closeModal();
  }, [notShowAgain]);

  return (
    <Modal open={displayModal} onClose={closeModalAction}>
      <div className="w-full overflow-hidden text-heading max-w-4xl rounded-xl bg-white">
        {isLoading ? (
          <div className="p-6 md:p-12">
            <Spinner className="!h-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 items-center">
            <div className="md:col-span-1 order-2 md:order-1 col-span-full p-6 md:p-12">
              {popupData?.title ? (
                <h2 className="text-3xl font-bold mb-4">{popupData?.title}</h2>
              ) : (
                ''
              )}

              {popupData?.description ? (
                <p className="text-lg text-heading/70 leading-[150%]">
                  {popupData?.description}
                </p>
              ) : (
                ''
              )}

              <SubscriptionWidget layout="newsletter" />

              {popupData?.isPopUpNotShow ? (
                <div className="mt-4">
                  <CheckBox
                    name="not_show_again"
                    label={popupData?.popUpNotShow?.title}
                    onChange={() => setNotShowAgain(!notShowAgain)}
                    checked={notShowAgain}
                  />
                </div>
              ) : (
                ''
              )}
            </div>

            <div
              className={classNames(
                'md:col-span-1 order-1 relative md:order-2 col-span-full bg-gray-50 dark:bg-dark-250 h-72 md:h-[28.125rem]',
              )}
            >
              <Image
                src={popupData?.image?.original}
                alt={popupData?.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
                quality={100}
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PromoPopup;
