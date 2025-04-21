import ActionButtons from '@/components/common/action-buttons';
import Badge from '@/components/ui/badge/badge';
import { AlignType, Table } from '@/components/ui/table';
import { Withdraw } from '@/types';
import { useIsRTL } from '@/utils/locals';
import StatusColor from '@/utils/status-color';
import usePrice from '@/utils/use-price';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';

type IProps = {
  data: Withdraw[];
  url: string;
  permission: boolean;
};

const WithdrawList = ({ data, url, permission }: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  let columns = [
    {
      title: t('table:table-item-shop-id'),
      dataIndex: 'shop_id',
      key: 'shop_id',
      align: alignLeft as AlignType,
      width: 170,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: t('table:table-item-amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center' as AlignType,
      width: 200,
      render: function Render(amount: number) {
        const { price } = usePrice({
          amount: amount as number,
        });
        return <div>{price}</div>;
      },
    },
    {
      title: t('table:table-item-created-at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center' as AlignType,
      width: 300,
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      title: t('table:table-item-payment-method'),
      dataIndex: 'payment_method',
      key: 'payment_method',
      align: alignLeft as AlignType,
      width: 200,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      width: 220,
      render: (status: string) => (
        <Badge
          text={t(status)}
          className="capitalize"
          color={StatusColor(status)}
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight as AlignType,
      width: 120,
      render: (id: string) => (
        <ActionButtons detailsUrl={`${url}/${id}`} id={id} />
      ),
    },
  ];

  if (!permission) {
    columns = columns?.filter((column) => column?.key !== 'actions');
  }

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

export { WithdrawList };
