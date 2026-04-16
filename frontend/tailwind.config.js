/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter var', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b8fd',
          400: '#7a92fa',
          500: '#5468f5',
          600: '#3d46ea',
          700: '#3234d4',
          800: '#2b2bab',
          900: '#292a87',
          950: '#1a1a52',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8f9fc',
          100: '#f1f3f9',
          200: '#e4e8f2',
          300: '#cdd4e6',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 8px 24px -4px rgb(0 0 0 / 0.10), 0 2px 8px -2px rgb(0 0 0 / 0.06)',
        'modal': '0 24px 48px -12px rgb(0 0 0 / 0.18)',
        'dropdown': '0 8px 16px -4px rgb(0 0 0 / 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
