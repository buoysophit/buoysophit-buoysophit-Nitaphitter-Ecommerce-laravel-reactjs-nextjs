import Image from 'next/image';
import { useUI } from '@contexts/ui.context';
import SubscriptionWidget from '@components/common/subscribe-to-newsletter';

const NewsLetter = () => {
  const {
    modalData: { title, description },
  } = useUI();
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-white p-8 md:h-auto md:min-h-0 md:max-w-2xl md:p-16 lg:w-screen lg:max-w-[56.25rem]">
      <div className="mb-8">
        <Image
          src={'/news-letter-icon.png'}
          alt="news letter icon"
          width={115}
          height={125}
          className="mx-auto block"
        />
      </div>
      <div className="mb-8 text-center md:mb-16">
        {title ? (
          <h2 className="mb-3 text-2xl font-bold text-heading md:text-4xl">
            {title}
          </h2>
        ) : (
          ''
        )}

        {description ? (
          <p className="mx-auto max-w-xl text-sm font-medium md:text-lg md:leading-8">
            {description}
          </p>
        ) : (
          ''
        )}
      </div>

      <div className="mx-auto max-w-md">
        <SubscriptionWidget />
      </div>
    </div>
  );
};

export default NewsLetter;
