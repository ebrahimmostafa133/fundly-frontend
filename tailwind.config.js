/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
        },
        success: {
          50:  'var(--color-success-50)',
          200: 'var(--color-success-200)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
        },
        error: {
          50:  'var(--color-error-50)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)',
          700: 'var(--color-error-700)',
        },
        warning: {
          50:  'var(--color-warning-50)',
          200: 'var(--color-warning-200)',
          500: 'var(--color-warning-500)',
        },
        info: {
          50:  'var(--color-info-50)',
          200: 'var(--color-info-200)',
          500: 'var(--color-info-500)',
        },
      },
    },
  },
  plugins: [],
}