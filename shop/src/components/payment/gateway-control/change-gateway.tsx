import { useTranslation } from 'next-i18next';
import { useUI } from '@contexts/ui.context';
import { Order } from '@type/index';
import Button from '@components/ui/button';

interface Props {
  order: Order;
  buttonSize?: 'big' | 'medium' | 'small';
}

const ChangeGateway: React.FC<Props> = ({ order, buttonSize = 'small' }) => {
  const { t } = useTranslation();
  const { setModalView, setModalData, openModal } = useUI();

  const handleChangePaymentGateway = async () => {
    setModalData({
      order
    });
    setModalView('GATEWAY_MODAL');
    openModal();
  };

  return (
    <Button
      className="w-full"
      onClick={handleChangePaymentGateway}
      // size={buttonSize}
    >
      Change gateway
    </Button>
  );
};

export default ChangeGateway;
