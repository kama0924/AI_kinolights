/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kinobg: '#121212',
        kinocard: '#1e1e1e',
        kinopoint: '#ff5a36',
      },
      boxShadow: {
        card: '0 10px 24px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};
