/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    fontFamily: {
      roboto:
        'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'
    },
    extend: {
      colors: {
        'paimon-blue': {
          primary: 'var(--paimon-blue-8)',
          hover: 'var(--paimon-blue-9)',
          active: 'var(--paimon-blue-10)',
          1: 'var(--paimon-blue-1)',
          2: 'var(--paimon-blue-2)',
          3: 'var(--paimon-blue-3)',
          4: 'var(--paimon-blue-4)',
          5: 'var(--paimon-blue-5)',
          6: 'var(--paimon-blue-6)',
          7: 'var(--paimon-blue-7)',
          11: 'var(--paimon-blue-11)',
          12: 'var(--paimon-blue-12)',
          13: 'var(--paimon-blue-13)',
          14: 'var(--paimon-blue-14)',
          15: 'var(--paimon-blue-15)'
        },
        'paimon-gray': {
          1: 'var(--paimon-gray-1)',
          2: 'var(--paimon-gray-2)',
          3: 'var(--paimon-gray-3)',
          4: 'var(--paimon-gray-4)',
          5: 'var(--paimon-gray-5)',
          6: 'var(--paimon-gray-6)',
          7: 'var(--paimon-gray-7)',
          8: 'var(--paimon-gray-8)',
          9: 'var(--paimon-gray-9)',
          10: 'var(--paimon-gray-10)',
          11: 'var(--paimon-gray-11)',
          12: 'var(--paimon-gray-12)',
          13: 'var(--paimon-gray-13)',
          14: 'var(--paimon-gray-14)',
          15: 'var(--paimon-gray-15)'
        },
        'paimon-text': {
          base: 'var(--paimon-gray-1)',
          hover: 'var(--paimon-gray-4)'
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slide: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'paimon-loading': 'fade-in 0.5s infinite alternate',
        'paimon-slide': 'slide 60s linear infinite'
      }
    }
  },
  plugins: [
    require('tailwindcss-animation-delay'),
    {
      tailwindcss: {},
      autoprefixer: {}
    }
  ]
};
