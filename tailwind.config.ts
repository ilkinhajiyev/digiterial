import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Əsas tokenlər (admin də istifadə edir)
        ink: '#111110',
        paper: '#F3F0E9',
        brand: '#FF5A2C',
        mut: '#6E6A62',
        'mut-d': '#A39E94',
        // Sayt tokenləri
        bone: '#FBFAF6',
        line: 'rgba(17,17,16,.12)',
        'brand-deep': '#C93A12',
        sage: '#D9E3D3',
        sky: '#D6E0F0',
      },
      fontFamily: {
        display: ['"Unbounded Variable"', 'Unbounded', 'system-ui', 'sans-serif'],
        body: ['"Onest Variable"', 'Onest', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { '4xl': '2rem' },
      transitionTimingFunction: { out: 'cubic-bezier(.2,.7,.2,1)' },
      maxWidth: { site: '1320px' },
    },
  },
  plugins: [],
};
export default config;
