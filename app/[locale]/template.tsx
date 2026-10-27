'use client';
import { useEffect, useState } from 'react';

// Səhifə keçidi: ilk yükləmədə animasiya yoxdur (LCP-yə təsir etməsin), yalnız sayt daxili keçidlərdə.
// Bayraq yalnız brauzerdə saxlanılır — serverdə modul vəziyyəti sorğular arasında paylaşıldığı üçün istifadə olunmur.
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => typeof window !== 'undefined' && navigated);
  useEffect(() => { navigated = true; }, []);
  return (
    <div className={animate ? 'pt-in' : undefined}>
      {children}
      {animate && <span className="pt-curtain" aria-hidden="true"><b>digiterial<i>.</i></b></span>}
    </div>
  );
}
