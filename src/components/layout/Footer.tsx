const FOOTER_LINKS = [
  { heading: 'Company', items: ['About', 'Blog', 'Jobs'] },
  { heading: 'Support', items: ['Help Center', 'Contact', 'Status'] },
  { heading: 'Legal', items: ['Privacy', 'Terms', 'Cookies'] },
  { heading: 'Follow', items: ['Twitter', 'Instagram', 'Discord'] },
]

export function Footer() {
  return (
    <footer className="relative border-t border-brand-gold/25 mt-20 overflow-hidden">
      {/* üstten aşağı sızan altın ışık */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-gold/[0.06] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {FOOTER_LINKS.map((column) => (
            <div key={column.heading}>
              <h3 className="eyebrow mb-6">{column.heading}</h3>
              <ul className="space-y-3 text-brand-cream/65 text-sm">
                {column.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="inline-block transition-all duration-300 hover:text-brand-gold hover:translate-x-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-gold/15 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-display text-2xl font-bold text-gradient-gold mb-1">FILMHUB</p>
            <p className="text-brand-cream/45 text-xs font-mono tracking-wider">
              PREMIUM CINEMA DISCOVERY
            </p>
          </div>
          <p className="text-brand-cream/35 text-xs font-mono">
            © 2026 FILMHUB — Powered by TMDB
          </p>
        </div>
      </div>
    </footer>
  )
}
