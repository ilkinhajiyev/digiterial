// Sahələr: "restoran üçün sayt", "e-ticarət reklamı" kimi axtarışlar üçün SEO səhifələri.
// Mətnlər ümumi yanaşmanı təsvir edir; uydurma statistika və ya müştəri adı yazmayın.
import type { IconName } from '@/components/dg/icons';

export type Industry = {
  slug: string; icon: IconName; title: string; short: string;
  metaTitle: string; metaDesc: string;
  h1: [string, string, string]; lead: string;
  challenges: { h: string; p: string }[];
  solutions: { service: string; h: string; p: string }[];
  checklist: string[];
  faq: { q: string; a: string }[];
};

export const industries: Industry[] = [
  {
    slug: 'restoran-ve-kafe', icon: 'home', title: 'Restoran və kafelər', short: 'Rezervasiya, menyu və yerli axtarış',
    metaTitle: 'Restoran və kafelər üçün sayt, SMM və reklam — Bakı',
    metaDesc: 'Restoran və kafelər üçün rəqəmsal marketinq: onlayn menyu və rezervasiya, Google Xəritədə görünmə, Instagram və hədəfli reklam.',
    h1: ['Restoran və kafelər üçün ', 'rəqəmsal', ' marketinq.'],
    lead: 'Müştəri restoranı əvvəl Google Xəritədə və Instagram-da seçir, sonra gəlir. Sizi tapılan, iştah açan və rezervasiyası asan edən rəqəmsal sistem qururuq.',
    challenges: [
      { h: 'Xəritədə görünmürsünüz', p: '"Yaxınlıqda restoran" axtarışında rəqiblər öndədir, profil natamamdır və rəylər cavabsız qalır.' },
      { h: 'Menyu və qiymətlər köhnədir', p: 'PDF menyu telefonda açılmır, qiymətlər dəyişib, müştəri zəng edib soruşmalı olur.' },
      { h: 'Instagram sifarişə çevrilmir', p: 'Postlar bəyənilir, amma rezervasiya və çatdırılma sifarişi üçün aydın yol yoxdur.' },
    ],
    solutions: [
      { service: 'seo', h: 'Lokal SEO', p: 'Google Business Profile, kateqoriyalar, şəkillər və rəylərin idarə olunması.' },
      { service: 'veb-saytlar', h: 'Mobil menyu və rezervasiya', p: 'Telefonda sürətli açılan menyu, onlayn rezervasiya və WhatsApp düyməsi.' },
      { service: 'smm', h: 'Kontent və Reels', p: 'Yeməyin hazırlanması, komanda və atmosferi göstərən qısa videolar.' },
      { service: 'reklam', h: 'Yerli reklam', p: 'Restoranın ətrafındakı insanlara Instagram və Google-da hədəfli reklam.' },
    ],
    checklist: ['Google Business Profile tam doldurulub', 'Menyu HTML səhifədədir, PDF deyil', 'Rezervasiya 2 kliklə mümkündür', 'Rəylərə 48 saat ərzində cavab verilir', 'Instagram bio-da rezervasiya linki var'],
    faq: [
      { q: 'Restoran üçün ayrıca sayt lazımdır, Instagram kifayət deyil?', a: 'Instagram vacibdir, amma Google axtarışında və xəritədə görünmək, menyunu və rezervasiyanı rahat göstərmək üçün sürətli sayt daha təsirlidir. İkisi birlikdə ən yaxşı nəticə verir.' },
      { q: 'Google Xəritədə necə yuxarı çıxmaq olar?', a: 'Profilin tam doldurulması, düzgün kateqoriya, real şəkillər, müntəzəm yeniləmələr və rəylər əsas amillərdir. Lokal SEO xidmətimiz bunları əhatə edir.' },
    ],
  },
  {
    slug: 'e-ticaret', icon: 'cart', title: 'E-ticarət', short: 'Onlayn mağaza, katalog reklamı, email',
    metaTitle: 'E-ticarət üçün onlayn mağaza, reklam və email marketinq',
    metaDesc: 'Onlayn mağazalar üçün sürətli sayt, Google Shopping və Meta katalog reklamı, tərk edilmiş səbət məktubları və konversiya optimizasiyası.',
    h1: ['Onlayn mağazalar üçün ', 'satış', ' sistemi.'],
    lead: 'Trafik almaq yarı işdir. Ziyarətçinin səbətə, səbətin sifarişə, birdəfəlik alıcının daimi müştəriyə çevrilməsi üçün sayt, reklam və email-i bir sistem kimi qururuq.',
    challenges: [
      { h: 'Səbət tərk edilir', p: 'Ziyarətçilər məhsulu səbətə qoyur, amma ödəniş mərhələsində çıxır.' },
      { h: 'Reklam xərci gəlirdən çoxdur', p: 'Kampaniyalar klik gətirir, amma hansı reklamın satış gətirdiyi ölçülmür.' },
      { h: 'Müştəri bir dəfə alır', p: 'Təkrar alış üçün nə məktub, nə də sadiqlik mexanizmi var.' },
    ],
    solutions: [
      { service: 'veb-saytlar', h: 'Sürətli mağaza', p: 'Mobil-əvvəl dizayn, sadə ödəniş axını və onlayn ödəniş inteqrasiyası.' },
      { service: 'reklam', h: 'Katalog reklamı', p: 'Google Shopping, Performance Max və Meta dinamik məhsul reklamları.' },
      { service: 'email-marketinq', h: 'Avtomatik məktublar', p: 'Tərk edilmiş səbət, xoş gəldin və təkrar alış zəncirləri.' },
      { service: 'seo', h: 'Kateqoriya SEO-su', p: 'Kateqoriya və məhsul səhifələrinin axtarış niyyətinə görə optimallaşdırılması.' },
    ],
    checklist: ['Ödəniş 3 addımdan çox deyil', 'GA4-də alış hadisəsi izlənir', 'Pixel və Conversions API qurulub', 'Tərk edilmiş səbət məktubu aktivdir', 'Məhsul şəkilləri sıxılıb (WebP/AVIF)'],
    faq: [
      { q: 'Hansı platformada mağaza qurursunuz?', a: 'Layihənin həcminə görə WooCommerce və ya xüsusi Next.js həlli seçirik. Məqsəd sürət, rahat idarəetmə və onlayn ödəniş inteqrasiyasıdır.' },
      { q: 'Reklamın satışa təsirini necə ölçürsünüz?', a: 'GA4, Meta Pixel və Conversions API ilə alış hadisəsini izləyir, ROAS və bir sifarişin xərcini (CPA) hesabatda göstəririk.' },
    ],
  },
  {
    slug: 'tibb-ve-klinika', icon: 'shield', title: 'Tibb və klinikalar', short: 'Etibar, onlayn qəbul, lokal SEO',
    metaTitle: 'Klinika və həkimlər üçün sayt və rəqəmsal marketinq',
    metaDesc: 'Klinikalar üçün etibar yaradan sayt, onlayn qəbula yazılma, xidmət səhifələrinin SEO-su və lokal axtarışda görünmə.',
    h1: ['Klinikalar üçün ', 'etibar', ' yaradan rəqəmsal təcrübə.'],
    lead: 'Pasiyent klinikanı seçməzdən əvvəl həkimləri, xidmətləri və rəyləri araşdırır. Aydın məlumat, rahat qəbul və axtarışda görünmə ilə bu seçimi asanlaşdırırıq.',
    challenges: [
      { h: 'Xidmət səhifələri yoxdur', p: 'Hər müalicə üçün ayrıca, izahlı səhifə olmadığından axtarışda tapılmırsınız.' },
      { h: 'Qəbula yazılmaq çətindir', p: 'Pasiyent yalnız zəng edə bilir, iş saatlarından sonra müraciət itir.' },
      { h: 'Həkimlər tanınmır', p: 'Mütəxəssislərin təcrübəsi və ixtisası saytda göstərilmir.' },
    ],
    solutions: [
      { service: 'veb-saytlar', h: 'Klinika saytı', p: 'Həkim profilləri, xidmət səhifələri və onlayn qəbul forması.' },
      { service: 'seo', h: 'Xidmət SEO-su', p: 'Hər müalicə üçün axtarış niyyətinə uyğun, aydın dilli səhifələr.' },
      { service: 'ai-avtomatlasdirma', h: 'Qəbul avtomatlaşdırması', p: 'Müraciətlərin CRM-ə düşməsi və avtomatik xatırlatma mesajları.' },
      { service: 'korporativ-email', h: 'Peşəkar poçt', p: 'Klinika domenində email və pasiyent məlumatı üçün təhlükəsiz yazışma.' },
    ],
    checklist: ['Hər xidmətin ayrıca səhifəsi var', 'Həkim profilləri foto və ixtisasla', 'Onlayn qəbul forması işləyir', 'Ünvan və iş saatları schema ilə işarələnib', 'Rəylər müntəzəm toplanır'],
    faq: [
      { q: 'Tibbi reklamda məhdudiyyətlər varmı?', a: 'Bəli, Google və Meta tibbi xidmətlər üçün xüsusi qaydalar tətbiq edir. Kampaniyaları bu qaydalara uyğun qurur, iddialı vədlərdən qaçırıq.' },
      { q: 'Onlayn qəbul mövcud sistemlə işləyə bilərmi?', a: 'Əksər hallarda bəli. Mövcud cədvəl və ya CRM sisteminizə inteqrasiya imkanını təhlil mərhələsində yoxlayırıq.' },
    ],
  },
  {
    slug: 'tehsil', icon: 'book', title: 'Təhsil və kurslar', short: 'Qeydiyyat, lead toplama, kontent',
    metaTitle: 'Təhsil mərkəzləri və kurslar üçün sayt, reklam və SMM',
    metaDesc: 'Kurslar və təhsil mərkəzləri üçün qeydiyyat formalı sayt, hədəfli reklam, lead-lərin CRM-də idarəsi və faydalı kontent.',
    h1: ['Təhsil mərkəzləri üçün ', 'qeydiyyat', ' gətirən marketinq.'],
    lead: 'Valideyn və tələbə qərar verməzdən əvvəl proqramı, müəllimləri və nəticələri müqayisə edir. Aydın proqram səhifələri, hədəfli reklam və sürətli cavab sistemi qururuq.',
    challenges: [
      { h: 'Müraciətlər itir', p: 'Instagram, WhatsApp və zənglərdən gələn sorğular bir yerdə toplanmır.' },
      { h: 'Mövsümi axın', p: 'Qeydiyyat dövründə büdcə səmərəsiz xərclənir, qalan aylarda axın dayanır.' },
      { h: 'Proqramlar aydın deyil', p: 'Kurs müddəti, cədvəl və qiymət haqqında məlumat dağınıqdır.' },
    ],
    solutions: [
      { service: 'veb-saytlar', h: 'Proqram səhifələri', p: 'Hər kurs üçün müddət, cədvəl, müəllim və qeydiyyat forması.' },
      { service: 'reklam', h: 'Mövsümi kampaniyalar', p: 'Qeydiyyat dövrünə uyğun planlanmış Google və Meta reklamı.' },
      { service: 'ai-avtomatlasdirma', h: 'Lead idarəsi', p: 'Bütün müraciətlərin CRM-də toplanması və avtomatik cavab.' },
      { service: 'smm', h: 'Faydalı kontent', p: 'Tələbə nəticələri, dərsdən fraqmentlər və məsləhət videoları.' },
    ],
    checklist: ['Hər proqramın ayrıca səhifəsi var', 'Qeydiyyat forması 1 dəqiqədən az çəkir', 'Müraciətlərə 1 saat ərzində cavab verilir', 'Reklam qeydiyyat təqviminə uyğun planlanıb', 'Tələbə rəyləri saytda göstərilir'],
    faq: [
      { q: 'Qeydiyyat dövründən kənarda reklam lazımdır?', a: 'Çox vaxt az büdcə ilə davamlı tanıtım və faydalı kontent mövsüm başlayanda reklamın qiymətini aşağı salır. Planı mövsümünüzə görə qururuq.' },
      { q: 'WhatsApp müraciətlərini də CRM-ə yığmaq olar?', a: 'Bəli, WhatsApp Business və sayt formalarından gələn müraciətləri bir CRM-də toplamaq mümkündür.' },
    ],
  },
  {
    slug: 'dasinmaz-emlak', icon: 'pin', title: 'Daşınmaz əmlak', short: 'Obyekt səhifələri, lead, retargetinq',
    metaTitle: 'Daşınmaz əmlak və tikinti şirkətləri üçün rəqəmsal marketinq',
    metaDesc: 'Daşınmaz əmlak agentlikləri və tikinti şirkətləri üçün obyekt səhifələri, lead toplayan reklam, retargetinq və CRM inteqrasiyası.',
    h1: ['Daşınmaz əmlak üçün ', 'keyfiyyətli', ' müraciətlər.'],
    lead: 'Əmlak alqı-satqısında qərar uzun çəkir. Obyekti ən yaxşı şəkildə göstərən səhifələr, düzgün auditoriyaya reklam və hər müraciəti izləyən sistem qururuq.',
    challenges: [
      { h: 'Çox zəng, az alıcı', p: 'Reklamdan gələn müraciətlərin çoxu ciddi alıcı deyil.' },
      { h: 'Obyekt məlumatı dağınıqdır', p: 'Planlar, şəkillər və qiymətlər müxtəlif yerlərdədir.' },
      { h: 'Uzun qərar dövrü', p: 'Maraqlanan şəxs aylarla düşünür və bu müddətdə unudulur.' },
    ],
    solutions: [
      { service: 'veb-saytlar', h: 'Obyekt səhifələri', p: 'Planlar, qalereya, xəritə və müraciət forması bir səhifədə.' },
      { service: 'reklam', h: 'Lead reklamı', p: 'Ciddi alıcıları süzən sual-cavablı formalar və retargetinq.' },
      { service: 'email-marketinq', h: 'Uzunmüddətli əlaqə', p: 'Yeni obyektlər və qiymət dəyişiklikləri barədə məktublar.' },
      { service: 'brendinq', h: 'Layihə brendinqi', p: 'Yaşayış kompleksi üçün ad, loqo və vizual kimlik.' },
    ],
    checklist: ['Hər obyektin ayrıca səhifəsi var', 'Formada büdcə və vaxt sualı var', 'Retargetinq auditoriyası qurulub', 'Müraciətlər CRM-də mərhələlərlə izlənir', 'Şəkillər peşəkar və sıxılmışdır'],
    faq: [
      { q: 'Müraciətlərin keyfiyyətini necə artırırsınız?', a: 'Formaya büdcə, vaxt və məqsəd sualları əlavə edir, reklamı maraq göstərmiş auditoriyaya yönəldir və CRM-də hansı kampaniyanın satış gətirdiyini izləyirik.' },
      { q: 'Tikinti layihəsi üçün brendinq edirsiniz?', a: 'Bəli, yaşayış kompleksi üçün ad, loqo, vizual kimlik və satış materialları hazırlayırıq.' },
    ],
  },
  {
    slug: 'turizm-ve-otel', icon: 'globe', title: 'Turizm və otellər', short: 'Birbaşa bron, çoxdilli sayt',
    metaTitle: 'Otel və turizm şirkətləri üçün çoxdilli sayt və reklam',
    metaDesc: 'Otellər və turizm şirkətləri üçün çoxdilli sayt, birbaşa bron, xarici bazarlara reklam və Google-da görünmə.',
    h1: ['Turizm üçün ', 'birbaşa', ' bron gətirən sayt.'],
    lead: 'Qonaqlar sizi müxtəlif ölkələrdən və dillərdə axtarır. Çoxdilli, sürətli sayt və hədəf bazarlara reklamla vasitəçi platformalardan asılılığı azaldırıq.',
    challenges: [
      { h: 'Vasitəçi komissiyası', p: 'Bronların çoxu komissiya alan platformalardan gəlir.' },
      { h: 'Tək dilli sayt', p: 'Xarici qonaqlar saytı öz dilində tapmır və anlamır.' },
      { h: 'Mövsümilik', p: 'Aşağı mövsümdə doluluq kəskin düşür.' },
    ],
    solutions: [
      { service: 'veb-saytlar', h: 'Çoxdilli sayt', p: 'AZ, EN, RU və digər dillərdə sürətli sayt və birbaşa bron forması.' },
      { service: 'seo', h: 'Beynəlxalq SEO', p: 'Hər dil üçün düzgün hreflang və hədəf bazarın açar sözləri.' },
      { service: 'reklam', h: 'Bazar üzrə reklam', p: 'Hədəf ölkələrə yönəlmiş Google və Meta kampaniyaları.' },
      { service: 'email-marketinq', h: 'Təkrar qonaq', p: 'Keçmiş qonaqlara mövsüm təklifləri və xüsusi endirimlər.' },
    ],
    checklist: ['Sayt ən azı 3 dildədir', 'Birbaşa bron forması var', 'hreflang düzgün qurulub', 'Google Hotel / Business profili aktivdir', 'Keçmiş qonaqlara email göndərilir'],
    faq: [
      { q: 'Neçə dildə sayt hazırlayırsınız?', a: 'Adətən AZ, EN və RU, ehtiyac olarsa DE və digər dillər. Hər dil üçün ayrıca SEO ayarları qurulur.' },
      { q: 'Birbaşa bronu necə artırmaq olar?', a: 'Saytda daha yaxşı qiymət və ya bonus təklifi, sürətli bron forması və keçmiş qonaqlara email ilə birbaşa bronların payını artırmaq olar.' },
    ],
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
