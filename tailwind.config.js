/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Blue-purple-gray: deep indigo slate with a periwinkle accent.
        night: { 950: '#090b14', 900: '#0e1120', 800: '#151a2e', 700: '#1e2440' },
        accent: { DEFAULT: '#aab3ff', strong: '#7f89f4' },
      },
    },
  },
  plugins: [],
};
