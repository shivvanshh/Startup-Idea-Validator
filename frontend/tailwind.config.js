/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        dark: {
          bg: '#000000',
          card: '#09090b',
          border: '#27272a',
          text: '#ffffff',
          textMuted: '#a1a1aa'
        }
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(142, 70%, 50%, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 80%, 40%, 0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 85%, 52%, 0.06) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(240, 70%, 52%, 0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22, 90%, 52%, 0.06) 0px, transparent 50%)',
        'radial-glow': 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.06), transparent 40%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(34, 197, 94, 0.15)',
        'glow-md': '0 0 30px rgba(34, 197, 94, 0.2)',
        'glow-lg': '0 0 60px rgba(34, 197, 94, 0.25)',
        'card': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        'float': '0 25px 50px -12px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'count-up': 'countUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
