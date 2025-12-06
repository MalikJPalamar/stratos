/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brilliant-blue': '#0066FF',
        'brilliant-dark': '#0A0E27',
      },
    },
  },
  plugins: [],
}
