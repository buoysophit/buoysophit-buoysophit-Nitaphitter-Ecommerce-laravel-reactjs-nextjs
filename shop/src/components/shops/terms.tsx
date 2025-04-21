import NotFound from '@components/404/not-found';
import Button from '@components/ui/button';
import { Link, Element } from 'react-scroll';
import Spinner from '@components/ui/loaders/spinner/spinner';
import { TermsAndConditions } from '@type/index';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useSanitizeContent } from '@lib/sanitize-content';

export const makeTitleToDOMId = (title: string) => {
  return title.toLowerCase().split(' ').join('_');
};

type TermsAndConditionsProps = {
  isLoading: boolean;
  terms: TermsAndConditions[];
  hasNextPage: boolean;
  loadMore: () => void;
  isLoadingMore: boolean;
};

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  isLoading,
  terms,
  hasNextPage,
  loadMore,
  isLoadingMore,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {isLoading ? (
        <Spinner className="!h-auto" />
      ) : isEmpty(terms) ? (
        <NotFound text="No terms's and conditions found 😞." />
      ) : (
        <div className="flex flex-col md:flex-row">
          <nav className="md:w-72 xl:w-3/12 mb-8 md:mb-0">
            <ol className="sticky md:top-16 lg:top-28 z-10">
              {terms?.map((item, index) => (
                <li key={item.id}>
                  <Link
                    spy={true}
                    offset={-120}
                    smooth={true}
                    duration={500}
                    to={makeTitleToDOMId(item.title)}
                    activeClass="text-heading font-semibold"
                    className="block cursor-pointer py-3 lg:py-3.5 text-sm lg:text-base  text-gray-700 uppercase"
                  >
                    {(index <= 9 ? '0' : '') + index + ' ' + t(`${item.title}`)}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
          {/* End of section scroll spy menu */}

          <div className="md:w-9/12 ltr:md:pl-8 rtl:md:pr-8">
            {terms?.map((item, index) => (
              <Element
                key={index}
                id={makeTitleToDOMId(item?.title)}
                className="mb-10"
                name={item?.title}
              >
                <TermsItem term={item} />
              </Element>
            ))}

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
          </div>
          {/* End of content */}
        </div>
      )}
    </>
  );
};

export const TermsItem = ({ term }: { term: TermsAndConditions }) => {
  const { t } = useTranslation();
  const content = useSanitizeContent({ description: term?.description });
  return (
    <>
      <h2 className="text-lg md:text-xl lg:text-2xl text-heading font-bold mb-4">
        {t(`${term?.title}`)}
      </h2>
      {content ? (
        <div
          className="text-heading text-sm leading-7 lg:text-base lg:leading-loose react-editor-description"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        />
      ) : (
        ''
      )}
    </>
  );
};

export default TermsAndConditions;
