import ActionButtons from '@/components/common/action-buttons';
import Badge from '@/components/ui/badge/badge';
import { AlignType, Table } from '@/components/ui/table';
import { Refund } from '@/types';
import { useIsRTL } from '@/utils/locals';
import StatusColor from '@/utils/status-color';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const RefundList = ({
  data,
  url,
  permission,
}: {
  data: Refund[];
  url: string;
  permission: boolean;
}) => {
  const { t } = useTranslation();
  const { alignLeft } = useIsRTL();
  let columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft as AlignType,
      width: 120,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: t('table:table-item-created-at'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center' as AlignType,
      width: 120,
      ellipsis: true,
      render: (active_date: string) => (
        <span className="whitespace-nowrap capitalize">
          {dayjs().to(dayjs.utc(active_date).tz(dayjs.tz.guess()))}
        </span>
      ),
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      width: 120,
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
      align: 'right' as AlignType,
      width: 120,
      render: (id: string) => (
        <ActionButtons id={id} detailsUrl={`${url}/${id}`} />
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
      scroll={{ x: 900 }}
    />
  );
};

export { RefundList };

