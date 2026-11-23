/** Base error for every failure raised by the client. */
export class RealMailProError extends Error {
  readonly status: number | undefined;
  readonly code: string;

  constructor(message: string, options: { status?: number; code: string; cause?: unknown }) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = new.target.name;
    this.status = options.status;
    this.code = options.code;
  }
}

/** 401 unauthorized — missing, invalid or revoked key. */
export class AuthenticationError extends RealMailProError {}
/** 402 insufficient_credits — add funds. */
export class InsufficientCreditsError extends RealMailProError {}
/** 403 suspended — account under review. */
export class AccountSuspendedError extends RealMailProError {}
/** 404 not_found — inbox/message not yours, or unknown endpoint. */
export class NotFoundError extends RealMailProError {}
/** 429 rate_limited — too many requests per minute. */
export class RateLimitError extends RealMailProError {
  readonly retryAfterSeconds: number | undefined;
  constructor(message: string, options: { status?: number; code: string; retryAfterSeconds?: number }) {
    super(message, options);
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}
/** 502 upstream_error — mail service failed (not charged). */
export class UpstreamError extends RealMailProError {}
/** The request exceeded the configured timeout. */
export class TimeoutError extends RealMailProError {}
/** The request could not reach the API (DNS, TLS, connection reset). */
export class ConnectionError extends RealMailProError {}

const BY_STATUS: Record<number, typeof RealMailProError> = {
  401: AuthenticationError,
  402: InsufficientCreditsError,
  403: AccountSuspendedError,
  404: NotFoundError,
  502: UpstreamError,
};

export function errorFromResponse(
  status: number,
  body: unknown,
  retryAfterSeconds?: number,
): RealMailProError {
  const envelope =
    body && typeof body === "object" && "error" in body
      ? (body as { error?: { code?: unknown; message?: unknown } }).error
      : undefined;
  const code = typeof envelope?.code === "string" ? envelope.code : `http_${status}`;
  const message = typeof envelope?.message === "string" ? envelope.message : `Request failed with status ${status}`;
  if (status === 429) {
    return new RateLimitError(message, {
      status,
      code,
      ...(retryAfterSeconds === undefined ? {} : { retryAfterSeconds }),
    });
  }
  const Ctor = BY_STATUS[status] ?? RealMailProError;
  return new Ctor(message, { status, code });
}
