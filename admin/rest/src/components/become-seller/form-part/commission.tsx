import { BecomeSellerFormProps } from '@/components/become-seller/type';
import Card from '@/components/common/card';
import Accordion from '@/components/ui/accordion';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import SwitchInput from '@/components/ui/switch-input';
import TextArea from '@/components/ui/text-area';
import { bytesToMegabytes } from '@/utils/bytes-to-megabytes';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useFieldArray } from 'react-hook-form';

const Commission = ({
  register,
  control,
  errors,
  max_fileSize,
  watch,
  isMultiCommissionRate,
  commissions,
}: BecomeSellerFormProps) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'commissions',
  });

  return (
    <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
      <Description
        title={t('form:pricing-plan-title')}
        details={t('form:pricing-plan-description')}
        className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label={t('form:input-title')}
          {...register('page_options.commissionTitle')}
          error={t(errors?.page_options?.commissionTitle?.message!)}
          variant="outline"
          className="mb-5"
          required
        />
        <TextArea
          label={t('form:input-description')}
          variant="outline"
          {...register('page_options.commissionDescription')}
          error={t(errors?.page_options?.commissionDescription?.message)}
          className="mb-5"
          required
        />
        <SwitchInput
          name="page_options.isMultiCommissionRate"
          control={control}
          className="hidden"
        />
        {Boolean(isMultiCommissionRate) ? (
          <>
            <div
              className={classNames(
                !isEmpty(fields)
                  ? 'border-t pt-5 border-dashed border-border-200'
                  : '',
              )}
            >
              {fields?.map((item: any & { id: string }, index: number) => {
                let error =
                  errors?.commissions?.[index]?.image?.message ||
                  errors?.commissions?.[index]?.level?.message ||
                  errors?.commissions?.[index]?.sub_level?.message ||
                  errors?.commissions?.[index]?.description?.message ||
                  errors?.commissions?.[index]?.min_balance?.message ||
                  errors?.commissions?.[index]?.max_balance?.message ||
                  errors?.commissions?.[index]?.commission?.message;
                return (
                  <div
                    className="py-5 border-b border-dashed border-border-200 first:pt-0 last:border-0 md:py-8"
                    key={item.id}
                  >
                    <Accordion
                      buttonTitle={
                        !isEmpty(watch(`commissions.${index}.level`))
                          ? watch(`commissions.${index}.level`)
                          : `${t('form:text-commission-item')} ${index + 1}`
                      }
                      defaultOpen={true}
                      isError={Boolean(error)}
                      className="pt-5 grid grid-cols-1 gap-5 sm:grid-cols-5"
                    >
                      <div className="space-y-5 sm:col-span-4">
                        <Input
                          showLabel={false}
                          {...register(`commissions.${index}.id` as const)}
                          defaultValue={
                            commissions?.[index]?.id
                              ? commissions?.[index]?.id
                              : index + 1
                          }
                          variant="outline"
                          type="hidden"
                          value={
                            commissions?.[index]?.id
                              ? commissions?.[index]?.id
                              : index + 1
                          }
                          disabled
                        />
                        <FileInput
                          label={t('form:input-label-image')}
                          name={`commissions.${index}.image`}
                          control={control}
                          multiple={false}
                          maxSize={max_fileSize}
                          required
                          error={t(
                            errors?.commissions?.[index]?.image?.message,
                          )}
                          toolTipText={`${t('form:upload-image-help-text')} ${t(
                            'form:upload-image-help-text-dimension',
                          )} 80 x 80 ${t(
                            'common:text-pixel-dot',
                          ).toLowerCase()} ${t(
                            'form:size-help-text',
                          )} ${bytesToMegabytes(max_fileSize)} MB`}
                        />
                        <Input
                          required
                          label={t('form:input-title')}
                          variant="outline"
                          {...register(`commissions.${index}.level` as const)}
                          error={t(
                            errors?.commissions?.[index]?.level?.message,
                          )}
                        />
                        <Input
                          required
                          label={t('form:input-label-subtitle')}
                          variant="outline"
                          {...register(
                            `commissions.${index}.sub_level` as const,
                          )}
                          error={t(
                            errors?.commissions?.[index]?.sub_level?.message,
                          )}
                        />
                        <TextArea
                          label={t('form:input-description')}
                          required
                          variant="outline"
                          {...register(
                            `commissions.${index}.description` as const,
                          )}
                          error={t(
                            errors?.commissions?.[index]?.description?.message,
                          )}
                        />
                        <Input
                          type="number"
                          label={t('form:input-label-minimum-balance')}
                          required
                          variant="outline"
                          {...register(
                            `commissions.${index}.min_balance` as const,
                          )}
                          error={t(
                            errors?.commissions?.[index]?.min_balance?.message,
                          )}
                        />
                        <Input
                          type="number"
                          label={t('form:input-label-maximum-balance')}
                          required
                          variant="outline"
                          {...register(
                            `commissions.${index}.max_balance` as const,
                          )}
                          error={t(
                            errors?.commissions?.[index]?.max_balance?.message,
                          )}
                        />
                        <Input
                          type="number"
                          label={t('form:input-label-commission')}
                          required
                          variant="outline"
                          {...register(
                            `commissions.${index}.commission` as const,
                          )}
                          error={t(
                            errors?.commissions?.[index]?.commission?.message,
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
            </div>

            {errors?.commissions?.message ||
            errors?.commissions?.root?.message ? (
              <Alert
                message={t(
                  errors?.commissions?.message ||
                    errors?.commissions?.root?.message,
                )}
                variant="error"
                className="my-5"
              />
            ) : (
              ''
            )}
            <Button
              type="button"
              onClick={() =>
                append({
                  id: '',
                  level: '',
                  sub_level: '',
                  description: '',
                  min_balance: 0,
                  max_balance: 0,
                  commission: 0,
                  image: {
                    id: '',
                    original: '',
                    thumbnail: '',
                  },
                })
              }
              className="w-full sm:w-auto"
            >
              {t('form:text-add-commission')}
            </Button>
          </>
        ) : (
          <>
            <TextArea
              label={t('form:label-default-commission-details')}
              variant="outline"
              {...register('page_options.defaultCommissionDetails')}
              error={t(errors?.page_options?.defaultCommissionDetails?.message)}
              required
              className="mb-5"
            />
            <Input
              label={t('form:label-default-commission-rate')}
              required
              variant="outline"
              {...register('page_options.defaultCommissionRate')}
              error={t(errors?.page_options?.defaultCommissionRate?.message)}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export { Commission };
