import './globals.css';
import '@/lib/fonts';

export default function GlobalNotFound() {
  return (
    <html lang="az">
      <body className="grid min-h-screen place-items-center bg-paper p-6 text-ink">
        <div className="text-center">
          <p className="font-mono text-sm text-mut">404</p>
          <h1 className="t-h2 mt-3">Səhifə tapılmadı.</h1>
          <a href="/" className="btn-primary mt-8">Ana səhifə</a>
        </div>
      </body>
    </html>
  );
}
