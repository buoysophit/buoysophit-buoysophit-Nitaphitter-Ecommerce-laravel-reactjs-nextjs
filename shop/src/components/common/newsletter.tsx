import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import MailchimpForm from '@components/common/mailchimp-form';

export default function Newsletter() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center">
      <div className="w-full sm:w-[450px] md:w-[550px] lg:w-[980px] xl:w-[1170px] flex flex-col max-w-full max-h-full bg-white overflow-hidden rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0 items-center justify-center bg-gray-200 hidden lg:flex lg:w-[520px] xl:w-[655px]">
            <div className="relative w-full aspect-square">
              <Image
                src="/assets/images/newsletter.jpg"
                alt="Thumbnail"
                fill
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col w-full px-5 text-center py-7 sm:p-10 md:p-12 xl:p-14">
            <h4 className="mb-2 text-xs font-semibold uppercase sm:text-sm text-body lg:mb-4">
              {t('common:text-subscribe-now')}
            </h4>
            <h2 className="mb-5 text-lg font-bold leading-8 text-heading sm:text-xl md:text-2xl sm:mb-7 md:mb-9">
              {t('common:text-newsletter-title')}
            </h2>
            <p className="text-sm leading-6 text-body md:leading-7">
              {t('common:text-newsletter-subtitle')}
            </p>
            <MailchimpForm layout="newsletter" />
          </div>
        </div>
      </div>
    </div>
  );
}
