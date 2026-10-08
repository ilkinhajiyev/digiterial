import './globals.css';
import '@/lib/fonts';

export default function GlobalNotFound() {
  return (
    <html lang="az">
      <body className="grid min-h-screen place-items-center bg-ink p-6 text-bone">
        <div className="text-center">
          <p className="font-display text-8xl italic text-brand">404</p>
          <h1 className="t-h2 mt-4">Səhifə tapılmadı.</h1>
          <a href="/" className="btn-gold mt-10">Ana səhifə</a>
        </div>
      </body>
    </html>
  );
}
