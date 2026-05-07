import { SectionTitle } from './SectionTitle';

export function PrivacyContent() {
  return (
    <div className="prose-edger">
      <SectionTitle>Privacy at a glance</SectionTitle>
      <p>
        Edger is currently in early access. This page summarizes what happens
        when you use the app and supporting services like sign-in and the
        waitlist.
      </p>

      <SectionTitle>What we collect</SectionTitle>

      <h3>When you use the analyzer</h3>
      <p>
        The lot-size calculator runs entirely in your browser. Nothing about
        the trades you size is sent to Edger&apos;s servers — we don&apos;t
        operate servers that receive that data.
      </p>
      <ul>
        <li>
          Any Anthropic API key you provide is stored only in your browser&apos;s{' '}
          <code>localStorage</code>. It never leaves your device, except to
          authenticate calls you make to Anthropic.
        </li>
        <li>
          Chart screenshots you upload are sent directly from your browser to
          Anthropic&apos;s API for level extraction. Edger does not see, store,
          or intercept these images.
        </li>
        <li>
          App preferences (selected category, recent risk amount) are stored
          locally only.
        </li>
      </ul>

      <h3>When you join the waitlist</h3>
      <p>
        If you submit your email at <code>/waitlist</code>, we store it in our
        database (hosted with Supabase) so we can notify you when sign-ups
        open. Your browser may also remember that you joined so we can show a
        confirmation. We don&apos;t sell your email address.
      </p>

      <h3>When you sign in</h3>
      <p>
        Sign-in runs through Clerk. Clerk processes your email verification
        and session; see their privacy policy for how they handle that data.
        Supabase may receive your signed-in session token only for requests the
        app makes on your behalf (for example syncing data you&apos;ve
        authorized).
      </p>

      <SectionTitle>Cookies and tracking</SectionTitle>
      <p>
        Edger does not use tracking cookies or third-party analytics beyond what
        authentication providers set for sessions. Local browser storage is
        still used for app preferences and your optional analyzer API key.
      </p>

      <SectionTitle>Third parties</SectionTitle>
      <ul>
        <li>
          <strong>Anthropic</strong> — when you use AI chart extraction, your
          screenshot is sent to{' '}
          <a href="https://www.anthropic.com" target="_blank" rel="noreferrer">
            Anthropic
          </a>
          &apos;s API. Their privacy practices apply to that transmission.
        </li>
        <li>
          <strong>Clerk</strong> — manages sign-in sessions and verification.
        </li>
        <li>
          <strong>Supabase</strong> — hosts the database used for waitlist
          signup and optional app data gated by authentication.
        </li>
      </ul>

      <SectionTitle>Data deletion</SectionTitle>
      <p>
        Clearing your browser&apos;s site data for Edger removes locally stored
        analyzer settings and keys. Signing out clears your Clerk session here.
        To remove waitlist submissions from our database once we offer that,
        contact us.
      </p>

      <SectionTitle>Contact</SectionTitle>
      <p>
        Questions about privacy:{' '}
        <a href="mailto:hello@edger.app">hello@edger.app</a>.
      </p>
    </div>
  );
}
