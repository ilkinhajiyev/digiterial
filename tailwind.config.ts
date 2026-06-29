import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0B',
        paper: '#F4F3EE',
        brand: '#F1E500',
        mut: '#8A8A85',
        'mut-d': '#9A9A93',
      },
      fontFamily: {
        display: ["'Space Grotesk'", 'sans-serif'],
        body:    ["'Inter'",         'sans-serif'],
        mono:    ["'JetBrains Mono'", 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
