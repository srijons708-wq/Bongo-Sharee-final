/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6F0',
        warmwhite: '#FFFDFC',
        burgundy: {
          DEFAULT: '#6E1F32',
          dark: '#4A1523',
        },
        gold: '#C58A45',
        ink: '#292326',
        muted: '#756C68',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        body: ['Inter', 'Manrope', 'sans-serif'],
      },
      maxWidth: {
        content: '1440px',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(41,35,38,0.12)',
        card: '0 2px 12px -4px rgba(41,35,38,0.08)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease-out both',
        fadeIn: 'fadeIn 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
