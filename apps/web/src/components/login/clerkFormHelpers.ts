export const loginInputClass =
  "w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors disabled:opacity-60";

export type FieldBag = Partial<Record<string, { message?: string }>> | undefined;

export type ClerkErrItem = {
  code?: string;
  message?: string;
  longMessage?: string;
  meta?: { paramName?: string };
};

function normalizeClerkErrorEntry(raw: unknown): ClerkErrItem {
  if (!raw || typeof raw !== "object") return {};
  const e = raw as Record<string, unknown>;
  const long =
    typeof e.longMessage === "string"
      ? e.longMessage
      : typeof e.long_message === "string"
        ? e.long_message
        : undefined;
  const msg = typeof e.message === "string" ? e.message : undefined;
  const code = typeof e.code === "string" ? e.code : undefined;
  let meta: ClerkErrItem["meta"];
  if (typeof e.meta === "object" && e.meta !== null) {
    const m = e.meta as Record<string, unknown>;
    const pn =
      typeof m.paramName === "string"
        ? m.paramName
        : typeof m.param_name === "string"
          ? m.param_name
          : undefined;
    meta = pn ? { paramName: pn } : undefined;
  }
  return { code, message: msg, longMessage: long, meta };
}

/** Handles Clerk Frontend API payloads and variants where `errors` is nested under `data`. */
export function clerkErrList(err: unknown): ClerkErrItem[] {
  if (!err || typeof err !== "object") return [];
  const o = err as Record<string, unknown>;
  let rawList: unknown[] | undefined;

  if (Array.isArray(o.errors)) rawList = o.errors as unknown[];
  else if (
    typeof o.data === "object"
    && o.data !== null
    && Array.isArray((o.data as { errors?: unknown }).errors)
  ) {
    rawList = ((o.data as { errors: unknown[] }).errors);
  }

  return rawList ? rawList.map(normalizeClerkErrorEntry) : [];
}

export function clerkErrMsg(err: unknown): string | null {
  if (typeof err === "object" && err !== null) {
    const o = err as Record<string, unknown>;
    const topLong = typeof o.longMessage === "string" ? o.longMessage : undefined;
    if (topLong) return topLong;
  }
  const list = clerkErrList(err);
  for (const item of list) {
    const s = item.longMessage ?? item.message;
    if (s) return s;
  }
  if (err instanceof Error && err.message.trim()) return err.message.trim();
  return null;
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

/** Clerk Dashboard / SDK may use snake_case or camelCase in `missingFields`. Normalize for UI + submit logic. */
export function normalizeClerkMissingFieldIds(raw: string[] | undefined): string[] {
  if (!raw?.length) return [];

  const mapId = (id: string): string => {
    switch (id) {
      case "firstName":
        return "first_name";
      case "lastName":
        return "last_name";
      case "phoneNumber":
        return "phone_number";
      case "legalAccepted":
        return "legal_accepted";
      default:
        return id;
    }
  };

  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of raw) {
    const snake = mapId(id);
    if (!seen.has(snake)) {
      seen.add(snake);
      out.push(snake);
    }
  }
  return out;
}
