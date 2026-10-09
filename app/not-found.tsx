import './globals.css';
import '@/lib/fonts';

export default function GlobalNotFound() {
  return (
    <html lang="az">
      <body className="grid min-h-screen place-items-center bg-bg p-6 text-fg">
        <div className="text-center">
          <p className="text-8xl font-semibold tracking-[-.08em] text-brand">404</p>
          <h1 className="t-h2 mt-4">Səhifə tapılmadı.</h1>
          <a href="/" className="btn-accent mt-10">Ana səhifə</a>
        </div>
      </body>
    </html>
  );
}
