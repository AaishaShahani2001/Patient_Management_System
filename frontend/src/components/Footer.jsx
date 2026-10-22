// Site footer shown under every page.
const links = [
  { href: '#privacy', label: 'Privacy Policy' },
  { href: '#terms', label: 'Terms of Service' },
  { href: '#support', label: 'Support' },
]

export default function Footer() {
  // Copyright on the left, policy links on the right. They stack on a narrow screen.
  return (
    <footer className="flex shrink-0 flex-col gap-2 border-t border-slate-100 bg-white px-5 py-3.5 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-10">
      <p>© 2026 MediCare. All rights reserved.</p>
      <nav className="flex items-center gap-5">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="transition hover:text-slate-700">
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
