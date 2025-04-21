import * as yup from 'yup';
import { MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR } from '@/utils/constants';

const showcaseValidationSchema = yup.object().shape({
  image: yup
    .mixed()
    .required()
    .test('file', 'form:error-image', (value) => {
      if (value && Object.keys(value).length > 0) {
        return true;
      }
      return false;
    }),
  title: yup.string().required('form:error-title-required'),
  description: yup.string().required('form:error-description-required'),
  buttonName: yup.string().nullable(),
  buttonLink: yup.string().url().nullable(),
  button2Name: yup.string().nullable(),
  button2Link: yup.string().url().nullable(),
});

export const becomeSellerValidationSchema = yup.object().shape({
  page_options: yup.object().shape({
    banner: yup.object().shape({
      image: yup
        .mixed()
        .required()
        .test('file', 'form:error-image', (value) => {
          if (value && Object.keys(value).length > 0) {
            return true;
          }
          return false;
        }),
      newsTickerTitle: yup.string().nullable(),
      newsTickerURL: yup.string().url().nullable(),
      title: yup.string().required('form:error-title-required'),
      description: yup.string().required('form:error-description-required'),
      button1Name: yup.string().nullable(),
      button1Link: yup.string().url().nullable(),
      button2Name: yup.string().nullable(),
      button2Link: yup.string().url().nullable(),
    }),

    sellingStepsTitle: yup.string().required('form:error-title-required'),
    sellingStepsDescription: yup
      .string()
      .required('form:error-description-required'),
    sellingStepsItem: yup
      .array()
      .min(1, 'form:error-minimum-one-required')
      .of(
        yup.object().shape({
          title: yup.string().required('form:error-title-required'),
          description: yup.string().required('form:error-description-required'),
          image: yup
            .mixed()
            .required()
            .test('file', 'form:error-image', (value) => {
              if (value && Object.keys(value).length > 0) {
                return true;
              }
              return false;
            }),
        }),
      )
      .required(),

    userStoryTitle: yup.string().nullable(),
    userStoryDescription: yup.string().nullable(),
    userStories: yup.array().of(
      yup.object().shape({
        title: yup.string().required('form:error-title-required'),
        description: yup.string().required('form:error-description-required'),
        link: yup
          .string()
          .url('form:error-url-valid-required')
          .required('form:error-url-required'),
        thumbnail: yup.mixed().nullable(),
      }),
    ),

    purposeTitle: yup.string().required('form:error-title-required'),
    purposeDescription: yup
      .string()
      .required('form:error-description-required'),
    purposeItems: yup
      .array()
      .min(1, 'form:error-minimum-one-required')
      .of(
        yup.object().shape({
          title: yup.string().required('form:error-title-required'),
          description: yup.string().required('form:error-description-required'),
          icon: yup
            .object()
            .shape({
              value: yup.string().required('form:error-icon-required'),
            })
            .required('form:error-icon-required'),
        }),
      )
      .required(),

    commissionTitle: yup.string().required('form:error-title-required'),
    commissionDescription: yup.string().required('form:error-title-required'),

    dashboard: showcaseValidationSchema,

    guidelineTitle: yup.string().required('form:error-title-required'),
    guidelineDescription: yup
      .string()
      .required('form:error-description-required'),
    guidelineItems: yup
      .array()
      .min(1, 'form:error-minimum-one-required')
      .of(
        yup.object().shape({
          title: yup.string().required('form:error-title-required'),
          link: yup.string().url().nullable(),
        }),
      )
      .required(),

    faqTitle: yup.string().required('form:error-title-required'),
    faqDescription: yup.string().required('form:error-title-required'),
    faqItems: yup
      .array()
      .min(1, 'form:error-minimum-one-required')
      .of(
        yup.object().shape({
          title: yup.string().required('form:error-title-required'),
          description: yup
            .string()
            .required('form:error-description-required')
            .max(
              MAXIMUM_WORD_COUNT_FOR_RICH_TEXT_EDITOR,
              'form:error-description-maximum-title',
            )
            .test({
              name: 'description',
              skipAbsent: true,
              test(item, ctx) {
                if (
                  item?.replace(/<(.|\n)*?>/g, '')?.trim()?.length === 0 &&
                  !item?.includes('<img')
                ) {
                  return ctx.createError({
                    message: 'form:error-description-required',
                  });
                }
                return true;
              },
            }),
        }),
      )
      .required(),

    contact: yup.object().shape({
      title: yup.string().required('form:error-title-required'),
      description: yup.string().required('form:error-description-required'),
    }),

    sellerOpportunity: showcaseValidationSchema,

    defaultCommissionDetails: yup.string().when('isMultiCommissionRate', {
      is: (data: boolean) => !data,
      then: () => yup.string().required('form:error-description-required'),
      otherwise: () => yup.string().nullable(),
    }),
    defaultCommissionRate: yup.number().when('isMultiCommissionRate', {
      is: (data: boolean) => !data,
      then: () =>
        yup
          .number()
          .required('form:error-commission-rate-required')
          .typeError('form:error-commission-rate-type')
          .positive('form:error-commission-rate-positive'),
      otherwise: () => yup.number().nullable(),
    }),
  }),
  commissions: yup.array().when('page_options.isMultiCommissionRate', {
    is: (data: boolean) => data,
    then: () =>
      yup
        .array()
        .min(1, 'form:error-minimum-one-required')
        .of(
          yup.object().shape({
            level: yup.string().required('form:error-title-required'),
            sub_level: yup.string().required('form:error-subtitle-required'),
            description: yup
              .string()
              .required('form:error-description-required'),
            min_balance: yup
              .number()
              .typeError('form:error-minimum-balance-must-be-number')
              .required('form:error-minimum-balance-is-required'),
            max_balance: yup
              .string()
              .matches(/^[0-9]|\W|over$/, 'form:error-maximum-balance-type')
              .required('form:error-maximum-balance-is-required'),
            commission: yup
              .number()
              .required('form:error-commission-rate-required')
              .typeError('form:error-commission-rate-type')
              .positive('form:error-commission-rate-positive'),
            image: yup.mixed().test('file', 'form:error-image', (value) => {
              if (value && Object.keys(value).length > 0) {
                return true;
              }
              return false;
            }),
          }),
        )
        .required(),
    otherwise: () => yup.array().nullable(),
  }),
});
