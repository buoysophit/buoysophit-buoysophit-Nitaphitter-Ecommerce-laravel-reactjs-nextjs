import { BecomeSellerFormProps } from '@/components/become-seller/type';
import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useTranslation } from 'next-i18next';

const Contact = ({ register, errors }: BecomeSellerFormProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
      <Description
        title={t('form:contact-title')}
        details={t('form:contact-description')}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={t('form:input-title')}
          {...register('page_options.contact.title')}
          error={t(errors?.page_options?.contact?.title?.message)}
          variant="outline"
          className="mb-5"
          required
        />
        <TextArea
          label={t('form:input-description')}
          variant="outline"
          {...register('page_options.contact.description')}
          error={t(errors?.page_options?.contact?.description?.message)}
          className="mb-5"
          required
        />
      </Card>
    </div>
  );
};

export { Contact };
