import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUserStore } from '../stores/userStore'
import { useUIStore } from '../stores/uiStore'

export function Profile() {
  const { currentUser, preferences, isAuthenticated, setTheme, logout } = useUserStore()
  const { theme, setTheme: setUITheme } = useUIStore()
  const [isEditing, setIsEditing] = useState(false)

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setUITheme(newTheme)
    setTheme(newTheme)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-brand-cream mb-4">
            Sign in to your account
          </h1>
          <button className="btn-primary">Sign In</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-primary pt-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-cream mb-2">
            Account Settings
          </h1>
          <p className="text-brand-cream/60">Manage your profile and preferences</p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-brand-cream mb-6">
            Profile
          </h2>

          <div className="flex items-center gap-6 mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand-burgundy to-brand-gold flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {currentUser?.username?.[0]?.toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-brand-cream mb-1">
                {currentUser?.username}
              </h3>
              <p className="text-brand-cream/60">{currentUser?.email}</p>
              {currentUser?.createdAt && (
                <p className="text-sm text-brand-cream/40 mt-2">
                  Member since{' '}
                  {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>

            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="btn-primary"
              >
                Done Editing
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-brand-cream mb-6">
            Preferences
          </h2>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-4 bg-surface-primary/50 rounded">
              <div>
                <h3 className="text-lg font-semibold text-brand-cream">Dark Mode</h3>
                <p className="text-sm text-brand-cream/60">Use dark theme throughout the app</p>
              </div>
              <button
                onClick={handleThemeToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-brand-gold' : 'bg-brand-cream/30'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-surface-primary/50 rounded">
              <div>
                <h3 className="text-lg font-semibold text-brand-cream">Notifications</h3>
                <p className="text-sm text-brand-cream/60">Receive updates about new releases</p>
              </div>
              <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-brand-gold transition-colors">
                <span className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform translate-x-7" />
              </button>
            </div>

            {/* Language */}
            <div className="p-4 bg-surface-primary/50 rounded">
              <label className="block text-lg font-semibold text-brand-cream mb-2">
                Language
              </label>
              <select className="w-full px-4 py-2 bg-surface-secondary border-2 border-brand-gold/30 rounded text-brand-cream focus:border-brand-gold focus:outline-none">
                <option>English</option>
                <option>Turkish</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Favorite Genres */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-brand-cream mb-6">
            Favorite Genres
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 28, name: 'Action' },
              { id: 18, name: 'Drama' },
              { id: 35, name: 'Comedy' },
              { id: 53, name: 'Thriller' },
              { id: 878, name: 'Sci-Fi' },
              { id: 27, name: 'Horror' },
              { id: 10749, name: 'Romance' },
              { id: 16, name: 'Animation' },
              { id: 99, name: 'Documentary' },
            ].map((genre) => (
              <button
                key={genre.id}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  preferences.favoriteGenres?.includes(genre.id)
                    ? 'bg-brand-gold text-surface-primary'
                    : 'bg-surface-primary border-2 border-brand-gold/30 text-brand-cream hover:border-brand-gold'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-brand-cream mb-6">
            Account Actions
          </h2>

          <div className="space-y-3">
            <button className="w-full px-6 py-3 border-2 border-brand-gold/30 text-brand-cream rounded font-semibold hover:border-brand-gold transition-colors">
              Change Password
            </button>
            <button className="w-full px-6 py-3 border-2 border-brand-gold/30 text-brand-cream rounded font-semibold hover:border-brand-gold transition-colors">
              Download My Data
            </button>
            <button
              onClick={() => {
                logout()
                // Navigate to home
              }}
              className="w-full px-6 py-3 bg-red-600/20 border-2 border-red-600/50 text-red-400 rounded font-semibold hover:border-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Privacy & Legal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-brand-cream/40 space-y-2"
        >
          <div>
            <a href="#" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </a>
            {' • '}
            <a href="#" className="hover:text-brand-gold transition-colors">
              Terms of Service
            </a>
            {' • '}
            <a href="#" className="hover:text-brand-gold transition-colors">
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
