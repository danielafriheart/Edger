import { SectionTitle } from './SectionTitle';

export function DisclaimerContent() {
  return (
    <div className="prose-edger">
      <SectionTitle>Edger is not financial advice</SectionTitle>
      <p>
        Edger is an analytical tool. It performs arithmetic on inputs you
        provide. It does not advise, recommend, or evaluate any trade,
        strategy, instrument, or broker. Anything you do with the output is your
        own decision.
      </p>

      <SectionTitle>Trading involves risk</SectionTitle>
      <ul>
        <li>
          Trading currencies, indices, metals, and crypto involves substantial
          risk of loss.
        </li>
        <li>
          On leveraged products, you may lose more than your initial deposit.
        </li>
        <li>Past performance is not indicative of future results.</li>
        <li>You should only trade with capital you can afford to lose entirely.</li>
      </ul>

      <SectionTitle>Verify before placing trades</SectionTitle>
      <ul>
        <li>
          Pip values for non-USD-quoted pairs depend on live FX rates that
          Edger does not fetch. Edger uses approximations that are typically
          within ~2% of accurate.
        </li>
        <li>
          Contract sizes vary by broker, especially for indices, metals, and
          crypto. Check your broker&apos;s specifications and confirm Edger&apos;s
          assumptions match.
        </li>
        <li>
          You are responsible for the entry, stop-loss, and take-profit prices
          you enter. Confirm them against your chart and broker before placing a
          trade.
        </li>
      </ul>

      <SectionTitle>Edger is not a broker</SectionTitle>
      <p>
        Edger does not execute trades, hold funds, or maintain any relationship
        with brokers. Edger is not affiliated with any broker whose instruments
        are listed in the app.
      </p>

      <SectionTitle>Consult a professional</SectionTitle>
      <p>
        Consult a licensed financial advisor before making investment decisions.
        The choice of position size, instrument, or strategy depends on your
        individual risk tolerance, financial goals, and circumstances — none of
        which Edger evaluates.
      </p>
    </div>
  );
}
