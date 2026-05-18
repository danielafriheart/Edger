import { SectionTitle } from './SectionTitle';

export function TermsContent() {
  return (
    <div className="prose-edger">
      <SectionTitle>Acceptance</SectionTitle>
      <p>
        By using Edger, you agree to these Terms. If you don&apos;t agree, please
        don&apos;t use the service.
      </p>

      <SectionTitle>What Edger is</SectionTitle>
      <p>
        Edger is an analytical tool that calculates appropriate position sizes
        from inputs you provide — typically a chart screenshot and a dollar
        risk amount. <strong>It is not financial advice.</strong> Edger does not
        recommend trades, predict market movement, or evaluate strategies.
      </p>

      <SectionTitle>Acceptable use</SectionTitle>
      <ul>
        <li>Use Edger for lawful purposes only.</li>
        <li>
          Don&apos;t attempt to reverse-engineer, scrape, or disrupt the service.
        </li>
        <li>
          Don&apos;t upload content you don&apos;t have rights to (for example
          copyrighted chart images you don&apos;t have permission to process).
        </li>
      </ul>

      <SectionTitle>Your data</SectionTitle>
      <p>
        You retain all rights to the screenshots, prices, and other content you
        provide. As described in the Privacy section, Edger doesn&apos;t store
        chart content on its own servers; waitlist emails and authenticated app
        data may be hosted with providers under our policies above.
      </p>

      <SectionTitle>No warranties</SectionTitle>
      <p>
        Edger is provided &quot;as is&quot; and &quot;as available&quot; without
        warranties of any kind, express or implied. We don&apos;t guarantee
        uninterrupted operation, accuracy of calculations against your specific
        broker&apos;s contract sizes, or fitness for any particular trading
        approach.
      </p>

      <SectionTitle>Limitation of liability</SectionTitle>
      <p>
        To the fullest extent allowed by law, Edger and its operators are not
        liable for losses, damages, or claims — direct or indirect — arising
        from your use of the service. Trading involves risk; you accept that
        risk by participating.
      </p>

      <SectionTitle>Changes</SectionTitle>
      <p>
        We may update these Terms at any time during early access. Continued use
        of the service after changes implies acceptance.
      </p>

      <SectionTitle>Termination</SectionTitle>
      <p>
        We may suspend or terminate access to the service at any time, for any
        reason, particularly if these Terms are violated.
      </p>

      <SectionTitle>Contact</SectionTitle>
      <p>
        Questions about these Terms:{' '}
        <a href="mailto:hello@edger.app">hello@edger.app</a>.
      </p>
    </div>
  );
}
