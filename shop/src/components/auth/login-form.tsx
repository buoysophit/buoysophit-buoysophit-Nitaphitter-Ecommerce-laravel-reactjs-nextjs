import { useForm } from 'react-hook-form';
// @ts-ignore
// import { ImGoogle2 } from "react-icons/im";
import { ImFacebook2 } from 'react-icons/im';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import Input from '@components/ui/input';
import PasswordInput from '@components/ui/password-input';
import Button from '@components/ui/button';
import { useLogin } from '@framework/auth';
import { useUI } from '@contexts/ui.context';
import Logo from '@components/ui/logo';
import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@components/ui/alert';
import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ROUTES } from '@lib/routes';
import { MobileIcon } from '@components/icons/mobile-icon';
import { useSettings } from '@framework/settings';
import { AnonymousIcon } from '@components/icons/anonymous-icon';

interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('forms:email-error')
    .required('forms:email-required'),
  password: yup.string().required('forms:password-required'),
});

const defaultValues = {
  email: '',
  password: '',
};

type Props = {
  layout?: 'modal' | 'page';
};

const LoginForm: React.FC<Props> = ({ layout = 'modal' }) => {
  const router = useRouter();
  const { setModalView, openModal, closeModal } = useUI();
  const { data, isLoading: isSettingLoading } = useSettings();
  const isCheckout = router.pathname.includes('checkout');
  const { t } = useTranslation();
  const { mutate: login, isLoading: loading, serverError } = useLogin();

  const guestCheckout = data?.options?.guestCheckout!;

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<LoginInputType>({
    resolver: yupResolver(loginFormSchema),
    defaultValues,
  });

  function onSubmit({ email, password }: LoginInputType) {
    login(
      {
        email,
        password,
      },
      {
        onSuccess: (data: any) => {
          if (data?.token && data?.permissions?.length) {
            if (layout === 'page') {
              // Redirect to the my-account page
              return router.push(ROUTES.ACCOUNT);
            } else {
              closeModal();
              return;
            }
          }
        },
        onError: (error: any) => {
          console.log(error.message);
        },
      }
    );
  }

  function handleSignUp() {
    if (layout === 'modal') {
      setModalView('SIGN_UP_VIEW');
      return openModal();
    } else {
      router.push(`${ROUTES.SIGN_UP}`);
    }
  }

  function handleForgetPassword() {
    if (layout === 'modal') {
      setModalView('FORGET_PASSWORD');
      return openModal();
    } else {
      router.push(`${ROUTES.FORGET_PASSWORD}`);
    }
  }

  function handleOtpLogin() {
    if (layout === 'modal') {
      setModalView('OTP_LOGIN_VIEW');
      return openModal();
    } else {
      router.push(`${ROUTES.OTP_LOGIN}`);
    }
  }

  return (
    <div className="w-full px-5 py-5 mx-auto overflow-hidden bg-white border border-gray-300 rounded-lg sm:w-96 md:w-450px sm:px-8">
      <div className="text-center mb-6 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="mt-2 mb-8 text-sm md:text-base text-body sm:mb-10">
          {t('common:login-helper')}
        </p>
      </div>

      {serverError && (
        <Alert message={serverError} variant={'error'} className="my-3" />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center"
        noValidate
      >
        <div className="flex flex-col space-y-3.5">
          <Input
            labelKey="forms:label-email-star"
            type="email"
            variant="solid"
            {...register('email')}
            errorKey={errors.email?.message}
          />
          <PasswordInput
            labelKey="forms:label-password-star"
            errorKey={errors.password?.message}
            {...register('password')}
          />
          <div className="flex items-center justify-center">
            <div className="flex items-center flex-shrink-0">
              <label className="relative inline-block w-10 cursor-pointer switch">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-0 h-0 opacity-0"
                  {...register('remember_me')}
                />
                <span className="absolute inset-0 transition-all duration-300 ease-in bg-gray-500 slider round" />
              </label>
              <label
                htmlFor="remember"
                className="flex-shrink-0 text-sm cursor-pointer text-heading ltr:pl-3 rtl:pr-3"
              >
                {t('forms:label-remember-me')}
              </label>
            </div>
            <div className="flex ltr:ml-auto rtl:mr-auto">
              <button
                type="button"
                onClick={handleForgetPassword}
                className="text-sm underline ltr:text-right rtl:text-left text-heading ltr:pl-3 rtl:pr-3 hover:no-underline focus:no-underline focus:outline-none"
              >
                {t('common:text-forgot-password')}
              </button>
            </div>
          </div>
          <div className="relative">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="h-11 md:h-12 w-full mt-1.5"
            >
              {t('common:text-login')}
            </Button>
          </div>
        </div>
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-6 mb-3.5">
        <hr className="w-full border-gray-300" />
        <span className="absolute -top-2.5 px-2 bg-white">
          {t('common:text-or')}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-2">
        <Button
          disabled={loading}
          className="h-11 md:h-12 w-full mt-2.5 bg-google hover:bg-googleHover"
          onClick={() => signIn('facebook')}
        >
          <ImFacebook2 className="text-sm sm:text-base ltr:mr-1.5 rtl:ml-1.5" />
          {t('common:text-login-with-facebook')}
        </Button>

        <Button
          className="h-11 md:h-12 w-full mt-1.5"
          disabled={loading}
          onClick={handleOtpLogin}
        >
          <MobileIcon className="h-5 ltr:mr-2 rtl:ml-2 text-light" />
          {t('text-login-mobile')}
        </Button>
        {isCheckout && guestCheckout && (
          <Button
            className="h-11 w-full !bg-pink-700 !text-light hover:!bg-pink-800 sm:h-12"
            disabled={loading}
            onClick={() => router.push(ROUTES.checkoutGuest)}
          >
            <AnonymousIcon className="h-5 ltr:mr-2 rtl:ml-2 text-light" />
            {t('text-guest-checkout')}
          </Button>
        )}
      </div>

      <div className="mt-5 mb-1 text-sm text-center sm:text-base text-body">
        {t('common:text-no-account')}{' '}
        <button
          type="button"
          className="text-sm font-bold underline sm:text-base text-heading hover:no-underline focus:no-underline focus:outline-none"
          onClick={handleSignUp}
        >
          {t('common:text-register')}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
