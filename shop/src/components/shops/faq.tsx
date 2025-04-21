import NotFound from '@components/404/not-found';
import Accordion from '@components/common/accordion';
import Button from '@components/ui/button';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { FAQS } from '@type/index';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

type FAQProps = {
  isLoading: boolean;
  faqs: FAQS[];
  hasNextPage: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
};

const FAQAccordion: React.FC<FAQProps> = ({
  isLoading,
  faqs,
  hasNextPage,
  loadMore,
  isLoadingMore,
}) => {
  const { t } = useTranslation();
  return (
    <div className="py-16 lg:py-20 px-0 max-w-5xl mx-auto space-y-4">
      {isLoading ? (
        <Spinner className="!h-auto" />
      ) : isEmpty(faqs) ? (
        <NotFound text="No FAQ's Found 😞." />
      ) : (
        <>
          <Accordion items={faqs} translatorNS="faq" />
          {hasNextPage && (
            <div className="mt-8 grid place-content-center md:mt-10">
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                loading={isLoadingMore}
              >
                {t('button-load-more')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FAQAccordion;
