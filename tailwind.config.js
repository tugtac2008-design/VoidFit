/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#000000',
          50: '#080808',
          100: '#0d0d0d',
          200: '#111111',
          300: '#1a1a1a',
          400: '#252525',
          500: '#333333',
          600: '#444444',
        },
        'neon-cyan': '#ff9028',
        'neon-purple': '#a855f7',
        'neon-green': '#00ff87',
        'neon-orange': '#ff6b1a',
        'neon-red': '#ff3b5c',
        'neon-yellow': '#ffd700',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(255, 144, 40, 0.4), 0 0 40px rgba(255, 144, 40, 0.1)',
        'glow-cyan-sm': '0 0 8px rgba(255, 144, 40, 0.5)',
        'glow-purple': '0 0 15px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.1)',
        'glow-green': '0 0 15px rgba(0, 255, 135, 0.4), 0 0 40px rgba(0, 255, 135, 0.1)',
        'glow-red': '0 0 15px rgba(255, 59, 92, 0.4)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'radial-void': 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) both',
        'spin-slow': 'spin 8s linear infinite',
        'border-flow': 'borderFlow 4s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(255, 144, 40, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 144, 40, 0.7), 0 0 40px rgba(255, 144, 40, 0.3)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
