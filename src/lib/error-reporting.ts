export type ClientErrorContext = Record<string, unknown>;

/** Dispatches a sanitized application error event for an optional host integration. */
export function reportClientError(error: unknown, context: ClientErrorContext = {}): void {
  if (typeof window === "undefined") return;

  const message = error instanceof Error ? error.message : String(error);
  window.dispatchEvent(
    new CustomEvent("zyqentra:error", {
      detail: {
        message,
        route: window.location.pathname,
        ...context,
      },
    }),
  );
}
