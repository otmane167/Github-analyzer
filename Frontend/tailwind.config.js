/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surfaceRaised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        borderMuted: 'rgb(var(--color-border-muted) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        textFaint: 'rgb(var(--color-text-faint) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        accentDim: 'rgb(var(--color-accent-dim) / <alpha-value>)',
        link: 'rgb(var(--color-link) / <alpha-value>)',
        warn: 'rgb(var(--color-warn) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        sans: ['"Sora"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -6px rgb(var(--color-accent) / 0.5)',
        glowCyan: '0 0 20px -6px rgb(var(--color-link) / 0.5)',
        card: '0 1px 0 rgb(var(--color-text) / 0.04)',
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        rise: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        rise: 'rise 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
