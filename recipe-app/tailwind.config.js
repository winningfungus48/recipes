/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kitchen: {
          paper: '#FAF8F5',
          cream: '#F0EBE3',
          sage: '#7C9A6E',
          wood: '#8B6F47',
          amber: '#D47C2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
