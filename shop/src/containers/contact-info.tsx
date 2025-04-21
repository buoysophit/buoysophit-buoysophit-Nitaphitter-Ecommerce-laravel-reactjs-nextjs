import GoogleStaticMap from '@components/common/google-static-map';
import ContactInfoItem from '@components/ui/contact-info-block';
import HorizontalSocialLink from '@components/ui/horizontal-social-list';
import { useSettings } from '@contexts/settings.context';
import { formatAddress } from '@lib/format-address';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { IoCallSharp, IoLocationSharp, IoMail } from 'react-icons/io5';

interface Props {
  image?: HTMLImageElement;
}

const ContactInfoBlock: FC<Props> = () => {
  const settings = useSettings();
  const { t } = useTranslation('common');
  return (
    <div className="mb-6 lg:border lg:rounded-md border-gray-300 lg:p-7">
      <h4 className="text-2xl md:text-lg font-bold text-heading pb-7 md:pb-10 lg:pb-6 -mt-1">
        {t('text-find-us-here')}
      </h4>

      {/* Address */}
      <ContactInfoItem
        title={t('text-address')}
        data={
          !isEmpty(settings?.contactDetails?.location)
            ? formatAddress(settings?.contactDetails?.location)
            : t('text-no-address')
        }
      >
        <IoLocationSharp />
      </ContactInfoItem>

      {/* Email */}
      <ContactInfoItem
        title={t('text-email')}
        data={
          settings?.contactDetails?.emailAddress
            ? settings?.contactDetails?.emailAddress
            : t('text-no-email')
        }
      >
        <IoMail />
      </ContactInfoItem>

      {/* Phone */}
      <ContactInfoItem
        title={t('text-phone')}
        data={
          settings?.contactDetails?.contact ? (
            settings?.contactDetails?.contact
          ) : (
            <p className="text-red-500">{t('text-no-phone')}</p>
          )
        }
      >
        <IoCallSharp />
      </ContactInfoItem>

      {!isEmpty(settings?.contactDetails?.socials) ? (
        <HorizontalSocialLink socials={settings?.contactDetails?.socials} />
      ) : (
        ''
      )}

      {/* Google Map */}
      {!isEmpty(settings?.contactDetails?.location) && (
        <GoogleStaticMap
          lat={settings?.contactDetails?.location?.lat}
          lng={settings?.contactDetails?.location?.lng}
        />
      )}
    </div>
  );
};

export default ContactInfoBlock;
