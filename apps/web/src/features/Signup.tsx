import { AuthEmailOtpFlow } from "./auth/AuthEmailOtpFlow";
import { usePrefillEmailFromRoute } from "./auth/usePrefillEmailFromRoute";

/** First name, last name, email + OTP; writes Clerk-native name fields (`signUp.update`) as soon as the sign-up resumes. */
export default function Signup() {
  const prefilledEmail = usePrefillEmailFromRoute();

  return <AuthEmailOtpFlow chrome="signup" prefilledEmail={prefilledEmail} />;
}
