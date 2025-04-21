import { initialOtpState, optAtom } from '@components/auth/otp/atom';
import { useUI } from "@contexts/ui.context";
import { API_ENDPOINTS } from "@framework/utils/endpoints";
import client from '@framework/utils/index';
import { useToken } from '@lib/use-token';
import { authorizationAtom } from "@store/authorization-atom";
import { clearCheckoutAtom } from "@store/checkout";
import {
  ChangePasswordInputType,
  RegisterUserInputType,
  User,
} from '@type/index';
import axios from 'axios';
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import Router, { useRouter } from 'next/router';
import { useState } from "react";
import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { setAuthCredentials } from '@lib/auth-utils';

import { AUTH_TOKEN } from '@lib/constants';
import { ROUTES } from '@lib/routes';
import Cookies from 'js-cookie';
import { useQueryClient } from 'react-query';

export function useChangePassword() {
  const { t } = useTranslation('common');
  let [formError, setFormError] =
    useState<Partial<ChangePasswordInputType> | null>(null);

  const { mutate, isLoading } = useMutation(client.auth.changePassword, {
    onSuccess: (data: any) => {
      if (!data.success) {
        setFormError({
          oldPassword: data?.message ?? '',
        });
        return;
      }
      toast.success(t('password-update-success'));
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};
      setFormError(data);
    },
  });

  return { mutate, isLoading, formError, setFormError };
}

export function useForgotPassword() {
  let [message, setMessage] = useState<string | null>(null);
  let [formError, setFormError] = useState<any>(null);

  const { mutate, isLoading } = useMutation(client.auth.forgetPassword, {
    onSuccess: (data: any) => {
      if (!data.success) {
        setFormError({
          email: data?.message ?? '',
        });
        return;
      }
      setMessage(data?.email);
    },
    onError: (error: Error) => {
      setMessage(error?.message);
    },
  });

  return { mutate, isLoading, message, formError, setFormError, setMessage };
}

export function useResendVerificationEmail() {
  const { t } = useTranslation('common');
  const { mutate, isLoading } = useMutation(
    client.auth.resendVerificationEmail,
    {
      onSuccess: (data) => {
        if (data?.success) {
          toast.success(t('PICKBAZAR_MESSAGE.EMAIL_SENT_SUCCESSFUL'));
        }
      },
      onError: (error) => {
        const {
          response: { data },
        }: any = error ?? {};

        toast.error(data?.message);
      },
    }
  );

  return { mutate, isLoading };
}

export function useLogin() {
  const { t } = useTranslation('common');
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useUI();
  const { setToken, setAuthCredentials } = useToken();
  let [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(client.auth.login, {
    onSuccess: (data: any) => {
      if (!data.token) {
        setServerError(t('forms:error-credential-wrong'));
        return;
      }
      setToken(data.token);
      setAuthCredentials(data.token, data.permissions);
      setAuthorized(true);
      closeModal();
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { setToken, removeAuthCredentials } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const [_r, resetCheckout] = useAtom(clearCheckoutAtom);
  const { pathname, ...router } = useRouter();

  const { mutate: signOut, isLoading } = useMutation(client.auth.logout, {
    onSuccess: (data) => {
      if (data) {
        setToken('');
        removeAuthCredentials();
        setAuthorized(false);
        router.push("/");
        //@ts-ignore
        resetCheckout();
        queryClient.refetchQueries(API_ENDPOINTS.CUSTOMER);
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
  function handleLogout() {
    signOut();
  }
  return {
    mutate: handleLogout,
    isLoading,
  };
}

export function useOtpLogin() {
  const [otpState, setOtpState] = useAtom(optAtom);
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useUI();
  const { setToken } = useToken();
  const queryClient = useQueryClient();
  let [serverError, setServerError] = useState<string | null>(null);
  const { mutate: otpLogin, isLoading } = useMutation(client.auth.otpLogin, {
    onSuccess: (data: any) => {
      if (!data.token) {
        setServerError('text-otp-verify-failed');
        return;
      }
      setToken(data.token!);
      setAuthorized(true);
      setOtpState({
        ...initialOtpState,
      });
      closeModal();
    },
    onError: (error: Error) => {
      // console.log(error.message);
      setServerError(error?.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });

  return { mutate: otpLogin, isLoading, serverError, setServerError };
}

export function useRegister() {
  const { t } = useTranslation('common');
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const { closeModal } = useUI();
  let [formError, setFormError] = useState<Partial<RegisterUserInputType> | null>(
    null
  );

  const { mutate, isLoading } = useMutation(client.auth.register, {
    onSuccess: (data: any) => {
      if (data?.token && data?.permissions?.length) {
        setToken(data?.token);
        setAuthorized(true);
        closeModal();
        return;
      }
      if (!data.token) {
        toast.error(t("forms:error-credential-wrong"));
      }
    },
  });

  return { mutate, isLoading, formError, setFormError };
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const { closeModal } = useUI();

  return useMutation(client.auth.resetPassword, {
    onSuccess: (data: any) => {
      if (data?.success) {
        toast.success('Successfully Reset Password!');
        closeModal();
        return;
      }
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}


// export const useSendOtpCodeMutation = () => {
//   return useMutation((input: SendOtpCodeInputType) =>
//     client.auth.sendOtpCode(input)
//   );
// };

export function useSendOtpCode({
  verifyOnly,
}: Partial<{ verifyOnly: boolean }> = {}) {
  let [serverError, setServerError] = useState<string | null>(null);
  const [otpState, setOtpState] = useAtom(optAtom);

  const { mutate, isLoading } = useMutation(client.auth.sendOtpCode, {
    onSuccess: (data: any) => {
      if (!data.success) {
        setServerError(data.message!);
        return;
      }
      setOtpState({
        ...otpState,
        otpId: data?.id!,
        isContactExist: data?.is_contact_exist!,
        phoneNumber: data?.phone_number!,
        step: data?.is_contact_exist! ? 'OtpForm' : 'RegisterForm',
        ...(verifyOnly && { step: 'OtpForm' }),
      });
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

export function useVerifyOtpCode({
  onVerify,
}: {
  onVerify: Function;
}) {
  const [otpState, setOtpState] = useAtom(optAtom);
  let [serverError, setServerError] = useState<string | null>(null);
  const { mutate, isLoading } = useMutation(client.auth.verifyOtpCode, {
    onSuccess: (data: any) => {
      if (!data.success) {
        setServerError(data?.message!);
        return;
      }
      if (onVerify) {
        onVerify(otpState?.phoneNumber);
      }
      setOtpState({
        ...initialOtpState,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { mutate, isLoading, serverError, setServerError };
}

// export const useSocialLoginMutation = (
//   options: UseMutationOptions<any, unknown, SocialLoginInputType, unknown>
// ) => {
//   return useMutation(
//     (input: SocialLoginInputType) => client.auth.socialLogin(input),
//     {
//       onError: (error: any) => {
//         console.log(error.message);
//       },
//       ...options,
//     }
//   );
// };

export function useSocialLogin() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);

  return useMutation(client.auth.socialLogin, {
    onSuccess: (data: any) => {
      if (data?.token && data?.permissions?.length) {
        setToken(data?.token);
        setAuthorized(true);
        return;
      }
      if (!data.token) {
        toast.error(`${t('error-credential-wrong')}`);
      }
    },
    onError: (error: Error) => {
      console.log(error.message);
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useVerifyForgotPasswordToken() {
  const queryClient = useQueryClient();
  let [formError, setFormError] = useState<any>(null);

  const { mutate, isLoading } = useMutation(
    client.auth.verifyForgetPassword,
    {
      onSuccess: (data: any) => {
        if (!data.success) {
          setFormError({
            token: data?.message ?? '',
          });
          return;
        }
      },
      onSettled: () => {
        queryClient.clear();
      },
    }
  );

  return { mutate, isLoading, formError, setFormError };
}

export const useUser = () => {
  const [isAuthorized] = useAtom(authorizationAtom);
  const { setEmailVerified, getEmailVerified } = useToken();
  const { emailVerified } = getEmailVerified();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const router = useRouter();
  const { removeToken } = useToken();
  const { data, isLoading, error } = useQuery<User, Error>(
    [API_ENDPOINTS.CUSTOMER],
    client.user.me,
    {
      enabled: isAuthorized,
      retry: false,
      onSuccess: (data) => {
        setEmailVerified(true);
        setAuthorized(true);
      },
      onError: (err) => {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 409) {
            setEmailVerified(false);
            if (router.pathname !== ROUTES.verifyEmail) {
              router.push(ROUTES.verifyEmail);
            }
            return;
          }
        }
        removeToken();
        setAuthorized(false);
        Router.reload();
      },
    }
  );
  return {
    me: data,
    loading: isLoading,
    error,
    isAuthorized
  };
};

export function useSubscribe() {
  const queryClient = useQueryClient();
  let [formError, setFormError] = useState<any>(null);

  const { mutate, isLoading } = useMutation(
    client.auth.subscribe,
    {
      onSuccess: (data: any) => {
        if (!data.success) {
          setFormError({
            token: data?.message ?? '',
          });
          return;
        }
      },
      onSettled: () => {
        queryClient.clear();
      },
    }
  );

  return { mutate, isLoading, formError, setFormError };
}

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation(client.user.updateEmail, {
    onSuccess: (data) => {
      if (data) {
        toast.success(t('successfully-email-updated'));
      }
    },
    onError: (error) => {
      const {
        response: { data },
      }: any = error ?? {};

      toast.error(data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMER);
    },
  });
};

export const useUpdateUser = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { closeModal } = useUI();
  return useMutation(client.user.update, {
    onSuccess: (data) => {
      if (data?.id) {
        toast.success(`${t('profile-update-successful')}`);
        closeModal();
      }
    },
    onError: (error) => {
      toast.error(`${t('error-something-wrong')}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMER);
    },
  });
};