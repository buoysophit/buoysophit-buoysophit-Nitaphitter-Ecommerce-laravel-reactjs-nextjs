import { CategoryDetailSuggestion } from '@/components/category/category-ai-prompt';
import Card from '@/components/common/card';
import * as categoriesIcon from '@/components/icons/category';
import { EditIcon } from '@/components/icons/edit';
import OpenAIButton from '@/components/openAI/openAI.button';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { useModalAction } from '@/components/ui/modal/modal.context';
import SelectInput from '@/components/ui/select-input';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import TextArea from '@/components/ui/text-area';
import { Config } from '@/config';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation
} from '@/data/category';
import { useSettingsQuery } from '@/data/settings';
import { AttachmentInput, Category, ItemProps } from '@/types';
import { getIcon } from '@/utils/get-icon';
import { formatSlug } from '@/utils/use-slug';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import {
  useForm
} from 'react-hook-form';
import { categoryIcons } from './category-icons';
import { categoryValidationSchema } from './category-validation-schema';

export const updatedIcons = categoryIcons.map((item: any) => {
  item.label = (
    <div className="flex items-center space-s-5">
      <span className="flex items-center justify-center w-5 h-5">
        {getIcon({
          iconList: categoriesIcon,
          iconName: item.value,
          className: 'max-h-full max-w-full',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  slug: string;
  details: string;
  parent: any;
  image: AttachmentInput[];
  banner_image: AttachmentInput[];
  icon: any;
  // type: any;
};

const defaultValues = {
  image: [],
  banner_image: [],
  name: '',
  slug: '',
  details: '',
  parent: '',
  icon: '',
};

type IProps = {
  initialValues?: Category | undefined;
};
export default function CreateOrUpdateCategoriesForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);

  const isNewTranslation = router?.query?.action === 'translate';
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,

    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          icon: initialValues?.icon
            ? categoryIcons.find(
                (singleIcon) => singleIcon.value === initialValues?.icon!,
              )
            : '',
          ...(isNewTranslation && {
            type: null,
          }),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(categoryValidationSchema),
  });

  const { openModal } = useModalAction();
  const slugAutoSuggest = formatSlug(watch('name'));
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const generateName = watch('name');
  const categoryDetailSuggestionLists = useMemo(() => {
    return CategoryDetailSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'details',
      suggestion: categoryDetailSuggestionLists as ItemProps[],
    });
  }, [generateName]);

  const { mutate: createCategory, isLoading: creating } =
    useCreateCategoryMutation();
  const { mutate: updateCategory, isLoading: updating } =
    useUpdateCategoryMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      language: router.locale,
      name: values.name,
      slug: values.slug,
      details: values.details,
      image: values?.image?.map(({ thumbnail, original, id }) => ({
        thumbnail,
        original,
        id,
      })),
      banner_image: values?.banner_image?.map(
        ({ thumbnail, original, id }) => ({
          thumbnail,
          original,
          id,
        })
      ),
      icon: values.icon?.value || '',
      parent: values.parent?.id ?? null,
      // type_id: values.type?.id,
    };

    if (
      !initialValues ||
      !initialValues.translated_languages.includes(router.locale!)
    ) {
      createCategory({
        ...input,
        ...(initialValues?.slug && { slug: initialValues.slug }),
      });
    } else {
      updateCategory({
        ...input,
        id: initialValues.id!,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-image')}
          details={t('form:category-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple />
        </Card>
      </div>

      <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
        <Description
          title={t('form:input-label-banner-image')}
          details={t('form:category-banner-image-helper-text')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="banner_image" control={control} multiple />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:category-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
          />

          {isSlugEditable ? (
            <div className="relative mb-5">
              <Input
                label={t('form:input-label-slug')}
                {...register('slug')}
                error={t(errors.slug?.message!)}
                variant="outline"
                disabled={isSlugDisable}
              />
              <button
                className="absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                type="button"
                title={t('common:text-edit')}
                onClick={() => setIsSlugDisable(false)}
              >
                <EditIcon width={14} />
              </button>
            </div>
          ) : (
            <Input
              label={t('form:input-label-slug')}
              {...register('slug')}
              value={slugAutoSuggest}
              variant="outline"
              className="mb-5"
              disabled
            />
          )}

          <div className="relative">
            {options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription}
              />
            )}
            <TextArea
              label={t('form:input-label-details')}
              {...register('details')}
              variant="outline"
              className="mb-5"
            />
          </div>

          <div className="mb-5">
            <Label>{t('form:input-label-select-icon')}</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-category')
              : t('form:button-label-add-category')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
