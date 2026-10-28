/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: { 950: '#03060b', 900: '#070c15', 800: '#0d1522' },
        ember: { DEFAULT: '#e8702a', dark: '#d2611f' },
      },
    },
  },
  plugins: [],
};
