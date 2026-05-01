export const loginInputClass =
  "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors disabled:opacity-60";

export type FieldBag = Partial<Record<string, { message?: string }>> | undefined;

export function clerkErrList(err: unknown): { code?: string; message?: string; longMessage?: string }[] {
  if (
    err
    && typeof err === "object"
    && "errors" in err
    && Array.isArray((err as { errors: unknown }).errors)
  ) {
    return (err as { errors: { code?: string; message?: string; longMessage?: string }[] }).errors;
  }
  return [];
}

export function clerkErrMsg(err: unknown): string | null {
  const list = clerkErrList(err);
  return list[0]?.longMessage ?? list[0]?.message ?? null;
}

/** Clerk `missing_fields` ids are snake_case; `signUp.update` expects camelCase keys. */
export function clerkMissingFieldToParamKey(field: string): string {
  const aliases: Record<string, string> = {
    legal_accepted: "legalAccepted",
    first_name: "firstName",
    last_name: "lastName",
    phone_number: "phoneNumber",
  };
  if (aliases[field]) return aliases[field];
  if (!field.includes("_")) return field;
  const [head, ...tail] = field.split("_");
  return head + tail.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

export function humanizeMissingField(field: string): string {
  return field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const HANDLED_MISSING_KEYS = new Set([
  "legal_accepted",
  "first_name",
  "last_name",
  "username",
  "phone_number",
]);
