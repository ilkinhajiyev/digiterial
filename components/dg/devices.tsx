// Real ekran görüntülərini göstərən cihaz maketləri (CSS ilə: noutbuk və telefon)
export function Laptop({ src, alt, scroll, priority }: { src: string; alt: string; scroll?: string; priority?: boolean }) {
  return (
    <figure className="dv-laptop">
      <div className="dv-lid">
        <span className="dv-cam" aria-hidden="true" />
        <div className={`dv-screen${scroll ? ' can-scroll' : ''}`}>
          <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" className="dv-shot" />
          {scroll && <img src={scroll} alt="" aria-hidden="true" loading="lazy" decoding="async" className="dv-full" />}
        </div>
      </div>
      <div className="dv-base" aria-hidden="true"><span /></div>
    </figure>
  );
}

export function Phone({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <figure className="dv-phone">
      <span className="dv-island" aria-hidden="true" />
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  );
}
