import { BecomeSellerFormProps } from '@/components/become-seller/type';
import Card from '@/components/common/card';
import Accordion from '@/components/ui/accordion';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useFieldArray } from 'react-hook-form';

const Guideline = ({
  register,
  control,
  errors,
  watch,
}: BecomeSellerFormProps) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'page_options.guidelineItems',
  });
  return (
    <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
      <Description
        title={t('form:guideline-title')}
        details={t('form:guideline-description')}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={t('form:input-title')}
          {...register('page_options.guidelineTitle')}
          error={t(errors?.page_options?.guidelineTitle?.message)}
          variant="outline"
          className="mb-5"
          required
        />
        <TextArea
          label={t('form:input-description')}
          variant="outline"
          {...register('page_options.guidelineDescription')}
          error={t(errors?.page_options?.guidelineDescription?.message)}
          className="mb-5"
          required
        />
        <div
          className={classNames(
            !isEmpty(fields)
              ? 'border-t pt-5 border-dashed border-border-200'
              : '',
          )}
        >
          {fields?.map((item: any & { id: string }, index: number) => {
            let error =
              errors?.page_options?.guidelineItems?.[index]?.title?.message ||
              errors?.page_options?.guidelineItems?.[index]?.link?.message;

            return (
              <div
                className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-0 md:py-8"
                key={item.id}
              >
                <Accordion
                  buttonTitle={
                    !isEmpty(
                      watch(`page_options.guidelineItems.${index}.title`),
                    )
                      ? watch(`page_options.guidelineItems.${index}.title`)
                      : `${t('form:text-guideline-item')} ${index + 1}`
                  }
                  defaultOpen={true}
                  isError={Boolean(error)}
                  className="pt-5 grid grid-cols-1 gap-5 sm:grid-cols-5"
                >
                  <div className="space-y-5 sm:col-span-4">
                    <Input
                      label={t('form:input-title')}
                      variant="outline"
                      {...register(
                        `page_options.guidelineItems.${index}.title` as const,
                      )}
                      error={t(
                        errors?.page_options?.guidelineItems?.[index]?.title
                          ?.message,
                      )}
                      required
                    />
                    <Input
                      type="url"
                      label={t('form:label-link')}
                      variant="outline"
                      {...register(
                        `page_options.guidelineItems.${index}.link` as const,
                      )}
                      error={t(
                        errors?.page_options?.guidelineItems?.[index]?.link
                          ?.message,
                      )}
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
          })}

          {errors?.page_options?.guidelineItems?.message ||
          errors?.page_options?.guidelineItems?.root?.message ? (
            <Alert
              message={t(
                errors?.page_options?.guidelineItems?.message ||
                  errors?.page_options?.guidelineItems?.root?.message,
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
            append({
              title: '',
              link: '',
            })
          }
          className="w-full sm:w-auto"
        >
          {t('form:text-add-guideline')}
        </Button>
      </Card>
    </div>
  );
};

export { Guideline };
