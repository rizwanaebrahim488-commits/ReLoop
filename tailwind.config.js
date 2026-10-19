/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede6',
          200: '#c5dcd0',
          300: '#9bc2b0',
          400: '#6ca28c',
          500: '#48846f',
          600: '#356958',
          700: '#2d5547',
          800: '#244439',
          900: '#1e382f',
          950: '#0e1f1a',
        },
        fresh: {
          50: '#effaf3',
          100: '#d9f3e4',
          200: '#b6e7cb',
          300: '#84d4ab',
          400: '#52b788',
          500: '#2ea16c',
          600: '#208155',
          700: '#1c6645',
          800: '#195138',
          900: '#164330',
        },
        charcoal: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#868e96',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#121416',
          950: '#0a0b0c',
        },
        offwhite: '#f9fafb',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
