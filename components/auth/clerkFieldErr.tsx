import type { ReactNode } from "react";
import type { FieldBag } from "./clerkFormHelpers";

export function ClerkFieldErr({
  fields,
  fieldKey,
}: {
  fields: FieldBag;
  fieldKey: string;
}): ReactNode {
  const m = fields?.[fieldKey]?.message;
  return m ? <p className="text-[13px] text-red-600 mt-1">{m}</p> : null;
}
