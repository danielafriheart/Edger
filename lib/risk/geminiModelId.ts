/** Default favors a model with active free-tier quota; override via GEMINI_MODEL. */
export function geminiModelId(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
}
