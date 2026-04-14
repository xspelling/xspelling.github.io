/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366f1', light: '#818cf8', dark: '#4f46e5' },
        secondary: { DEFAULT: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
        accent: { DEFAULT: '#f43f5e', light: '#fb7185', dark: '#e11d48' },
        neon: { blue: '#00d4ff', green: '#00ff88', pink: '#ff006e', yellow: '#ffd600', purple: '#b829ff' },
        dark: { DEFAULT: '#0a0a1a', 100: '#0f0f23', 200: '#141428', 300: '#1a1a2e', 400: '#252540' },
        surface: { DEFAULT: '#1a1a2e', light: '#252540', dark: '#0f0f23' },
        gold: '#fbbf24',
        silver: '#9ca3af',
        bronze: '#cd7f32',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'car-drive': 'car-drive 0.3s ease-out',
        'shake': 'shake 0.3s ease-in-out',
        'confetti': 'confetti 1s ease-out forwards',
        'progress-fill': 'progress-fill 0.5s ease-out',
        'typing-cursor': 'typing-cursor 1s step-end infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8), 0 0 80px rgba(99, 102, 241, 0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'car-drive': {
          from: { transform: 'translateX(-5px)' },
          to: { transform: 'translateX(0)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'typing-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)',
      },
    },
  },
  plugins: [],
}
