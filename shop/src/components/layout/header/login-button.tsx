import { useUI } from '@contexts/ui.context';
import { authorizationAtom } from '@store/authorization-atom';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const AuthorizedMenu = dynamic(
  () => import('@components/layout/header/authorized-menu'),
  {
    ssr: false,
  },
);

const LoginButton = () => {
  const { openModal, setModalView } = useUI();
  const { t } = useTranslation('common');
  const [isAuthorize] = useAtom(authorizationAtom);
  const handleLogin = () => {
    setModalView('LOGIN_VIEW');
    return openModal();
  };
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient ? (
        isAuthorize ? (
          <AuthorizedMenu />
        ) : (
          <button
            onClick={handleLogin}
            className="text-sm xl:text-base text-heading font-semibold focus:outline-none"
          >
            {t('text-sign-in')}
          </button>
        )
      ) : (
        ''
      )}
    </>
  );
};

export default LoginButton;
