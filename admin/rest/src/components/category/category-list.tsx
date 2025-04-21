import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { getIcon } from '@/utils/get-icon';
import * as categoriesIcon from '@/components/icons/category';
import { SortOrder } from '@/types';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Category, MappedPaginatorInfo, Attachment } from '@/types';
import { Config } from '@/config';
import Link from '@/components/ui/link';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';
import { siteSettings } from '@/settings/site.settings';

export type IProps = {
  categories: Category[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (key: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const CategoryList = ({
  categories,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t('table:table-item-id'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 120,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 90,
      onHeaderCell: () => onHeaderClick('name'),
    },
    {
      title: t('table:table-item-details'),
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
      align: alignLeft,
      width: 200,
    },
    {
      title: t('table:table-item-image'),
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: 100,
      render: (image: Attachment[]) => {
        if (!image?.length) return null;

        return (
          <div className="flex flex-row items-center justify-center gap-x-2">
            {image?.map((image: Attachment, index: number) => (
              <Image
                src={image?.original ?? '/'}
                alt={`brand-image-${image.id}`}
                layout="fixed"
                width={40}
                height={40}
                className="overflow-hidden h-10 w-10 rounded-lg bg-gray-300 object-contain"
                key={`brand-image-${index}`}
              />
            ))}
          </div>
        );
      },
    },
    {
      title: t('table:table-item-banner-image'),
      dataIndex: 'banner_image',
      key: 'banner_image',
      align: 'center',
      width: 100,
      render: (banner_image: Attachment[]) => {
        if (!banner_image?.length) return null;
        return (
          <div className="flex flex-row items-center justify-center gap-x-2">
            {banner_image && banner_image.map(
              (image: Attachment, index: number) => (
                <Image
                  src={image?.original ?? '/'}
                  alt={`brand-image-${image.id}`}
                  layout="fixed"
                  width={40}
                  height={140}
                  className="overflow-hidden h-10 w-10 rounded-lg bg-gray-300 object-contain"
                  key={`brand-image-${index}`}
                />
              )
            )}
          </div>
        );
      },
    },
    {
      title: t('table:table-item-icon'),
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
      width: 120,
      render: (icon: string) => {
        if (!icon) return null;
        return (
          <span className="flex items-center justify-center">
            {getIcon({
              iconList: categoriesIcon,
              iconName: icon,
              className: 'w-5 h-5 max-h-full max-w-full',
            })}
          </span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-slug')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'slug'
          }
          isActive={sortingObj.column === 'slug'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'slug',
      align: alignLeft,
      width: 150,
      onHeaderCell: () => onHeaderClick('slug'),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: alignRight,
      width: 90,
      render: (slug: string, record: Category) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_CATEGORY"
          routes={Routes?.category}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={categories}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => ' ',
            rowExpandable: rowExpandable,
          }}
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

export default CategoryList;
