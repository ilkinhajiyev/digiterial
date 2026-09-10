# Digiterial — 3D dizayn yeniləməsi

Ana səhifəyə CSS 3D perspektivli brauzer maketi, metal effektli həndəsi obyekt, analitika və dizayn panelləri, kursorla hərəkət əlavə edilib. Qara–laym palitrası, xidmət səhifələri, dörd dil və mövcud admin/Supabase inteqrasiyası saxlanılıb. Xidmət siyahısının kontrastı, kart kölgələri, mobil menyunun əlçatanlığı və dil seçiminin TypeScript tipi düzəldilib.

3D hissə dekorativdir; paneldəki qrafik real analitika göstəricisi deyil. Əlavə 3D kitabxanası və ya xarici şəkil tələb etmir. Hərəkəti azaltma sistem seçiminə uyğunlaşır.

## Hostinger

Bu paket Next.js mənbə kodudur. Node.js tətbiqi olaraq yerləşdirin; sadə statik public_html yükləməsi kifayət etmir.

- Node.js 20 və ya daha yeni versiya.
- Quraşdırma: `npm ci`
- Build: `npm run build`
- Başlatma: `npm start`
- Mövcud mühit dəyişənlərini Hostinger-də saxlayın; nümunə `.env.example` faylındadır.
- Supabase və admin üçün mövcud verilənlər bazası konfiqurasiyası tələb olunur.
- Admin builder-də saxlanılmış xüsusi ana səhifə blokları varsa, 3D kompozisiya üçün hero blokunda `showAside: true` olmalıdır.

## Yoxlama

Production build və ayrıca `tsc --noEmit` yoxlaması keçirilib. Brauzer lokal ünvanı blokladığı üçün vizual brauzer yoxlaması tamamlanmayıb. Canlı Supabase, əlaqə forması və admin əməliyyatları real hesab məlumatları ilə yoxlanmayıb. Paket canlı serverə yerləşdirilməyib.
