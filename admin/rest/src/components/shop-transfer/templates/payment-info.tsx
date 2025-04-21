import { AlignType, Table } from '@/components/ui/table';
import { PaymentInfo } from '@/types';
import { useIsRTL } from '@/utils/locals';
import { useTranslation } from 'next-i18next';

type IProps = {
  data: PaymentInfo[];
};

const BankAccount = ({ data }: IProps) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();

  let columns = [
    {
      title: 'Account Holder Name',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft as AlignType,
      render: (name: string) => <span className="capitalize">{name}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: alignLeft as AlignType,
    },
    {
      title: 'Bank Name',
      dataIndex: 'bank',
      key: 'bank',
      align: alignLeft as AlignType,
    },
    {
      title: 'Account Number',
      dataIndex: 'account',
      key: 'account',
      align: alignLeft as AlignType,
    },
  ];

  return (
    <Table
      columns={columns}
      emptyText={() => (
        <div className="flex flex-col items-center">
          <div className="mb-1 text-base font-semibold text-heading">
            {t('table:empty-table-data')}
          </div>
          <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
        </div>
      )}
      data={data}
      rowKey="id"
      scroll={{ x: 800 }}
    />
  );
};

export { BankAccount };
