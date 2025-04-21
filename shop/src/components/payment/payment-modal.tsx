import { useUI } from "@contexts/ui.context";
import StripePaymentModal from '@components/payment/stripe/stripe-payment-modal';
import Modal from '@components/common/modal/modal';
import RazorpayPaymentModal from "@components/payment/razorpay/razorpay-payment-modal";


const PAYMENTS_FORM_COMPONENTS: any = {
  STRIPE: {
    component: StripePaymentModal,
    type: 'custom',
  },  
  RAZORPAY: {
    component: RazorpayPaymentModal,
    type: 'default',
  },
};

const PaymentModal = () => {
  const {
    closeModal,
    displayModal,
    modalData: { paymentGateway, paymentIntentInfo, trackingNumber },
  } = useUI();
  const PaymentMethod =
    PAYMENTS_FORM_COMPONENTS[paymentGateway?.toUpperCase()];
  const PaymentComponent = PaymentMethod?.component;
  const paymentModalType = PaymentMethod?.type;
  return paymentModalType === 'custom' ? (
    <Modal open={displayModal} onClose={closeModal}>
      <PaymentComponent
        paymentIntentInfo={paymentIntentInfo}
        trackingNumber={trackingNumber}
        paymentGateway={paymentGateway}
      />
    </Modal>
  ) : (
    <PaymentComponent
      paymentIntentInfo={paymentIntentInfo}
      trackingNumber={trackingNumber}
      paymentGateway={paymentGateway}
    />
  );;
};

export default PaymentModal;
