import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../stores/uiStore'
import { useUserStore } from '../../stores/userStore'

export function Header() {
  const navigate = useNavigate()
  const { openSearchModal } = useUIStore()
  const { isAuthenticated, currentUser } = useUserStore()

  return (
    <header className="sticky top-0 z-50 glass border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="text-3xl font-display font-bold text-gradient-gold">
              FILMHUB
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6">
            <NavLink label="Home" onClick={() => navigate('/')} />
            <NavLink label="Search" onClick={() => navigate('/search')} />
            <NavLink label="Library" onClick={() => navigate('/library')} />
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            onClick={() => openSearchModal()}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded border border-brand-gold/30 text-brand-cream hover:border-brand-gold transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:text-brand-gold transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-sm">Search</span>
          </button>

          {/* Profile */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 hover:border-brand-gold transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-brand-burgundy to-brand-gold flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {currentUser?.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm hidden sm:inline">{currentUser?.username}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary text-sm"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-brand-cream hover:text-brand-gold transition-colors font-body text-sm font-medium"
    >
      {label}
    </button>
  )
}
