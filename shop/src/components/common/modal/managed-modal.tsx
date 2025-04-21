import { useUI } from '@contexts/ui.context';
import Modal from './modal';
import dynamic from 'next/dynamic';
import Newsletter from '@components/common/newsletter';

const LoginForm = dynamic(() => import('@components/auth/login-form'));
const OtpLogin = dynamic(() => import('@components/auth/otp/otp-login'));
const SignUpForm = dynamic(() => import('@components/auth/sign-up-form'));
const ForgetPasswordForm = dynamic(
  () => import('@components/auth/forget-password/forget-password'),
);
const ProductPopup = dynamic(() => import('@components/product/product-popup'));
const ProductVariation = dynamic(
  () => import('@components/product/variation-modal'),
);
const CreateOrUpdateAddressForm = dynamic(
  () => import('@components/address/address-form'),
  { ssr: false },
);
const AddressDeleteView = dynamic(
  () => import('@components/address/address-delete-view'),
);
const AddOrUpdateCheckoutContact = dynamic(
  () => import('@components/checkout/contact/add-or-update'),
);
const CreateOrUpdateGuestAddressForm = dynamic(
  () => import('@components/checkout/create-or-update-guest'),
);
const ProfileAddOrUpdateContact = dynamic(
  () => import('@components/profile/profile-add-or-update-contact'),
);
const AddNewCardModal = dynamic(
  () => import('@components/card/add-new-card-modal'),
  { ssr: false },
);
const PaymentModal = dynamic(
  () => import('@components/payment/payment-modal'),
  { ssr: false },
);
const AddNewPaymentModal = dynamic(
  () => import('@components/payment/add-new-payment-modal'),
  { ssr: false },
);
const GateWayControlModal = dynamic(
  () => import('@components/payment/gateway-control/gateway-modal'),
  { ssr: false },
);
const DeleteCardModal = dynamic(() => import('@components/card/delete-view'));
const WishListModal = dynamic(
  () => import('@components/my-account/wishlist-modal'),
);
const GalleryModal = dynamic(() => import('@components/ui/gallery'));
const NewsLetterModal = dynamic(
  () => import('@components/maintenance/news-letter'),
  { ssr: false },
);
const PromoPopup = dynamic(() => import('@components/promo-popup'), {
  ssr: false,
});

const ManagedModal: React.FC = () => {
  const { displayModal, closeModal, modalView, modalData } = useUI();
  const modalVariant =
    modalView === 'ADD_OR_UPDATE_CHECKOUT_CONTACT' ||
    modalView === 'ADD_OR_UPDATE_PROFILE_CONTACT' ||
    modalView === 'OTP_LOGIN_VIEW'
      ? 'default'
      : 'center';
  // Controlled payment modal [custom & default]
  if (modalView === 'PAYMENT_MODAL') {
    return <PaymentModal />;
  }
  if (modalView === 'GALLERY_VIEW') {
    return (
      <Modal open={displayModal} onClose={closeModal} variant="fullWidth">
        <GalleryModal data={modalData} />
      </Modal>
    );
  }
  if (modalView === 'PROMO_POPUP_MODAL') {
    return <PromoPopup />;
  }
  return (
    <Modal open={displayModal} onClose={closeModal} variant={modalVariant}>
      {modalView === 'LOGIN_VIEW' && <LoginForm />}
      {modalView === 'OTP_LOGIN_VIEW' && <OtpLogin />}
      {modalView === 'SIGN_UP_VIEW' && <SignUpForm />}
      {modalView === 'FORGET_PASSWORD' && <ForgetPasswordForm />}
      {modalView === 'PRODUCT_VIEW' && <ProductPopup productSlug={modalData} />}
      {modalView === 'SELECT_PRODUCT_VARIATION' && (
        <ProductVariation productSlug={modalData} />
      )}
      {modalView === 'NEWSLETTER_VIEW' && <Newsletter />}
      {modalView === 'ADDRESS_FORM_VIEW' && <CreateOrUpdateAddressForm />}
      {modalView === 'ADDRESS_DELETE_VIEW' && (
        <AddressDeleteView data={modalData} />
      )}
      {modalView === 'ADD_OR_UPDATE_CHECKOUT_CONTACT' && (
        <AddOrUpdateCheckoutContact data={modalData} />
      )}
      {modalView === 'ADD_OR_UPDATE_PROFILE_CONTACT' && (
        <ProfileAddOrUpdateContact data={modalData} />
      )}
      {modalView === 'ADD_NEW_CARD' && <AddNewCardModal data={modalData} />}
      {modalView === 'USE_NEW_PAYMENT' && <AddNewPaymentModal />}
      {modalView === 'DELETE_CARD_MODAL' && <DeleteCardModal />}
      {modalView === 'GATEWAY_MODAL' && <GateWayControlModal />}
      {modalView === 'ADD_OR_UPDATE_GUEST_ADDRESS' && (
        <CreateOrUpdateGuestAddressForm />
      )}
      {modalView === 'WISHLIST_MODAL' && <WishListModal data={modalData} />}
      {modalView === 'NEWSLETTER_MODAL' && <NewsLetterModal />}
    </Modal>
  );
};

export default ManagedModal;
