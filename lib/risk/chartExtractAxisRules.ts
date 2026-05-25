/** TradingView-style right-axis and trade-zone rules for chart extraction prompts. */
export const CHART_EXTRACT_AXIS_RULES = `RIGHT PRICE AXIS (critical on busy charts):
- TradingView highlights prices in colored boxes on the RIGHT edge, aligned with horizontal lines.
- A complex chart may show 6–12+ highlighted prices. NEVER take the first three numbers top-to-bottom.
- First pass: list EVERY highlighted price on the right axis (top to bottom). For each record:
  - exact numeric price as printed
  - box color (green, red, blue, black, grey, purple, etc.)
  - any text label beside it on the chart (e.g. "Breaker [1D]", "partials + be")
- Second pass: decide which prices belong to the ACTIVE trade setup only.

IGNORE for entry / SL / TP (unless they are the only trade markers):
- Live/current price (often light blue with a countdown timer on the axis)
- Structural / session labels: Breaker, Mitigation, Asia, CBDR, Asian Range, W.O., 00:00, +bb
- Partial / breakeven lines: "partials", "be", "breakeven"
- Duplicate prices stacked within ~0.0001 (pick one)
- Axis highlights that only mark structure lines with no trade-zone shading

ACTIVE TRADE SETUP (use these visuals first):
1. TradingView Long/Short position tool — read the RECTANGLE EDGES, not green/red axis color alone:
   SHORT tool (gray/risk box on TOP, green/profit box on BOTTOM):
   - entry = the horizontal line BETWEEN the gray and green rectangles (often a gray axis label, e.g. 1.34292)
   - takeProfit = BOTTOM edge of the green profit rectangle (lowest price in the setup; green axis label on that line, e.g. 1.33021)
   - stopLoss = either (a) TOP edge of the gray risk rectangle (above entry), OR (b) an interior horizontal line inside the green box (e.g. "W.O." near 1.33100) when that line is clearly part of the position tool
   - CRITICAL: When two prices are both below entry inside the green zone, the price CLOSER to entry (higher) is stopLoss and the price FARTHER from entry (lower) is takeProfit. Example: SL 1.33100, TP 1.33021 — do NOT swap them because both have green-ish axis boxes.
   LONG tool (green profit on TOP, red/gray risk on BOTTOM): mirror the above.
2. Manual shaded trade zones: tall green/grey vertical blocks — entry at the split, TP at profit-side extreme, SL at risk-side extreme.
3. Three clearly drawn horizontal lines explicitly meant as entry, SL, and TP (labels or position panel)

AXIS BOX COLORS (hints only — rectangle edges and tool lines beat box color):
- A green axis label on the bottom edge of the profit rectangle is almost always takeProfit, NOT stopLoss
- Do not assign stopLoss to the lowest green label when a higher sub-entry line (W.O., dotted line) exists in the same green box
- Blue/black labels for Breaker, Mitigation, partials, current price are NOT entry/SL/TP unless they align with the position tool edges

DIRECTION:
- Classic long: SL below entry, TP above entry
- Classic short: SL above entry, TP below entry
- Short tool with SL drawn inside the green box below entry: still direction "short"; SL is nearer to entry than TP among the below-entry pair
- Infer from position tool layout first, then price order

CONFIDENCE:
- high: clear position tool OR one obvious shaded zone with 3 consistent prices
- medium: many axis labels but trade zone is identifiable
- low: multiple setups, unclear zone, or prices violate long/short ordering — explain in notes`;
