import Card from '@/components/common/card';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useTranslation } from 'next-i18next';
import { BecomeSellerFormProps } from '@/components/become-seller/type';
import { bytesToMegabytes } from '@/utils/bytes-to-megabytes';

export const Banner = ({
  register,
  control,
  errors,
  max_fileSize,
}: BecomeSellerFormProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
      <Description
        title={t('form:banner-title')}
        details={t('form:banner-description')}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={t('form:text-news-ticker-title')}
          {...register('page_options.banner.newsTickerTitle')}
          error={t(errors?.page_options?.banner?.newsTickerTitle?.message)}
          variant="outline"
          className="mb-5"
        />
        <Input
          type="url"
          label={t('form:text-news-ticker-link')}
          {...register('page_options.banner.newsTickerURL')}
          error={t(errors?.page_options?.banner?.newsTickerURL?.message)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={t('form:input-title')}
          {...register('page_options.banner.title')}
          error={t(errors?.page_options?.banner?.title?.message)}
          variant="outline"
          className="mb-5"
          required
        />
        <TextArea
          label={t('form:input-description')}
          variant="outline"
          {...register('page_options.banner.description')}
          error={t(errors?.page_options?.banner?.description?.message)}
          className="mb-5"
          required
        />
        <Input
          label={t('form:text-primary-button-name')}
          {...register('page_options.banner.button1Name')}
          error={t(errors?.page_options?.banner?.button1Name?.message)}
          variant="outline"
          className="mb-5"
        />
        <Input
          type="url"
          label={t('form:text-primary-button-link')}
          {...register('page_options.banner.button1Link')}
          error={t(errors?.page_options?.banner?.button1Link?.message)}
          variant="outline"
          className="mb-5"
        />
        <Input
          label={t('form:text-secondary-button-name')}
          {...register('page_options.banner.button2Name')}
          error={t(errors?.page_options?.banner?.button2Name?.message)}
          variant="outline"
          className="mb-5"
        />
        <Input
          type="url"
          label={t('form:text-secondary-button-link')}
          {...register('page_options.banner.button2Link')}
          error={t(errors?.page_options?.banner?.button2Link?.message)}
          variant="outline"
          className="mb-5"
        />
        <FileInput
          name="page_options.banner.image"
          control={control}
          multiple={false}
          maxSize={max_fileSize}
          required
          label={t('form:input-label-image')}
          error={t(errors?.page_options?.banner?.image?.message)}
          toolTipText={`${t('form:upload-image-help-text')} ${t(
            'form:upload-image-help-text-dimension',
          )} 630 x 682 ${t('common:text-pixel-dot').toLowerCase()} ${t(
            'form:size-help-text',
          )} ${bytesToMegabytes(max_fileSize)} MB`}
        />
      </Card>
    </div>
  );
};
