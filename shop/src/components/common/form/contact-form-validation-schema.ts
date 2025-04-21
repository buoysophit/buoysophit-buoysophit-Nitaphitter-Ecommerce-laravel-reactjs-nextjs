import * as yup from 'yup';

export const contactFormSchema = yup.object().shape({
  name: yup.string().required('forms:error-name-required'),
  email: yup
    .string()
    .email('forms:error-email-format')
    .required('forms:error-email-required'),
  subject: yup.string().required('forms:error-subject-required'),
  description: yup.string().required('forms:error-description-required'),
});
