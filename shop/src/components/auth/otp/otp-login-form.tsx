import {
  useOtpLogin,
  useSendOtpCode,
} from "@framework/auth";
// import { useTranslation } from "next-i18next";
import "react-phone-input-2/lib/bootstrap.css";
import { useAtom } from "jotai";
import { optAtom } from "./atom";
import PhoneNumberForm from "./phone-number-form";
import OtpCodeForm from "./otp-verify-form";
// import Alert from "@components/ui/alert";
import OtpRegisterForm from "./otp-register-form";

export const OTPLoginForm = () => {
  // const { t } = useTranslation("common");
  const [otpState] = useAtom(optAtom);
  const {
    mutate: sendOtpCode,
    isLoading: loading,
    serverError,
    setServerError,
  } = useSendOtpCode();

  const {
    mutate: otpLogin,
    isLoading: otpLoginLoading,
  } = useOtpLogin();

  function onSendCodeSubmission({ phone_number }: { phone_number: string }) {
    sendOtpCode({
      phone_number: `+${phone_number}`,
    });
  }

  function onOtpLoginSubmission(values: any) {
    otpLogin({
      ...values,
      phone_number: otpState?.phoneNumber,
      otp_id: otpState?.otpId!,
    });
  }
  return (
    <div className="mt-4">
      {otpState.step === 'PhoneNumber' && (
        <>
          {
          /* FIXME - this is not working */
          /* <Alert
            variant="error"
            message={serverError && t(serverError)}
            className="mb-4"
            closeable={true}
            onClose={() => setServerError(null)}
          /> */}
          <div className="flex items-center">
            <PhoneNumberForm
              onSubmit={onSendCodeSubmission}
              isLoading={loading}
              view="login"
            />
          </div>
        </>
      )}
      {otpState.step === 'OtpForm' && (
        <OtpCodeForm
          isLoading={otpLoginLoading}
          onSubmit={onOtpLoginSubmission}
        />
      )}
      {otpState.step === 'RegisterForm' && (
        <OtpRegisterForm
          loading={otpLoginLoading}
          onSubmit={onOtpLoginSubmission}
        />
      )}
    </div>
  );
};
