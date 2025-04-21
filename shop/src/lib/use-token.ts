import Cookies from 'js-cookie';
import { AUTH_CRED, AUTH_TOKEN, EMAIL_VERIFIED } from '@lib/constants';
export function useToken() {
  return {
    setToken(token: string) {
      Cookies.set(AUTH_TOKEN, token, { expires: 1 });
    },
    getToken() {
      return Cookies.get(AUTH_TOKEN);
    },
    removeToken() {
      Cookies.remove(AUTH_TOKEN);
    },
    hasToken() {
      const token = Cookies.get(AUTH_TOKEN);
      if (!token) return false;
      return true;
    },
    setEmailVerified(emailVerified: boolean | null) {
      Cookies.set(EMAIL_VERIFIED, JSON.stringify({ emailVerified }));
    },
    getEmailVerified() {
      const emailVerified = Cookies.get(EMAIL_VERIFIED);
      return emailVerified ? JSON.parse(emailVerified) : true;
    },
    setAuthCredentials(token: string, permissions: any) {
      Cookies.set(AUTH_CRED, JSON.stringify({ token, permissions }));
    },
    removeAuthCredentials() {
      Cookies.remove(AUTH_CRED);
    },
    getAuthCredentials(): {
      token: string | null;
      permissions: string[] | null;
    } {
      let authCred = Cookies.get(AUTH_CRED);
      if (authCred) {
        return JSON.parse(authCred);
      }
      return { token: null, permissions: null };
    },
    hasAccess(
      _allowedRoles: string[],
      _userPermissions: string[] | undefined | null
    ) {
      if (_userPermissions) {
        return Boolean(
          _allowedRoles?.find((aRole) => _userPermissions.includes(aRole))
        );
      }
      return false;
    }
  };
}
