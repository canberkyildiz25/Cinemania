import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserStore } from '../../stores/userStore'

const NAV_ITEMS = [
  { label: 'Keşfet', path: '/' },
  { label: 'Ara', path: '/search' },
  { label: 'Listem', path: '/library' },
]

export function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { watchlist } = useUserStore()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // sayfa kaydıkça header yoğunlaşsın
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // alan açılınca imleç içine gitsin
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setSearchOpen(true)
      inputRef.current?.focus()
      return
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-brand-gold/20 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.9)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <button onClick={() => navigate('/')} className="group shrink-0">
            <span className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-gradient-gold">
              FILMHUB
            </span>
          </button>

          <nav className="hidden md:flex gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                label={item.label}
                isActive={pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Arama — kapalıyken düğme, açıkken yazılabilir alan */}
          <form
            onSubmit={submitSearch}
            className={`hidden sm:flex items-center gap-2.5 py-2 rounded-full border transition-all duration-400 ${
              searchOpen
                ? 'pl-3.5 pr-2 border-brand-gold/70 bg-brand-gold/[0.08] shadow-[0_0_24px_-8px_rgba(212,175,55,0.45)]'
                : 'pl-3.5 pr-4 border-brand-gold/25 hover:border-brand-gold/70 hover:bg-brand-gold/[0.08]'
            }`}
          >
            <button
              type="submit"
              aria-label="Film ara"
              className="shrink-0 text-brand-cream/80 transition-colors hover:text-brand-gold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                if (query.trim() === '') setSearchOpen(false)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setQuery('')
                  setSearchOpen(false)
                  inputRef.current?.blur()
                }
              }}
              placeholder="Film ara…"
              aria-label="Film adı"
              className={`bg-transparent text-sm text-brand-cream placeholder-brand-cream/35 outline-none transition-all duration-400 ${
                searchOpen ? 'w-44 lg:w-56 opacity-100' : 'w-0 opacity-0'
              }`}
            />

            {!searchOpen && (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-xs font-mono tracking-wider text-brand-cream/80 transition-colors hover:text-brand-cream"
              >
                ARA
              </button>
            )}

            {searchOpen && query && (
              <button
                type="button"
                aria-label="Temizle"
                onClick={() => {
                  setQuery('')
                  inputRef.current?.focus()
                }}
                className="shrink-0 p-1 rounded-full text-brand-cream/50 transition-colors hover:text-brand-gold"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </form>

          {/* Mobilde sadece ikon — arama sayfasına götürür */}
          <button
            onClick={() => navigate('/search')}
            aria-label="Film ara"
            className="sm:hidden p-2 rounded-full border border-brand-gold/25 text-brand-cream/80 transition-colors hover:border-brand-gold/70"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Listedeki film sayısı — kitaplığa kısayol */}
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border border-brand-gold/25 text-brand-cream/80 transition-all duration-300 hover:border-brand-gold/70 hover:text-brand-cream hover:bg-brand-gold/[0.08]"
          >
            <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span className="text-xs font-mono tracking-wider">{watchlist.length}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

function NavLink({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative py-1 text-sm font-medium transition-colors duration-300 ${
        isActive ? 'text-brand-gold' : 'text-brand-cream/75 hover:text-brand-cream'
      }`}
    >
      {label}
      {/* hover'da soldan sağa açılan altın çizgi */}
      <span
        className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-brand-gold to-brand-gold/20 transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    </button>
  )
}
