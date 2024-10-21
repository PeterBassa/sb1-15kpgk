/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        normal: 300,
        medium: 400,
        bold: 500,
      },
    },
  },
  plugins: [],
};