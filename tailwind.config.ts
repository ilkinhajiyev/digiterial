import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F6F3',     // səhifə fonu
        white: '#FFFFFF',
        ink: '#0A0B0D',       // əsas mətn / tünd bölmələr
        graphite: '#555861',  // ikinci dərəcəli mətn
        brand: '#3341FF',     // kobalt
        'brand-dark': '#2330D6',
        'brand-soft': '#E9EBFF',
        mut: '#8A8D95',
        'mut-d': '#B0B3BA',
      },
      fontFamily: {
        display: ['"Inter Tight Variable"', '"Inter Tight"', 'system-ui', 'sans-serif'],
        body: ['"Inter Tight Variable"', '"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { site: '1400px' },
      transitionTimingFunction: { out: 'cubic-bezier(.2,.8,.2,1)' },
    },
  },
  plugins: [],
};
export default config;
