import Button from "@components/ui/button";
import Input from "@components/ui/input";
import Label from "@components/ui/label";
import { RadioBox as Radio } from "@components/ui/radiobox";
import TextArea from "@components/ui/text-area";
import { useTranslation } from "next-i18next";
import * as yup from "yup";
import { AddressType } from "@framework/utils/constants";
import { Form } from "@components/ui/forms/form";
import { useUpdateCustomer } from "@framework/customer";
import { useUI } from "@contexts/ui.context";
import { GoogleMapLocation } from "@type/index";

type FormValues = {
  __typename?: string;
  title: string;
  type: AddressType;
  address: {
    country: string;
    city: string;
    state: string;
    zip: string;
    street_address: string;
  };
  location: GoogleMapLocation;
};

const addressSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf([AddressType?.Billing, AddressType?.Shipping])
    .required("error-type-required"),
  title: yup.string().required("error-title-required"),
  address: yup.object().shape({
    country: yup.string().required("error-country-required"),
    city: yup.string().required("error-city-required"),
    state: yup.string().required("error-state-required"),
    zip: yup.string().required("error-zip-required"),
    street_address: yup.string().required("error-street-required"),
  }),
});

export const AddressForm: React.FC<any> = ({
  onSubmit,
  defaultValues,
  isLoading,
}) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Form<FormValues>
        onSubmit={onSubmit}
        className="grid h-full grid-cols-2 gap-5"
        //@ts-ignore
        validationSchema={addressSchema}
        useFormProps={{
          shouldUnregister: true,
          defaultValues,
        }}
        resolver={defaultValues}
      >
        {({ register, formState: { errors } }) => {
          return (
            <>
              <div>
                <Label>{t('text-type')}</Label>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Radio
                    id="billing"
                    {...register('type')}
                    type="radio"
                    value={AddressType?.Billing}
                    labelKey={t('text-billing')}
                  />
                  <Radio
                    id="shipping"
                    {...register('type')}
                    type="radio"
                    value={AddressType?.Shipping}
                    labelKey={t('text-shipping')}
                  />
                </div>
              </div>

              <Input
                labelKey={t("text-title")}
                {...register("title")}
                errorKey={t(errors?.title?.message!)}
                variant="outline"
                className="col-span-2"
              />
              <Input
                labelKey={t('text-country')}
                {...register('address.country')}
                errorKey={t(errors?.address?.country?.message!)}
                variant="outline"
              />

              <Input
                labelKey={t('text-city')}
                {...register('address.city')}
                errorKey={t(errors?.address?.city?.message!)}
                variant="outline"
              />

              <Input
                labelKey={t('text-state')}
                {...register('address.state')}
                errorKey={t(errors?.address?.state?.message!)}
                variant="outline"
              />

              <Input
                labelKey={t('text-zip')}
                {...register('address.zip')}
                errorKey={t(errors?.address?.zip?.message!)}
                variant="outline"
              />

              <TextArea
                labelKey={t('text-street-address')}
                {...register('address.street_address')}
                errorKey={t(errors?.address?.street_address?.message!)}
                variant="outline"
                className="col-span-2"
              />

              <Button
                className="w-full col-span-2"
                loading={isLoading}
                disabled={isLoading}
              >
                {Boolean(defaultValues) ? t('text-update') : t('text-save')}{' '}
                {t('text-address')}
              </Button>
            </>
          )
        }}
      </Form>
    </>
  );
};

export default function CreateOrUpdateAddressForm() {
  const { t } = useTranslation('common');
  const {
    modalData: { customerId, address, type },
    closeModal,
  } = useUI();

  const { mutate: updateProfile } = useUpdateCustomer();

  const onSubmit = (values: FormValues) => {
    const formattedInput = {
      id: address?.id,
      // customer_id: customerId,
      title: values?.title,
      type: values?.type,
      address: {
        ...values.address,
      },
      location: values?.location,
    };
    updateProfile({
      id: customerId,
      address: [formattedInput],
    });
    closeModal();
  };

  return (
    <div className="p-5 bg-white sm:p-8 max-w-lg sm:min-w-[450px]  md:rounded-xl">
      <h1 className="mb-4 text-lg font-semibold text-center text-heading sm:mb-6">
        {address ? t('text-update') : t('text-add-new')} {t('text-address')}
      </h1>
      <AddressForm
        onSubmit={onSubmit}
        defaultValues={{
          title: address?.title ?? '',
          type: address?.type ?? type,
          address: {
            city: address?.address?.city ?? '',
            country: address?.address?.country ?? '',
            state: address?.address?.state ?? '',
            zip: address?.address?.zip ?? '',
            street_address: address?.address?.street_address ?? '',
            ...address?.address,
          },
          location: address?.location ?? '',
        }}
      />
    </div>
  );
}