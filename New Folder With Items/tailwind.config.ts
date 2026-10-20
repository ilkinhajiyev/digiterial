import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sayt — qara fon + neon yaşıl
        bg: '#050506',            // səhifə fonu
        surface: '#0E0F12',       // kartlar
        'surface-2': '#15161B',   // daha yüksək səth / tünd panellər
        fg: '#F3F4F2',            // əsas mətn
        muted: '#9C9EA6',         // ikinci dərəcəli mətn (AA kontrast)
        brand: '#3DFFA8',         // neon yaşıl
        'brand-dark': '#1FE58E',
        'brand-soft': 'rgba(61,255,168,.12)',
        onbrand: '#02140B',       // yaşıl üzərində mətn
        // Admin panel üçün saxlanılan tokenlər
        ink: '#0A0A0D',
        paper: '#F3F4F2',
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
