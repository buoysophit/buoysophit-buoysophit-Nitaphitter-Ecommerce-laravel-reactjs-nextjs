import * as yup from 'yup';
import { phoneRegExp, URLRegExp } from '@/utils/constants';

const currentDate = new Date();

export const shopValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  balance: yup.object().shape({
    payment_info: yup.object().shape({
      email: yup
        .string()
        .required('form:error-account-holder-email-required')
        .typeError('form:error-email-string')
        .email('form:error-email-format'),
      name: yup.string().required('form:error-account-holder-name-required'),
      bank: yup.string().required('form:error-bank-name-required'),
      account: yup
        .number()
        .positive('form:error-account-number-positive-required')
        .integer('form:error-account-number-integer-required')
        .required('form:error-account-number-required')
        .transform((value) => (isNaN(value) ? undefined : value)),
    }),
  }),
  settings: yup.object().shape({
    contact: yup
      .string()
      .required('form:error-contact-number-required')
      .matches(phoneRegExp, 'form:error-contact-number-valid-required'),
    website: yup
      .string()
      .required('form:error-website-required')
      .matches(URLRegExp, 'form:error-url-valid-required'),
    socials: yup.array().of(
      yup.object().shape({
        url: yup.string().when('icon', (data) => {
          if (data) {
            return yup.string().required('form:error-url-required');
          }
          return yup.string().nullable();
        }),
      }),
    ),
    shopMaintenance: yup
      .object()
      .when('isShopUnderMaintenance', {
        is: (data: boolean) => data,
        then: () =>
          yup.object().shape({
            title: yup.string().required('Title is required'),
            description: yup.string().required('Description is required'),
            start: yup
              .date()
              .min(
                currentDate.toDateString(),
                `Maintenance start date  field must be later than ${currentDate.toDateString()}`,
              )
              .required('Start date is required'),
            until: yup
              .date()
              .required('Until date is required')
              .min(
                yup.ref('start'),
                'Until date must be greater than or equal to start date',
              ),
          }),
      })
      .notRequired(),
  }),
});

export const approveShopSchema = yup.object().shape({
  admin_commission_rate: yup
    .number()
    .typeError('Commission rate must be a number')
    .required('You must need to set your commission rate'),
});