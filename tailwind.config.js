/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: '#EC268F',
        secondary: '#00AFEF',
        accent: '#FFF212',
        success: '#00A859',
        danger: '#ED2F59',
        dark: '#1A1A1A',
        gray: '#4B4B4B',
        light: '#F9F9F9',
        border: '#E2E2E2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}