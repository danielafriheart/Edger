import { clerkErrList } from "../../components/login/clerkFormHelpers";

export function clerkErrorMeansAlreadySignedIn(err: unknown): boolean {
  for (const e of clerkErrList(err)) {
    const hay = `${e.longMessage ?? ""} ${e.message ?? ""} ${e.code ?? ""}`.toLowerCase();
    if (hay.includes("already signed")) return true;
  }
  return false;
}
