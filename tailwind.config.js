/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#8B1538',
          gold: '#D4AF37',
          dark: '#0A0E27',
          cream: '#E8DCC8',
        },
        surface: {
          primary: '#0A0E27',
          secondary: '#12151C',
          tertiary: '#1A1F3A',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'reel-spin': 'reel-spin 2s linear infinite',
        'spotlight-pulse': 'spotlight-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'reel-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'spotlight-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(212, 175, 55, 0.4)' },
          '50%': { 'box-shadow': '0 0 40px rgba(212, 175, 55, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
