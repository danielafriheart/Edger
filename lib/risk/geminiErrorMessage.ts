/** Turn Gemini SDK / API errors into a short user-facing message. */
export function geminiErrorToUserMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null;

  const status =
    'status' in err && typeof (err as { status: unknown }).status === 'number'
      ? (err as { status: number }).status
      : null;

  const message =
    'message' in err && typeof (err as { message: unknown }).message === 'string'
      ? (err as { message: string }).message
      : '';

  if (status === 429 || message.includes('429') || message.includes('quota')) {
    const retryMatch = message.match(/retry in (\d+)/i);
    const waitHint = retryMatch ? ` Try again in about ${retryMatch[1]} seconds.` : ' Wait a minute and try again.';
    return `Gemini rate limit reached (free tier quota).${waitHint} Check usage at ai.google.dev or switch GEMINI_MODEL in .env.local.`;
  }

  if (status === 403 || message.includes('API key')) {
    return 'Gemini API key is invalid or missing permission.';
  }

  return null;
}
