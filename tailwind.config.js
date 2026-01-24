/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.tsx',
    './resources/**/*.jsx',
    './resources/**/*.js',
  ],
  theme: {
    extend: {
      keyframes: {
        ripple: {
          '0%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '0.1', transform: 'scale(1.05)' },
          '100%': { opacity: '0', transform: 'scale(1)' },
        },
      },
      animation: {
        ripple: 'ripple 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
};
