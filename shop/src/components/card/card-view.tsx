import amex from '@assets/cards/amex.svg';
import diners from '@assets/cards/diners.svg';
import discover from '@assets/cards/discover.svg';
import jcb from '@assets/cards/jcb.svg';
import mastercard from '@assets/cards/mastercard.svg';
import unionpay from '@assets/cards/unionpay.svg';
import visa from '@assets/cards/visa.svg';
import { Image } from '@components/ui/image';
import { Table } from '@components/ui/table';
import { useIsRTL } from '@lib/locals';
import CheckIconWithBg from '@components/icons/check-icon-with-bg';
import { useTranslation } from 'next-i18next';
import Fallback from '@assets/cards/fallback-image.png';
import Action from '@components/card/action/action';

let images = {
  amex,
  visa,
  diners,
  jcb,
  mastercard,
  unionpay,
  discover,
} as any;

interface CardViewProps {
  view?: 'modal' | 'normal';
  payments: any;
  showContinuePayment?: boolean;
}

const CardsView = ({
  view = 'normal',
  payments = [],
  showContinuePayment = false,
}: CardViewProps) => {
  const { t } = useTranslation('common');

  const { alignLeft, alignRight } = useIsRTL();
  const columns = [
    {
      title: ' ',
      dataIndex: '',
      key: '',
      width: 50,
      align: alignLeft,
      render: (record: any) => {
        return record?.default_card ? (
          <div className="w-10 text-accent">
            <CheckIconWithBg />
          </div>
        ) : (
          ''
        );
      },
    },
    {
      title: (
        <span className="text-base font-semibold text-heading">
          {t('text-company')}
        </span>
      ),
      dataIndex: 'network',
      key: 'network',
      width: 120,
      align: alignLeft,
      render: (network: string) => {
        return (
          <div className="w-10">
            {network ? (
              <Image
                src={images[network]}
                width={40}
                height={28}
                alt={t('text-company')}
              />
            ) : (
              <Image
                src={Fallback}
                width={40}
                height={28}
                alt={t('text-company')}
              />
            )}
          </div>
        );
      },
    },
    {
      title: (
        <span className="text-base font-semibold text-heading">
          {t('text-card-number')}
        </span>
      ),
      dataIndex: 'last4',
      key: 'last4',
      align: alignLeft,
      width: 230,
      render: (last4: number) => {
        return (
          <p className="text-base truncate text-heading">{`**** **** **** ${last4}`}</p>
        );
      },
    },
    {
      title: (
        <span className="text-base font-semibold text-heading">
          {t('text-card-owner-name')}
        </span>
      ),
      dataIndex: 'owner_name',
      key: 'owner_name',
      align: alignLeft,
      width: 190,
      render: (owner_name: string) => {
        return <p className="text-base truncate text-heading">{owner_name}</p>;
      },
    },
    {
      title: (
        <span className="text-base font-semibold text-heading">
          {t('text-card-expire')}
        </span>
      ),
      dataIndex: 'expires',
      key: 'expires',
      align: alignLeft,
      width: 170,
      render: (expires: string) => {
        return <p className="text-base text-heading">{expires}</p>;
      },
    },
    {
      title: ' ',
      dataIndex: '',
      align: alignRight,
      width: 80,
      render: (card: any) => {
        return (
          <div className="relative flex items-center justify-end">
            <Action card={card} payments={payments} />
          </div>
        );
      },
    },
  ];

  return (
    <Table
      //@ts-ignore
      columns={columns}
      data={payments}
      className="w-full shadow-none card-view-table"
      scroll={{ x: 330, y: 500 }}
      rowClassName={(record, i) =>
        record?.default_card ? 'row-highlight' : ''
      }
      emptyText={t('text-no-card-found')}
    />
  );
};

export default CardsView;
