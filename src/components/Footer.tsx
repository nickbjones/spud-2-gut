const footerBlockStyles = 'grid grid-cols-2 gap-1 sm:gap-2 py-2 px-4 border-b border-slate-200';

const FooterLink = ({ href, label }: { href: string; label: string }) => (
  <a href={href} className="p-1 sm:p-2 text-sm text-gray-500">{label}</a>
);

const Footer = () => (
  <footer className="mt-12 py-2 border-y border-slate-200 bg-slate-100">
    <div className="max-w-5xl mx-auto p-4">
      <div className={footerBlockStyles}>
        <FooterLink href="/recipes" label="View all recipes" />
        <FooterLink href="/tags" label="View all tags" />
        <FooterLink href="/recipes/new" label="Create new recipe" />
        <FooterLink href="/tags/new" label="Create new tag" />
        <FooterLink href="/home" label="Top page" />
      </div>
      <div className={footerBlockStyles}>
        <FooterLink href="/settings" label="Settings" />
        <FooterLink href="/change-log" label="Change log" />
      </div>
      <p className="my-6 mx-5 text-xs text-gray-400">© {new Date().getFullYear()} Spud2Gut. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
