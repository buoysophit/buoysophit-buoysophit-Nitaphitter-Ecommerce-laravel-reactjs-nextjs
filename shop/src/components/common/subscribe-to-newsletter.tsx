import MailchimpForm, {
  subscribeAtomSuccessfully,
} from '@components/common/mailchimp-form';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { useSettings } from '@framework/settings';

type SubscribeToNewsletterProps = {
  title?: string;
  description?: string;
  layout?: 'subscribe' | 'newsletter';
};
export default function SubscribeToNewsletter({
  title,
  description,
  layout = 'subscribe',
}: SubscribeToNewsletterProps) {
  const { t } = useTranslation('common');
  const [successMessage] = useAtom(subscribeAtomSuccessfully);
  const { data } = useSettings();
  return (
    <div className="flex flex-col">
      {title ? (
        <h3 className="text-heading mt-3 mb-7 text-xl font-semibold">
          {t(title)}
        </h3>
      ) : (
        ''
      )}
      {description ? (
        <p className="text-heading mb-7 text-sm">{t(description!)}</p>
      ) : (
        ''
      )}
      {successMessage ? (
        <div
          className="rounded border-[1px] border-green-950 bg-green-50 px-4 py-3 text-heading"
          role="alert"
        >
          <div className="flex items-center justify-center ">
            <div className="py-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-6 w-6 fill-current text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div>
              <p className="font-bold">
                {data?.options?.mailchimpSubscribeText}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <MailchimpForm layout={layout} />
      )}
    </div>
  );
}
