import * as yup from 'yup';

export const transferShopOwnershipValidationSchema = yup.object().shape({
  vendor: yup.object().shape({
    id: yup.number().required('form:error-id-required'),
    name: yup.string().required('form:error-name-required'),
  }),
});
