// =============================================================================
// Edger — Claude Vision Integration
// -----------------------------------------------------------------------------
// Sends a chart screenshot to Anthropic's API and asks Claude to extract:
//   - direction: long | short
//   - entry price
//   - stopLoss price
//   - takeProfit price
//   - detectedSymbol (best guess from chart label, optional)
//
// SECURITY NOTE
// -------------
// This calls the Anthropic API directly from the browser using a key the user
// pastes into the settings drawer. That key is stored in localStorage. This is
// a *dev-only* convenience — for production, route this call through your own
// backend (e.g. a /api/analyze endpoint) so the key never ships to the browser.
// =============================================================================

export interface VisionResult {
  direction: "long" | "short" | null;
  entry: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  detectedSymbol: string | null;
  rationale: string;
}

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const STORAGE_KEY = "edger.anthropic_key";

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function setStoredApiKey(key: string): void {
  if (typeof window === "undefined") return;
  if (key) window.localStorage.setItem(STORAGE_KEY, key);
  else window.localStorage.removeItem(STORAGE_KEY);
}

const SYSTEM_PROMPT = `You are a trading-chart vision assistant. The user uploads a screenshot of a price chart that has the platform's "long position" or "short position" tool drawn on it. That tool typically renders three horizontal price levels with two colored zones — a green/teal zone for the profit target side and a red/pink zone for the stop loss side, with a thin line in the middle for the entry.

Your job: extract these four values:
  - direction:    "long" if the green zone is ABOVE the entry, "short" if the green zone is BELOW the entry.
  - entry:        the middle horizontal line price (where the user enters the trade).
  - stopLoss:     the price level on the red/pink (loss) side.
  - takeProfit:   the price level on the green/teal (profit) side.
  - detectedSymbol: the chart's instrument label as visible (e.g. "EURUSD", "BTCUSD", "NAS100"). null if not visible.

Read the prices from the right-hand price axis. Be precise to the same number of decimals the chart shows.

Respond with ONLY a single JSON object, no prose, no code fences. Schema:
{
  "direction": "long" | "short" | null,
  "entry": number | null,
  "stopLoss": number | null,
  "takeProfit": number | null,
  "detectedSymbol": string | null,
  "rationale": "one short sentence explaining how you read it"
}

If you cannot confidently identify the long/short tool or its three levels, return all four numeric fields as null and explain in rationale.`;

/**
 * Strips the "data:image/png;base64," prefix from a data URL and returns
 * { mediaType, base64 } for the Anthropic API.
 */
function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data URL.");
  return { mediaType: match[1], base64: match[2] };
}

export async function analyzeChart(imageDataUrl: string, apiKey: string): Promise<VisionResult> {
  if (!apiKey) throw new Error("Anthropic API key is required.");
  const { mediaType, base64 } = parseDataUrl(imageDataUrl);

  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: "Extract the trade levels from this chart and respond with the JSON object only.",
          },
        ],
      },
    ],
  };

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Anthropic API error ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text =
    data?.content?.find?.((b: { type: string }) => b.type === "text")?.text ??
    data?.content?.[0]?.text ??
    "";

  // Extract first {...} block in case the model wrapped it.
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Couldn't parse JSON from model response.");

  let parsed: VisionResult;
  try {
    parsed = JSON.parse(jsonMatch[0]) as VisionResult;
  } catch {
    throw new Error("Model returned malformed JSON.");
  }

  return {
    direction: parsed.direction ?? null,
    entry: typeof parsed.entry === "number" ? parsed.entry : null,
    stopLoss: typeof parsed.stopLoss === "number" ? parsed.stopLoss : null,
    takeProfit: typeof parsed.takeProfit === "number" ? parsed.takeProfit : null,
    detectedSymbol: parsed.detectedSymbol ?? null,
    rationale: parsed.rationale ?? "",
  };
}
