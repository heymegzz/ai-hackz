/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'vigil-black': '#0a0a0a',
        'vigil-dark': '#111111',
        'vigil-border': '#1a1a1a',
        'vigil-text': '#f0f0f0',
        'vigil-muted': '#6b6b6b',
        'vigil-blue': '#4fc3f7',
        'vigil-amber': '#fbbf24',
      },
      keyframes: {
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-value': {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
        'pulse-amber': {
          '0%, 100%': { borderColor: '#1a1a1a' },
          '50%': { borderColor: '#fbbf24' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0.8' },
        },
        'flash-white': {
          '0%': { color: '#f0f0f0' },
          '30%': { color: '#ffffff' },
          '100%': { color: '#f0f0f0' },
        },
        'flash-amber-number': {
          '0%': { color: '#4fc3f7' },
          '30%': { color: '#fbbf24' },
          '100%': { color: '#fbbf24' },
        },
        'status-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'dot-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.4)' },
        },
        'border-flash-amber': {
          '0%': { boxShadow: '0 0 0 0 rgba(251,191,36,0)' },
          '40%': { boxShadow: '0 0 0 4px rgba(251,191,36,0.4)' },
          '100%': { boxShadow: '0 0 0 0 rgba(251,191,36,0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.4s ease both',
        'fade-value': 'fade-value 0.3s ease both',
        'pulse-amber': 'pulse-amber 0.8s ease',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
        'flash-white': 'flash-white 0.6s ease',
        'flash-amber-number': 'flash-amber-number 0.6s ease forwards',
        'status-pulse': 'status-pulse 2s ease-in-out infinite',
        'dot-pulse': 'dot-pulse 1.4s ease-in-out infinite',
        'border-flash-amber': 'border-flash-amber 0.8s ease',
      },
    },
  },
  plugins: [],
}
