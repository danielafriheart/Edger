export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is Edger free?',
    a: "It's free during early access. A paid tier comes later for power features (faster AI, broker presets, history) — early access traders keep generous limits.",
  },
  {
    q: 'Do I need an account?',
    a: 'No. Open the app and use it. To enable AI chart reading, paste your own Anthropic API key into Settings — it stays in your browser, never on our servers.',
  },
  {
    q: 'How accurate is the AI chart reading?',
    a: 'Strong on clean screenshots from TradingView, MT4/5, and similar platforms. If a level looks off, every field is editable before you calculate — Edger never blocks you on AI accuracy.',
  },
  {
    q: 'What about non-USD account currencies?',
    a: 'v1 sizes everything in USD. If your account is in EUR or GBP, multiply the resulting lot size by the FX rate to your account currency. Native multi-currency support is on the roadmap.',
  },
  {
    q: 'Why does my broker show a different pip value?',
    a: 'Pip values for non-USD-quoted pairs depend on live FX rates. Edger uses sensible approximations — for exact match, your broker is the source of truth. Edger gets you within ~2% in seconds.',
  },
  {
    q: 'Where is my data stored?',
    a: "Nowhere we control. Screenshots go from your browser to Anthropic's API for analysis. Your API key sits in localStorage. Nothing is logged on Edger's side.",
  },
];

export const TICKER_ITEMS: { sym: string; pip: string }[] = [
  { sym: 'EUR/USD', pip: '$10.00' },
  { sym: 'GBP/USD', pip: '$10.00' },
  { sym: 'USD/JPY', pip: '$6.70' },
  { sym: 'XAU/USD', pip: '$1.00' },
  { sym: 'NAS100', pip: '$1.00' },
  { sym: 'US30', pip: '$1.00' },
  { sym: 'BTC/USD', pip: '$1.00' },
  { sym: 'ETH/USD', pip: '$0.10' },
  { sym: 'AUD/USD', pip: '$10.00' },
  { sym: 'EUR/GBP', pip: '$13.20' },
  { sym: 'SPX500', pip: '$1.00' },
  { sym: 'XAG/USD', pip: '$5.00' },
];

export const INSTRUMENT_ROWS: [string, string[]][] = [
  ['Standard FX', ['EUR/USD', 'GBP/USD', 'AUD/USD', 'NZD/USD', 'USD/CHF', 'USD/CAD']],
  ['JPY Pairs', ['USD/JPY', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CHF/JPY', 'CAD/JPY']],
  ['Cross', ['EUR/GBP', 'EUR/AUD', 'GBP/AUD', 'AUD/NZD', 'EUR/CAD', 'GBP/CAD']],
  ['Metals', ['XAU/USD', 'XAG/USD']],
  ['Indices', ['NAS100', 'US30', 'SPX500', 'GER40', 'UK100']],
  ['Crypto', ['BTC/USD', 'ETH/USD', 'SOL/USD']],
];
