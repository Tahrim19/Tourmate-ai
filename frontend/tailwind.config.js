/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-card': '#1a1a1a',
        'bg-card-hover': '#252525',
        'accent-teal': '#0B5345',
        'accent-teal-light': '#117A65',
        'accent-gold': '#F4D03F',
        'text-primary': '#f5f5f5',
        'text-secondary': '#a3a3a3',
        'user-bubble': '#1a73e8',
        'ai-bubble': '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
