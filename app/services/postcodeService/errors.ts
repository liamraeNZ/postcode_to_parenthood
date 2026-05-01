export type PostcodeLookupErrorKind =
  | 'timeout'
  | 'network'
  | 'server'
  | 'bad_response'
  | 'misconfigured';

export class PostcodeLookupError extends Error {
  readonly kind: PostcodeLookupErrorKind;
  readonly status?: number;

  constructor(
    kind: PostcodeLookupErrorKind,
    message: string,
    options?: { status?: number; cause?: unknown }
  ) {
    super(message);
    this.name = 'PostcodeLookupError';
    this.kind = kind;
    this.status = options?.status;
    if (options?.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}

export function toPostcodeLookupError(
  err: unknown,
  messages: { timeout: string; network: string; unexpected: string }
): PostcodeLookupError {
  if (err instanceof DOMException && err.name === 'AbortError') {
    return new PostcodeLookupError('timeout', messages.timeout, { cause: err });
  }

  const message = err instanceof Error ? err.message : String(err);
  if (message.toLowerCase().includes('failed to fetch')) {
    return new PostcodeLookupError('network', messages.network, { cause: err });
  }

  if (err instanceof PostcodeLookupError) return err;
  return new PostcodeLookupError('bad_response', messages.unexpected, { cause: err });
}
