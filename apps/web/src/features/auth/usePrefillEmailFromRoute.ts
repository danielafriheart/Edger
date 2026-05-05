import { useRouterState } from "@tanstack/react-router";
import { parsePrefillEmailFromLocationSearch } from "../../lib/urlEmailPrefill";

/** Recomputes when the router location changes so `?email=` survives `/login` ↔ `/signup` links. */
export function usePrefillEmailFromRoute(): string | undefined {
  return useRouterState({
    select: (s) => parsePrefillEmailFromLocationSearch(s.location.search),
  });
}
