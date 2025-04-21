import {
  useSendOtpCode,
  useVerifyOtpCode,
} from "@framework/auth";
import Alert from "@components/ui/alert";
import { useTranslation } from "next-i18next";
import "react-phone-input-2/lib/bootstrap.css";
import { useAtom } from "jotai";
import { optAtom } from "@components/auth/otp/atom";
import PhoneNumberForm from "@components/auth/otp/phone-number-form";
import OtpCodeForm from "@components/auth/otp/otp-verify-form";
import { PhoneNumberStatus } from "@type/index";
interface OTPProps {
  phoneNumber: string | undefined;
  onVerify: (values: { phone_number: string }) => void;
  variant?: 'inline' | 'default';
}
export const OTP: React.FC<OTPProps> = ({
  phoneNumber,
  onVerify,
  variant = 'default',
}) => {
  const { t } = useTranslation('common');
  const [otpState] = useAtom(optAtom);

  const { mutate: verifyOtpCode, isLoading: otpVerifyLoading } =
    useVerifyOtpCode({ onVerify });
  const {
    mutate: sendOtpCode,
    isLoading,
    serverError,
    setServerError,
  } = useSendOtpCode({
    verifyOnly: true,
  });

  function onSendCodeSubmission({ phone_number }: { phone_number: string }) {
    sendOtpCode({
      phone_number: `+${phone_number}`,
    });
  }

  function onVerifyCodeSubmission({ code }: { code: string }) {
    verifyOtpCode({
      code,
      phone_number: otpState?.phoneNumber,
      otp_id: otpState?.otpId!,
    });
  }

  return (
    <>
      {otpState?.step === PhoneNumberStatus.NUMBER && (
        <>
          {serverError && (
            <Alert
              variant="error"
              message={serverError && t(serverError)}
              className="mb-4"
              closeable={true}
              onClose={() => setServerError(null)}
            />
          )}
          <PhoneNumberForm
            onSubmit={onSendCodeSubmission}
            isLoading={isLoading}
            phoneNumber={phoneNumber}
            variant={variant}
          />
        </>
      )}

      {otpState.step === 'OtpForm' && (
        <OtpCodeForm
          onSubmit={onVerifyCodeSubmission}
          isLoading={otpVerifyLoading}
        />
      )}
    </>
  );
};
