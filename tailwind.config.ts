import type { Config } from 'tailwindcss';

// Admin panel (Agency OS) üçün dizayn tokenləri — ictimai saytın palitrası ilə eyni
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E0F12',
        panel: '#14161A',
        panel2: '#1A1D22',
        panel3: '#21252B',
        line: 'rgba(255,255,255,0.07)',
        paper: '#ECEEF1',
        brand: '#F1B43A',
        mint: '#A2FFCB',
        mut: '#8B919C',
        'mut-d': '#A4AAB4',
        danger: '#FF6B6B',
        info: '#7CB8FF',
      },
      fontFamily: {
        display: ['var(--font-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
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
