/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"

    ],
    theme: {
      extend: {
        colors: {
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            800: '#1F2937',
          },
          blue: {
            500: '#3B82F6',
            600: '#2563EB',
          }
        },
        fontFamily: {
          'sans': ['Inter', 'sans-serif'],
        },
        transitionDuration: {
          '300': '300ms',
        },
        borderRadius: {
          'lg': '0.5rem',
        }
      },
    },
    plugins: [],
  }