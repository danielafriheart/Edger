import { LoginEmailOtpFlow } from "./auth/LoginEmailOtpFlow";
import { usePrefillEmailFromRoute } from "./auth/usePrefillEmailFromRoute";

/** Email OTP → `/app`. Auth guard handled by `RedirectIfSignedIn` in the route. */
export default function Login() {
  const prefilledEmail = usePrefillEmailFromRoute();

  return <LoginEmailOtpFlow prefilledEmail={prefilledEmail} />;
}
