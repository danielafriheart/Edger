import { EdgerLogo } from '@/components/ui/Logo';

const PRODUCT_LINKS = [
  { label: 'How it works', href: '#how' },
  { label: 'Instruments', href: '#instruments' },
  { label: 'Journal', href: '/journal' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Try Edger', href: '/app' },
];

const RESOURCE_LINKS = [
  { label: 'FAQ', href: '#faq' },
  { label: 'Account', href: '/profile' },
  { label: 'Roadmap', href: '#' },
  { label: 'Changelog', href: '#' },
];

const LEGAL_LINKS = [
  { label: 'Privacy', href: '/legal#privacy' },
  { label: 'Terms', href: '/legal#terms' },
  { label: 'Disclaimer', href: '/legal#disclaimer' },
];

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-white text-sm font-semibold mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="hover:text-zinc-200 transition-colors">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="relative z-10 bg-zinc-950 text-zinc-400 border-t border-white/5 px-6 pt-20 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 text-white">
              <EdgerLogo size="md" variant="light" />
            </div>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-[16rem]">
              The lot-sizing tool for serious retail traders.
            </p>
          </div>

          <FooterCol title="Product" links={PRODUCT_LINKS} />
          <FooterCol title="Resources" links={RESOURCE_LINKS} />
          <FooterCol title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500 pt-8 border-t border-white/5">
          <div className="font-mono">
            © {new Date().getFullYear()} Edger · Analytical tool, not financial advice.
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 edger-dot-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
