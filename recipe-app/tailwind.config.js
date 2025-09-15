/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f0f4f0',
          100: '#d9e2d9',
          200: '#b3c5b3',
          300: '#8da88d',
          400: '#678b67',
          500: '#416e41',
          600: '#345834',
          700: '#274227',
          800: '#1a2c1a',
          900: '#0d160d',
        },
        wood: {
          50: '#faf7f0',
          100: '#f4ede0',
          200: '#e8dac0',
          300: '#dcc7a0',
          400: '#d0b480',
          500: '#c4a160',
          600: '#9d814d',
          700: '#76613a',
          800: '#4f4126',
          900: '#282013',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfaf6',
          200: '#fbf5ed',
          300: '#f9f0e4',
          400: '#f7ebdb',
          500: '#f5e6d2',
          600: '#c4b8a8',
          700: '#938a7e',
          800: '#625c54',
          900: '#312e2a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Quicksand', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
