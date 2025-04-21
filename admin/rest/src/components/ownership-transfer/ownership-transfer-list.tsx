import ActionButtons from '@/components/common/action-buttons';
import { NoDataFound } from '@/components/icons/no-data-found';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { AlignType, Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import {
  MappedPaginatorInfo,
  OwnershipTransfer,
  SortOrder,
  User,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Badge from '../ui/badge/badge';
import StatusColor from '@/utils/status-color';
import { getAuthCredentials } from '@/utils/auth-utils';
import { SUPER_ADMIN } from '@/utils/constants';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  userRole: string | null;
  user: User | undefined;
  ownershipTransfer: OwnershipTransfer[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const OwnershipTransferLists = ({
  userRole,
  user,
  ownershipTransfer,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const { permissions } = getAuthCredentials();
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder?.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder?.Desc
          ? SortOrder?.Asc
          : SortOrder?.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj?.sort === SortOrder?.Desc
            ? SortOrder?.Asc
            : SortOrder?.Desc,
        column: column,
      });
    },
  });

  let columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-id')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: alignLeft as AlignType,
      width: 120,
      onHeaderCell: () => onHeaderClick('id'),
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title="Request tracker"
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'transaction_identifier'
          }
          isActive={sortingObj?.column === 'transaction_identifier'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'transaction_identifier',
      key: 'transaction_identifier',
      align: alignLeft as AlignType,
      ellipsis: true,
      width: 200,
      onHeaderCell: () => onHeaderClick('transaction_identifier'),
      render: (text: string) => (
        <span className="whitespace-nowrap">{text}</span>
      ),
    },
    {
      title: 'Message',
      className: 'cursor-pointer',
      dataIndex: 'message',
      key: 'message',
      align: alignLeft as AlignType,
      width: 350,
      ellipsis: true,
      render: (text: string) =>
        text ? (
          <span
            dangerouslySetInnerHTML={{
              __html:
                text?.length < 130 ? text : text?.substring(0, 130) + '...',
            }}
          />
        ) : (
          ''
        ),
    },
    {
      title: 'Request created by',
      className: 'cursor-pointer',
      dataIndex: 'previous_owner',
      key: 'previous_owner',
      align: 'center' as AlignType,
      render: (previous_owner: any) => {
        return (
          <span className="whitespace-nowrap">{previous_owner?.name}</span>
        );
      },
    },

    {
      title: 'Shop transfer to',
      className: 'cursor-pointer',
      dataIndex: 'current_owner',
      key: 'current_owner',
      align: 'center' as AlignType,
      render: (current_owner: any) => {
        return <span className="whitespace-nowrap">{current_owner?.name}</span>;
      },
    },

    {
      title: (
        <TitleWithSort
          title="Transfer status"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'status'
          }
          isActive={sortingObj.column === 'status'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      width: 150,
      onHeaderCell: () => onHeaderClick('status'),
      render: (status: string) => (
        <Badge
          text={t(status)}
          className="capitalize"
          color={StatusColor(status)}
        />
      ),
    },

    {
      title: t('table:table-item-details'),
      dataIndex: 'id',
      key: 'details_actions',
      align: 'center' as AlignType,
      width: 150,
      render: (id: string, { transaction_identifier, is_approved }: any) => {
        return (
          <ActionButtons
            id={id}
            detailsUrl={
              userRole && userRole === 'super_admin'
                ? `/shop-transfer/${transaction_identifier}`
                : `/shop-transfer/vendor/${transaction_identifier}`
            }
          />
        );
      },
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'transaction_identifier',
      key: 'delete_actions',
      align: alignRight as AlignType,
      width: 150,
      render: (transaction_identifier: string, record: OwnershipTransfer) => (
        <ActionButtons
          id={record?.id?.toString()}
          // editUrl={`${Routes.ownershipTransferRequest.list}/edit/${transaction_identifier}`}
          deleteModalView="DELETE_OWNERSHIP_TRANSFER_REQUEST"
        />
      ),
    },
  ];

  if (!permissions?.includes(SUPER_ADMIN)) {
    columns = columns?.filter((column) => column?.key !== 'delete_actions');
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="pt-6 mb-1 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={ownershipTransfer}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OwnershipTransferLists;
