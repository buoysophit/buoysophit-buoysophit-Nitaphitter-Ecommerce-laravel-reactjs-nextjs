import { useUser } from '@framework/auth';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { authorizationAtom } from '@store/authorization-atom';
import { BackArrowRound } from '@components/icons/back-arrow-round';
import LoginForm from '@components/auth/login-form';
import { useHasMounted } from './use-has-mounted';
import dynamic from 'next/dynamic';
import { useToken } from './use-token';
import VerifyEmail from 'src/pages/verify-email';
import axios from 'axios';
import NotFound from '@components/404/not-found';
import { useSettings } from '@framework/settings';
import { ROUTES } from '@lib/routes';
const Spinner = dynamic(
  () => import('@components/ui/loaders/spinner/spinner'),
  { ssr: false }
);

const PrivateRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isAuthorized] = useAtom(authorizationAtom);
  const hasMounted = useHasMounted();
  const { me, loading, error } = useUser();
  const { getEmailVerified } = useToken();
  const { emailVerified } = getEmailVerified();
  const { data } = useSettings();
  const isUser = !!me;

  if (axios.isAxiosError(error)) {
    if (error?.response?.status === 417) {
      return (
        <div className="py-10">
          <NotFound
            text={`${data?.options?.siteTitle} ${process.env.NEXT_PUBLIC_VERSION}`}
            subTitle={`This copy of ${data?.options?.siteTitle} is not genuine.`}
            linkTitle="Please contact with site admin."
            link={ROUTES.CONTACT}
          />
        </div>
      );
    }
  }

  if (!isUser && !isAuthorized && hasMounted) {
    return (
      <div className="relative flex justify-center w-full py-5 md:py-8">
        <button
          className="absolute flex items-center justify-center w-8 h-8 text-gray-200 transition-colors md:w-16 md:h-16 top-5 md:top-1/2 ltr:left-5 ltr:md:left-10 rtl:right-5 rtl:md:right-10 md:-mt-8 md:text-gray-300 hover:text-gray-400"
          onClick={router.back}
        >
          <BackArrowRound />
        </button>
        <div className="py-16 lg:py-24">
          <LoginForm />
        </div>
      </div>
    );
  }
  if (isAuthorized && emailVerified === false) {
    return <VerifyEmail />;
  }
  if (isUser && isAuthorized) {
    return <div>{children}</div>;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner showText={false} />
    </div>
  );
};

export default PrivateRoute;
