import { becomeSellerValidationSchema } from '@/components/become-seller/become-seller-form-validation-schema';
import { Banner } from '@/components/become-seller/form-part/banner';
import { BusinessPurpose } from '@/components/become-seller/form-part/business-purpose';
import { FAQ } from '@/components/become-seller/form-part/faq';
import { Commission } from '@/components/become-seller/form-part/commission';
import { StartSelling } from '@/components/become-seller/form-part/start-selling';
import { updatedIcons } from '@/components/become-seller/updated-icon';
import { ArrowUp } from '@/components/icons/arrow-up';
import { BackToTopButton } from '@/components/ui/back-to-top/back-to-top';
import { useBackToTop } from '@/components/ui/back-to-top/back-to-top-context';
import Button from '@/components/ui/button';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { useUpdateBecomeSellerMutation } from '@/data/become-seller';
import { BecomeSeller, BecomeSellerInput, Settings } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DashboardShowcase } from './form-part/dashboard-showcase';
import { Guideline } from './form-part/guideline';
import { SellerOpportunity } from './form-part/seller-opportunity';
import { UserStory } from './form-part/user-story';
import { Contact } from './form-part/contact';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { useQueryClient } from 'react-query';

type IProps = {
  becomeSellerData?: BecomeSeller | null;
  settings?: Settings | null;
};

export default function BecomeSellerInfoForm({
  becomeSellerData,
  settings,
}: IProps) {
  // becomeSellerData?.page_options.page_options.
  const { t } = useTranslation();
  const { locale, reload } = useRouter();
  const { mutate: updateBecomeSellerMutation, isLoading: loading } =
    useUpdateBecomeSellerMutation();
  const { page_options, commissions } = becomeSellerData ?? {};

  const { options } = settings ?? {};
  const max_fileSize = options?.server_info?.upload_max_filesize! * 1024;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<BecomeSellerInput>({
    shouldUnregister: true,
    // @ts-ignore
    resolver: yupResolver(becomeSellerValidationSchema),
    ...(becomeSellerData
      ? {
          defaultValues: {
            page_options: {
              ...page_options?.page_options,
              purposeItems: page_options?.page_options?.purposeItems
                ? page_options?.page_options?.purposeItems?.map((item) => ({
                    description: item?.description,
                    title: item?.title,
                    icon: updatedIcons?.find(
                      (icon) => icon?.value === item?.icon?.value,
                    ),
                  }))
                : [],
            },
            commissions,
          },
        }
      : {}),
  });

  async function onSubmit(values: BecomeSellerInput) {
    updateBecomeSellerMutation(
      {
        language: locale,
        ...values,
        page_options: {
          ...values.page_options,
          purposeItems: values?.page_options?.purposeItems?.map((item) => ({
            description: item?.description,
            title: item?.title,
            icon: {
              value: item?.icon?.value,
            },
          })),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries([
            API_ENDPOINTS.BECAME_SELLER,
            { language: locale },
          ]); // re-fetch data
        },
      },
    );
  }

  const { refs } = useBackToTop();

  useEffect(() => {
    setValue(
      'page_options.isMultiCommissionRate',
      Boolean(options?.isMultiCommissionRate),
    );
  }, [options?.isMultiCommissionRate]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Banner
          register={register}
          control={control}
          errors={errors}
          max_fileSize={max_fileSize}
        />

        <StartSelling
          register={register}
          control={control}
          errors={errors}
          max_fileSize={max_fileSize}
          watch={watch}
        />

        <UserStory
          register={register}
          control={control}
          errors={errors}
          max_fileSize={max_fileSize}
          watch={watch}
        />

        <BusinessPurpose
          register={register}
          control={control}
          errors={errors}
          watch={watch}
          purposeItems={page_options?.page_options?.purposeItems}
        />

        <Commission
          register={register}
          control={control}
          errors={errors}
          max_fileSize={max_fileSize}
          watch={watch}
          isMultiCommissionRate={options?.isMultiCommissionRate}
          commissions={commissions}
        />

        <DashboardShowcase
          register={register}
          control={control}
          errors={errors}
          max_fileSize={max_fileSize}
        />

        <Guideline
          register={register}
          control={control}
          errors={errors}
          watch={watch}
        />

        <FAQ
          register={register}
          control={control}
          errors={errors}
          watch={watch}
        />

        <Contact register={register} errors={errors} control={control} />

        <SellerOpportunity
          register={register}
          control={control}
          errors={errors}
          max_fileSize={max_fileSize}
        />

        <StickyFooterPanel className="z-0">
          <Button
            loading={loading}
            disabled={loading}
            className="text-sm md:text-base"
            ref={refs.setReference}
          >
            {t('form:text-save-seller-information')}
          </Button>
        </StickyFooterPanel>
      </form>
      <BackToTopButton asChild className="shadow-md">
        <Button className="text-sm md:text-base">
          <ArrowUp />
        </Button>
      </BackToTopButton>
    </>
  );
}
