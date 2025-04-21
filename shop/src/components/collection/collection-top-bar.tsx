import Text from '@components/ui/text';
import { useUI } from '@contexts/ui.context';
import { useTranslation } from 'next-i18next';
import React, { useCallback } from 'react';
import { MdCollectionsBookmark } from 'react-icons/md';

type Props = {
  collectionTitle: string;
  searchResultCount: number | undefined;
};

const CollectionTopBar: React.FC<Props> = ({
  collectionTitle,
  searchResultCount,
}) => {
  const { t } = useTranslation('common');
  const { openSidebar } = useUI();
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

  return (
    <div className="flex justify-between items-center mb-7">
      <Text
        variant="pageHeading"
        className="hidden lg:inline-flex pb-1 capitalize"
      >
        {collectionTitle}
      </Text>
      <button
        className="lg:hidden text-heading text-sm px-4 py-2 font-semibold border border-gray-300 rounded-md flex items-center transition duration-200 ease-in-out focus:outline-none hover:bg-gray-200"
        onClick={() => handleSidebar('DISPLAY_COLLECTION_FILTER')}
      >
        <MdCollectionsBookmark className="text-lg" />
        <span className="ltr:pl-2 rtl:pr-2">{t('text-filters')}</span>
      </button>
      <div className="flex items-center justify-end">
        <div className="flex-shrink-0 text-body text-xs md:text-sm leading-4">
          {searchResultCount ?? 0} {t('text-items')}
        </div>
      </div>
    </div>
  );
};

export default CollectionTopBar;
