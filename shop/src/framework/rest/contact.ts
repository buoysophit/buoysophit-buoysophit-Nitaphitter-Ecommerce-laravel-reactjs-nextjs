import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import client from '@framework/utils/index'

export const useContact = () => {
  const { t } = useTranslation('common');
  return useMutation(client.contact.create, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(t(data.message));
      } else {
        toast.error(t(data.message));
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(t(data?.message));
    },
  });
};