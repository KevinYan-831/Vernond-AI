/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'magic-charcoal': '#0a0a12',
        'magic-gold': '#D4AF37',
        'magic-crimson': '#8B0000',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-100% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
