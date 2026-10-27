'use client';
import { useEffect, useState } from 'react';
import { useT } from '@/lib/i18n/client';

// Qlobal zolaq: Bakı və əsas bazarların canlı saatı
const ZONES = [
  { city: 'Bakı', tz: 'Asia/Baku', home: true },
  { city: 'Dubay', tz: 'Asia/Dubai' },
  { city: 'İstanbul', tz: 'Europe/Istanbul' },
  { city: 'Berlin', tz: 'Europe/Berlin' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'Nyu-York', tz: 'America/New_York' },
];

export default function GlobalStrip() {
  const tr = useT();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const time = (tz: string) => (now ? new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(now) : '--:--');
  return (
    <section className="gstrip" aria-label={tr('Saat qurşaqları')}>
      <div className="wrap wide gstrip-in">
        <p><b>{tr('Bakıdan dünyaya.')}</b> {tr('Onlayn görüşləri saat qurşağınıza uyğun planlayırıq.')}</p>
        <ul>
          {ZONES.map((z) => (
            <li key={z.tz} className={z.home ? 'home' : undefined}>
              <span>{tr(z.city)}</span>
              <time suppressHydrationWarning>{time(z.tz)}</time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
