/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0d12',
        surface: '#11161d',
        surfaceRaised: '#161c25',
        border: '#232b36',
        borderMuted: '#1b212a',
        text: '#e6edf3',
        textMuted: '#8892a0',
        textFaint: '#5b6472',
        accent: '#3fb950',
        accentDim: '#2ea043',
        link: '#58a6ff',
        warn: '#d29922',
        danger: '#f85149',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(63,185,80,0.25), 0 0 24px rgba(63,185,80,0.12)',
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        rise: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scanline: { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '0 40px' } },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        rise: 'rise 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
