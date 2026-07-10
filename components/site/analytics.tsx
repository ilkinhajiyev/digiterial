import Script from 'next/script';
import type { SiteSettings } from '@/lib/data/settings';

// Bütün analitika / izləmə skriptlərini sayta əlavə edir.
// Yalnız dəyər daxil edilmiş kodlar yüklənir.
export default function Analytics({ a }: { a: SiteSettings['analytics'] }) {
  if (!a) return null;

  return (
    <>
      {/* Google Tag Manager */}
      {a.gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${a.gtm}');`}
        </Script>
      )}

      {/* Google Analytics 4 */}
      {a.ga4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${a.ga4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${a.ga4}');`}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel */}
      {a.metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${a.metaPixel}');fbq('track','PageView');`}
        </Script>
      )}

      {/* Yandex Metrica */}
      {a.yandexMetrica && (
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym('${a.yandexMetrica}','init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
        </Script>
      )}

      {/* TikTok Pixel */}
      {a.tiktokPixel && (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${a.tiktokPixel}');ttq.page();}(window,document,'ttq');`}
        </Script>
      )}
    </>
  );
}

// GTM noscript (body başında) — ayrıca export
export function GtmNoScript({ gtm }: { gtm?: string }) {
  if (!gtm) return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
        height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
    </noscript>
  );
}
