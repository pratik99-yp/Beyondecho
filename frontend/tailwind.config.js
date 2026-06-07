/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Cascadia Code', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: {
          base:     '#0f1011',
          surface:  '#161718',
          elevated: '#1e1f21',
          hover:    '#252628',
          active:   '#2d2e31',
        },
        border: {
          DEFAULT: '#2a2b2e',
          subtle:  '#1f2022',
          strong:  '#3a3b3e',
        },
        text: {
          primary:   '#f0f0f0',
          secondary: '#9095a0',
          muted:     '#525560',
        },
        accent: {
          blue:   '#7c9ef8',
          purple: '#b87af8',
          green:  '#6fc77a',
          teal:   '#5bb8d4',
          red:    '#f28b82',
        },
      },
      keyframes: {
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'cursor-blink':  'blink 0.85s step-end infinite',
        'fade-in':       'fadeIn 0.25s ease-out',
        'slide-up':      'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.16,1,0.3,1)',
        'gradient':      'gradientShift 5s ease infinite',
      },
      boxShadow: {
        'glow-blue':   '0 0 20px rgba(124,158,248,0.15)',
        'glow-purple': '0 0 20px rgba(184,122,248,0.15)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'modal':       '0 8px 48px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
