import FilterIcon from '@components/icons/filter-icon';
import ListBox from '@components/ui/list-box';
import Text from '@components/ui/text';
import { useUI } from '@contexts/ui.context';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

type Props = {
  searchResultCount: number | undefined;
};

const SearchTopBar: React.FC<Props> = ({ searchResultCount }) => {
  const { query } = useRouter();
  const { t } = useTranslation('common');
  const { openSidebar, closeSidebar } = useUI();
  const handleSidebar = useCallback(
    (view: string) => {
      return openSidebar({
        view,
        data: {
          searchResultCount: searchResultCount ?? 0,
        },
      });
    },
    [searchResultCount],
  );

  useEffect(() => {
    if (query) {
      closeSidebar();
    }
  }, [query]);

  return (
    <div className="flex justify-between items-center mb-7">
      <Text variant="pageHeading" className="hidden lg:inline-flex pb-1">
        {isEmpty(query) ? t('text-shop') : t('text-search-result')}
      </Text>
      <button
        className="lg:hidden text-heading text-sm px-4 py-2 font-semibold border border-gray-300 rounded-md flex items-center transition duration-200 ease-in-out focus:outline-none hover:bg-gray-200"
        onClick={() => handleSidebar('DISPLAY_FILTER')}
      >
        <FilterIcon />
        <span className="ltr:pl-2.5 rtl:pr-2.5">{t('text-filters')}</span>
      </button>
      <div className="flex items-center justify-end">
        <div className="flex-shrink-0 text-body text-xs md:text-sm leading-4 ltr:pr-4 rtl:pl-4 ltr:md:mr-6 rtl:md:ml-6 ltr:pl-2 rtl:pr-2 hidden lg:block">
          {searchResultCount ?? 0} {t('text-items')}
        </div>
        <ListBox
          options={[
            { name: 'text-sorting-options', value: 'options' },
            { name: 'text-oldest', value: 'created_at|ASC' },
            { name: 'text-popularity', value: 'orders_count|DESC' },
            { name: 'text-price-low-high', value: 'min_price|ASC' },
            { name: 'text-price-high-low', value: 'max_price|DESC' },
          ]}
        />
      </div>
    </div>
  );
};

export default SearchTopBar;
