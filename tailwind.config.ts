import type { Config } from 'tailwindcss';

// Admin panel (Agency OS) üçün dizayn tokenləri — ictimai saytın palitrası ilə eyni
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08080A',
        panel: '#111113',
        panel2: '#18181B',
        panel3: '#202024',
        line: 'rgba(255,255,255,0.07)',
        paper: '#F6F4EF',
        brand: '#FF5A1F',
        mint: '#FF8A2B',
        mut: '#8B919C',
        'mut-d': '#A4AAB4',
        danger: '#FF6B6B',
        info: '#7CB8FF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'Menlo', 'monospace'],
      },
      boxShadow: {
        pop: '0 24px 60px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06)',
      },
      keyframes: {
        'slide-in': { from: { transform: 'translateX(24px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
        'fade-up': { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
      },
      animation: {
        'slide-in': 'slide-in .28s cubic-bezier(.2,.8,.2,1)',
        'fade-up': 'fade-up .35s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};
export default config;
