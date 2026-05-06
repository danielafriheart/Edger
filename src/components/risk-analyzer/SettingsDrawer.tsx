import { CloseIcon } from '../ui/Icons';

export function SettingsDrawer({
  apiKeyDraft,
  setApiKeyDraft,
  onSave,
  onClose,
}: {
  apiKeyDraft: string;
  setApiKeyDraft: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] bg-white border-l border-zinc-200 flex flex-col animate-[drawer-in_0.2s_ease-out]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <span className="text-sm font-semibold text-zinc-900 tracking-tight">Settings</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-2">
              Anthropic API Key
            </div>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-3 text-sm font-mono text-zinc-900 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors"
            />
            <p className="text-xs text-zinc-500 leading-relaxed mt-3">
              Required for AI auto-fill. Stored locally in your browser only. Get a key at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-800 underline hover:text-zinc-900"
              >
                console.anthropic.com
              </a>
              .
            </p>
            <p className="text-xs text-rose-700 leading-relaxed mt-3 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              ⚠ Dev mode: key sent directly from the browser. For production, route through your own backend.
            </p>
          </div>

          <button
            onClick={onSave}
            className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Save
          </button>
        </div>
      </aside>
    </>
  );
}
