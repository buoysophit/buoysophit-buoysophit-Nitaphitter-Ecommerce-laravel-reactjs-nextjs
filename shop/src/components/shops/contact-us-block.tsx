import ContactInfoItem from '@components/ui/contact-info-block';
import HorizontalSocialLink from '@components/ui/horizontal-social-list';
import { formatAddress } from '@lib/format-address';
import { Shop } from '@type/index';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { IoCallSharp, IoLocationSharp, IoMail } from 'react-icons/io5';

type ContactUsBlockProps = {
  shop: Shop;
};

const ContactUsBlock: React.FC<ContactUsBlockProps> = ({ shop }) => {
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
          !isEmpty(shop?.address)
            ? formatAddress(shop?.address)
            : t('text-no-address')
        }
      >
        <IoLocationSharp />
      </ContactInfoItem>

      {/* Phone */}
      <ContactInfoItem
        title={t('text-phone')}
        data={
          shop?.settings?.contact ? (
            shop?.settings?.contact
          ) : (
            <p className="text-red-500">{t('text-no-phone')}</p>
          )
        }
      >
        <IoCallSharp />
      </ContactInfoItem>

      {/* Email */}
      <ContactInfoItem
        title={t('text-email')}
        data={shop?.owner?.email ? shop?.owner?.email : t('text-no-email')}
      >
        <IoMail />
      </ContactInfoItem>

      {!isEmpty(shop?.settings?.socials) ? (
        <HorizontalSocialLink
          socials={shop?.settings?.socials}
          className="pb-0"
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default ContactUsBlock;
