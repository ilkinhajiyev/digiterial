import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#09090B',      // səhifə fonu
        coal: '#111114',     // qaldırılmış səth
        slate: '#1A1A1F',    // daha yüksək səth
        bone: '#ECE8E1',     // əsas mətn
        ash: '#8E8A84',      // ikinci dərəcəli mətn
        brand: '#E7B76A',    // şampan qızılı
        'brand-deep': '#C08A44',
        glow: '#9C8CFF',     // soyuq kənar işıq
        paper: '#ECE8E1',
        mut: '#8E8A84',
        'mut-d': '#B4AFA7',
      },
      fontFamily: {
        display: ['"Cormorant Garamond Variable"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Inter Tight Variable"', '"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { site: '1440px' },
      transitionTimingFunction: { out: 'cubic-bezier(.16,1,.3,1)' },
    },
  },
  plugins: [],
};
export default config;
