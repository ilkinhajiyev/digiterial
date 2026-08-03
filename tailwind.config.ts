import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080A09',
        paper: '#F1F2EA',
        brand: '#DDFB45',
        mut: '#747873',
        'mut-d': '#A2A7A1',
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
