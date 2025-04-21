import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSocialLogin } from '@framework/auth';

const SocialLoginProvider = () => {
  const { data: session, status } = useSession();
  // const loading = status === 'loading';
  const { mutate: socialLogin, error } = useSocialLogin();
  useEffect(() => {
    // is true when valid social login access token and provider is available in the session
    // but not authorize/logged in
    //@ts-ignore
    if (session?.access_token && session?.provider) {
      socialLogin({
        //@ts-ignore
        provider: session.provider as string,
        //@ts-ignore
        access_token: session.access_token as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // When rendering client side don't display anything until loading is complete
  // if (typeof window !== 'undefined' && loading) return null;
  if (error) {
    return <div>{`${error}`}</div>;
  }
  return null;
};

export default SocialLoginProvider;
