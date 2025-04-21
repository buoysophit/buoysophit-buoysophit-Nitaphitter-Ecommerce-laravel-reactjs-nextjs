import { BecomeSellerFormProps } from '@/components/become-seller/type';
import { updatedIcons } from '@/components/become-seller/updated-icon';
import Card from '@/components/common/card';
import Accordion from '@/components/ui/accordion';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import SelectInput from '@/components/ui/select-input';
import TextArea from '@/components/ui/text-area';
import { BusinessPurposeItem } from '@/types';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useFieldArray } from 'react-hook-form';

const BusinessPurpose = ({
  register,
  control,
  errors,
  watch,
  purposeItems,
}: BecomeSellerFormProps & {
  purposeItems?: BusinessPurposeItem[];
}) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'page_options.purposeItems',
  });
  return (
    <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
      <Description
        title={t('form:business-purpose-title')}
        details={t('form:business-purpose-description')}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={t('form:input-title')}
          {...register('page_options.purposeTitle')}
          error={t(errors?.page_options?.purposeTitle?.message)}
          variant="outline"
          className="mb-5"
          required
        />

        <TextArea
          label={t('form:input-description')}
          variant="outline"
          {...register('page_options.purposeDescription')}
          error={t(errors?.page_options?.purposeDescription?.message)}
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
              errors?.page_options?.purposeItems?.[index]?.icon?.value
                ?.message ||
              errors?.page_options?.purposeItems?.[index]?.title?.message ||
              errors?.page_options?.purposeItems?.[index]?.description?.message;
            return (
              <div
                className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-0 md:py-8"
                key={item.id}
              >
                <Accordion
                  buttonTitle={
                    !isEmpty(watch(`page_options.purposeItems.${index}.title`))
                      ? watch(`page_options.purposeItems.${index}.title`)
                      : `${t('form:text-business-purpose-item')} ${index + 1}`
                  }
                  defaultOpen={true}
                  isError={Boolean(error)}
                  className="pt-5 grid grid-cols-1 gap-5 sm:grid-cols-5"
                >
                  <div className="space-y-5 sm:col-span-4">
                    <Input
                      showLabel={false}
                      {...register(
                        `page_options.purposeItems.${index}.id` as const,
                      )}
                      variant="outline"
                      type="hidden"
                      value={
                        purposeItems?.[index]?.id
                          ? purposeItems?.[index]?.id
                          : index + 1
                      }
                      disabled
                    />
                    <div>
                      <SelectInput
                        name={`page_options.purposeItems.${index}.icon`}
                        control={control}
                        options={updatedIcons}
                        isClearable={true}
                        placeholder={t('form:input-label-select-icon')}
                        label={t('form:input-label-select-icon')}
                        error={t(
                          errors?.page_options?.purposeItems?.[index]?.icon
                            ?.value?.message,
                        )}
                        required
                      />
                    </div>
                    <Input
                      label={t('form:input-title')}
                      variant="outline"
                      {...register(
                        `page_options.purposeItems.${index}.title` as const,
                      )}
                      error={t(
                        errors?.page_options?.purposeItems?.[index]?.title
                          ?.message,
                      )}
                      required
                    />
                    <TextArea
                      label={t('form:input-description')}
                      variant="outline"
                      {...register(
                        `page_options.purposeItems.${index}.description` as const,
                      )}
                      error={t(
                        errors?.page_options?.purposeItems?.[index]?.description
                          ?.message,
                      )}
                      required
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

          {errors?.page_options?.purposeItems?.message ||
          errors?.page_options?.purposeItems?.root?.message ? (
            <Alert
              message={t(
                errors?.page_options?.purposeItems?.message ||
                  errors?.page_options?.purposeItems?.root?.message,
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
              description: '',
              icon: {
                value: '',
              },
            })
          }
          className="w-full sm:w-auto"
        >
          {t('form:text-add-business-purpose')}
        </Button>
      </Card>
    </div>
  );
};

export { BusinessPurpose };
