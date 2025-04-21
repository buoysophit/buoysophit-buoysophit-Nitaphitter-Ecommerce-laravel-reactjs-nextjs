import { BecomeSellerFormProps } from '@/components/become-seller/type';
import Card from '@/components/common/card';
import Accordion from '@/components/ui/accordion';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { bytesToMegabytes } from '@/utils/bytes-to-megabytes';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useFieldArray } from 'react-hook-form';

const UserStory = ({
  register,
  control,
  errors,
  max_fileSize,
  watch,
}: BecomeSellerFormProps) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'page_options.userStories',
  });
  return (
    <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
      <Description
        title={t('form:user-story-title')}
        details={t('form:user-story-description')}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={t('form:input-title')}
          {...register('page_options.userStoryTitle')}
          error={t(errors?.page_options?.userStoryTitle?.message)}
          variant="outline"
          className="mb-5"
        />
        <TextArea
          label={t('form:input-description')}
          variant="outline"
          {...register('page_options.userStoryDescription')}
          error={t(errors?.page_options?.userStoryDescription?.message)}
          className="mb-5"
        />

        <div
          className={classNames(
            !isEmpty(fields)
              ? 'border-t pt-5 border-dashed border-border-200'
              : '',
          )}
        >
          {fields?.map(
            (
              item: any & {
                id: string;
              },
              index: number,
            ) => {
              let error =
                errors?.page_options?.userStories?.[index]?.title?.message ||
                errors?.page_options?.userStories?.[index]?.description
                  ?.message ||
                errors?.page_options?.userStories?.[index]?.link?.message;
              return (
                <div
                  className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-0 md:py-8"
                  key={item.id}
                >
                  <Accordion
                    buttonTitle={
                      !isEmpty(watch(`page_options.userStories.${index}.title`))
                        ? watch(`page_options.userStories.${index}.title`)
                        : `${t('form:text-story-item')} ${index + 1}`
                    }
                    defaultOpen={true}
                    isError={Boolean(error)}
                    className="pt-5 grid grid-cols-1 gap-5 sm:grid-cols-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:col-span-4">
                      <Input
                        label={t('form:input-title')}
                        variant="outline"
                        {...register(
                          `page_options.userStories.${index}.title` as const,
                        )}
                        required
                        error={t(
                          errors?.page_options?.userStories?.[index]?.title
                            ?.message,
                        )}
                      />
                      <TextArea
                        label={t('form:input-description')}
                        variant="outline"
                        {...register(
                          `page_options.userStories.${index}.description` as const,
                        )}
                        error={t(
                          errors?.page_options?.userStories?.[index]?.title
                            ?.message,
                        )}
                        required
                      />
                      <Input
                        type="url"
                        label={`${t('form:text-video-link')} (Youtube/Vimeo)`}
                        variant="outline"
                        {...register(
                          `page_options.userStories.${index}.link` as const,
                        )}
                        required
                        error={t(
                          errors?.page_options?.userStories?.[index]?.link
                            ?.message,
                        )}
                      />
                      <FileInput
                        label={t('form:text-video-thumbnail')}
                        name={`page_options.userStories.${index}.thumbnail`}
                        control={control}
                        multiple={false}
                        maxSize={max_fileSize}
                        error={t(
                          errors?.page_options?.userStories?.[index]?.thumbnail
                            ?.message,
                        )}
                        toolTipText={`${t('form:upload-image-help-text')} ${t(
                          'form:upload-image-help-text-dimension',
                        )} 602 x 339 ${t(
                          'common:text-pixel-dot',
                        ).toLowerCase()} ${t(
                          'form:size-help-text',
                        )} ${bytesToMegabytes(max_fileSize)} MB`}
                      />
                    </div>
                    <div className="sm:col-span-1 sm:mt-4 sm:text-right">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(t('form:remove-item-confirmation'))
                          ) {
                            remove(index);
                          }
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none"
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>
                  </Accordion>
                </div>
              );
            },
          )}

          {errors?.page_options?.userStories?.message ||
          errors?.page_options?.userStories?.root?.message ? (
            <Alert
              message={t(
                errors?.page_options?.userStories?.message ||
                  errors?.page_options?.userStories?.root?.message,
              )}
              variant="error"
              className="my-5"
            />
          ) : (
            ''
          )}
        </div>
        <Button
          type="button"
          onClick={() =>
            append({ title: '', description: '', link: '', thumbnail: '' })
          }
          className="w-full sm:w-auto"
        >
          {t('form:text-add-user-story')}
        </Button>
      </Card>
    </div>
  );
};

export { UserStory };
